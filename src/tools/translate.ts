import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { extname, join, basename, dirname, resolve } from "path";
import { existsSync } from "fs";

/**
 * Extract title from markdown content
 * @param markdownContent The markdown content
 * @returns The extracted title or null if not found
 */
function extractTitleFromMarkdown(markdownContent: string): string | null {
  // Look for the first h1 heading (# Title)
  const h1Match = markdownContent.match(/^#\s+(.+)$/m);
  if (h1Match && h1Match[1]) {
    return h1Match[1].trim();
  }

  // If no h1 heading, look for YAML frontmatter title
  const frontmatterMatch = markdownContent.match(/^---\s*\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    let titleMatch: RegExpMatchArray | null = null;
    if (frontmatter) {
      titleMatch = frontmatter.match(/title:\s*['"]?(.*?)['"]?\s*(\n|$)/);
    }
    if (titleMatch && titleMatch[1]) {
      return titleMatch[1].trim();
    }
  }

  return null;
}

/**
 * Convert a markdown file to HTML with the same styling as index.html
 * @param markdownPath Path to the markdown file
 * @param outputDir Directory to write the HTML file to
 * @returns Object with the output path and title information
 */
export function translateMarkdownToHtml(
  markdownPath: string,
  outputDir: string
): {
  outputPath: string;
  title: string | null;
  filename: string;
} {
  // Ensure the markdown file exists
  if (!existsSync(markdownPath)) {
    throw new Error(`Markdown file does not exist: ${markdownPath}`);
  }

  // Read the markdown content
  const markdownContent = readFileSync(markdownPath, "utf-8");

  // Extract title from markdown
  const title = extractTitleFromMarkdown(markdownContent);

  // Convert markdown to HTML
  const htmlContent = convertMarkdownToHtml(markdownContent);

  // Get the filename without extension
  const fileNameWithoutExt = basename(markdownPath, extname(markdownPath));

  // Create output directory if it doesn't exist
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Create the output file path
  const outputPath = join(outputDir, `g.${fileNameWithoutExt}.html`);

  // Create a complete HTML document with the same styling as index.html
  const fullHtmlContent =
    fileNameWithoutExt === "append"
      ? htmlContent
      : wrapWithTemplate(
          `g.${fileNameWithoutExt}.html`,
          htmlContent,
          title || fileNameWithoutExt
        );

  // Write the HTML file
  writeFileSync(outputPath, fullHtmlContent);

  return {
    outputPath,
    title,
    filename: fileNameWithoutExt,
  };
}

/**
 * Convert markdown content to HTML
 * @param markdown Markdown content
 * @returns HTML content
 */
function convertMarkdownToHtml(markdown: string): string {
  // Pre-process the markdown content
  let processedMarkdown = markdown
    // Remove HTML comments
    .replace(/<!--[\s\S]*?-->/g, "")
    // Normalize line endings
    .replace(/\r\n/g, "\n");

  // Process the markdown by sections
  const sections = processCodeBlocks(processedMarkdown);

  // Process each section (code blocks are preserved, other content is processed as markdown)
  const processedSections = sections.map((section) => {
    if (section.type === "code") {
      return section.content;
    } else {
      return processMarkdownSection(section.content);
    }
  });

  // Join the sections back together
  return processedSections.join("");
}

/**
 * Process code blocks and separate them from regular markdown content
 * @param markdown The markdown content
 * @returns Array of sections with type (code or text) and content
 */
function processCodeBlocks(
  markdown: string
): { type: "code" | "text"; content: string }[] {
  const codeBlockRegex = /```([a-zA-Z]*)?\n([\s\S]*?)```/g;
  const sections: { type: "code" | "text"; content: string }[] = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      sections.push({
        type: "text",
        content: markdown.substring(lastIndex, match.index),
      });
    }

    // Add code block
    const language = match[1] || "";
    const code = match[2] || ""; // Ensure code is never undefined
    const languageClass = language ? ` class="language-${language}"` : "";
    sections.push({
      type: "code",
      content: `<pre><code${languageClass}>${escapeHtml(code)}</code></pre>`,
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < markdown.length) {
    sections.push({
      type: "text",
      content: markdown.substring(lastIndex),
    });
  }

  return sections;
}

/**
 * Process a markdown section (non-code block)
 * @param markdown The markdown content
 * @returns Processed HTML
 */
function processMarkdownSection(markdown: string): string {
  // Handle tables first
  markdown = processTables(markdown);

  // Basic markdown conversion
  let html = markdown
    // Handle headings
    .replace(/^# (.*$)/gm, "<h1>$1</h1>")
    .replace(/^## (.*$)/gm, "<h2>$1</h2>")
    .replace(/^### (.*$)/gm, "<h3>$1</h3>")
    .replace(/^#### (.*$)/gm, "<h4>$1</h4>")
    .replace(/^##### (.*$)/gm, "<h5>$1</h5>")
    .replace(/^###### (.*$)/gm, "<h6>$1</h6>")

    // Handle horizontal rules
    .replace(/^\s*---\s*$/gm, "<hr>")
    .replace(/^\s*\*\*\*\s*$/gm, "<hr>")
    .replace(/^\s*___\s*$/gm, "<hr>")

    // Handle blockquotes (need to handle nested blockquotes better)
    .replace(
      /^>\s*>\s*>\s*(.*)$/gm,
      '<blockquote class="blockquote-level-3">$1</blockquote>'
    )
    .replace(
      /^>\s*>\s*(.*)$/gm,
      '<blockquote class="blockquote-level-2">$1</blockquote>'
    )
    .replace(/^>\s*(.*)$/gm, "<blockquote>$1</blockquote>")

    // Handle unordered lists
    .replace(/^\s*[\*\-\+]\s+(.*)$/gm, "<li>$1</li>")

    // Handle ordered lists
    .replace(/^\s*\d+\.\s+(.*)$/gm, "<li>$1</li>")

    // Handle task lists
    .replace(
      /<li>\[\s*x\s*\]\s*(.*)<\/li>/gim,
      '<li class="task-list-item checked">$1</li>'
    )
    .replace(
      /<li>\[\s*\]\s*(.*)<\/li>/gim,
      '<li class="task-list-item">$1</li>'
    )

    // Handle inline code (do this before other inline formatting)
    .replace(/`([^`]+)`/g, "<code>$1</code>");

  // Handle text formatting (after inline code to avoid conflicts)
  html = html
    .replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/___(.*)___/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.*)__/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/_([^_]+)_/g, "<em>$1</em>")
    .replace(/~~(.*?)~~/g, "<del>$1</del>");

  // Handle links and images
  html = html
    .replace(
      /!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)/g,
      '<img src="$2" alt="$1" title="$3">'
    )
    .replace(
      /\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)/g,
      '<a href="$2" title="$3">$1</a>'
    );

  // Wrap lists properly
  html = wrapLists(html);

  // Handle paragraphs (must come after lists and other block elements)
  html = processParagraphs(html);

  return html;
}

/**
 * Process tables in markdown
 * @param markdown The markdown content
 * @returns HTML for tables
 */
function processTables(markdown: string): string {
  // Find table blocks in the markdown
  const tableRegex = /^\|(.+)\|\s*\n\|(?:[-:]+\|)+\s*\n((?:\|.+\|\s*\n)+)/gm;

  return markdown.replace(tableRegex, (match, headerRow, bodyRows) => {
    // Process header
    const headers = headerRow
      .split("|")
      .map((cell: string) => cell.trim())
      .filter((cell: string) => cell);
    const alignments = bodyRows
      .split("\n")[0]
      .split("|")
      .map((cell: string) => {
        cell = cell.trim();
        if (cell.startsWith(":") && cell.endsWith(":")) return "center";
        if (cell.endsWith(":")) return "right";
        return "left";
      })
      .filter((align: string) => align);

    // Process body rows
    const rows = bodyRows.trim().split("\n").slice(1);

    let tableHtml = "<table>\n  <thead>\n    <tr>\n";

    // Add headers
    headers.forEach((header: string, index: number) => {
      const align = index < alignments.length ? alignments[index] : "left";
      tableHtml += `      <th style="text-align: ${align}">${header}</th>\n`;
    });

    tableHtml += "    </tr>\n  </thead>\n  <tbody>\n";

    // Add rows
    rows.forEach((row: string) => {
      const cells = row
        .split("|")
        .map((cell: string) => cell.trim())
        .filter((cell: string) => cell);
      tableHtml += "    <tr>\n";

      cells.forEach((cell: string, index: number) => {
        const align = index < alignments.length ? alignments[index] : "left";
        tableHtml += `      <td style="text-align: ${align}">${cell}</td>\n`;
      });

      tableHtml += "    </tr>\n";
    });

    tableHtml += "  </tbody>\n</table>";

    return tableHtml;
  });
}

/**
 * Wrap list items in appropriate list tags
 * @param html HTML with list items
 * @returns HTML with properly wrapped lists
 */
function wrapLists(html: string): string {
  // Split by lines
  const lines = html.split("\n");
  let inList = false;
  let listType = "";
  let result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line === undefined) {
      continue;
    }

    if (line.includes("<li>") || line.includes('<li class="task-list-item')) {
      // Determine list type
      if (!inList) {
        // Check if it's a task list
        if (line.includes("task-list-item")) {
          listType = 'ul class="task-list"';
        }
        // Check if it's an ordered list by looking at the original markdown
        else if (
          i > 0 &&
          lines[i - 1] &&
          /^\s*\d+\.\s+/.test(lines[i - 1] as string)
        ) {
          listType = "ol";
        }
        // Default to unordered list
        else {
          listType = "ul";
        }

        result.push(`<${listType}>`);
        inList = true;
      }

      result.push(line);
    } else {
      if (inList) {
        result.push(`</${listType.split(" ")[0]}>`);
        inList = false;
      }

      result.push(line);
    }
  }

  // Close any open list
  if (inList) {
    result.push(`</${listType.split(" ")[0]}>`);
  }

  return result.join("\n");
}

/**
 * Process paragraphs in markdown
 * @param html HTML content
 * @returns HTML with proper paragraph tags
 */
function processParagraphs(html: string): string {
  // Split content by line breaks
  const lines = html.split("\n");
  let result: string[] = [];
  let currentParagraph: string[] = [];

  // Block-level elements that should not be wrapped in <p> tags
  const blockElements = [
    "<h1>",
    "<h2>",
    "<h3>",
    "<h4>",
    "<h5>",
    "<h6>",
    "<ul>",
    "<ol>",
    "<li>",
    "<blockquote>",
    "<hr>",
    "<table>",
    "<pre>",
    "<div>",
    "</ul>",
    "</ol>",
    "</blockquote>",
    "</table>",
    "</pre>",
    "</div>",
    "<p>",
    "</p>",
  ];

  const isBlockElement = (line: string) => {
    return blockElements.some((element) => line.trim().startsWith(element));
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line === undefined) {
      continue;
    }

    const trimmedLine = line.trim();

    // Skip empty lines
    if (trimmedLine === "") {
      if (currentParagraph.length > 0) {
        result.push(`<p>${currentParagraph.join(" ")}</p>`);
        currentParagraph = [];
      }
      continue;
    }

    // If line is a block element, add any current paragraph and then add the block element
    if (isBlockElement(trimmedLine)) {
      if (currentParagraph.length > 0) {
        result.push(`<p>${currentParagraph.join(" ")}</p>`);
        currentParagraph = [];
      }
      result.push(trimmedLine);
    }
    // Otherwise, add line to current paragraph
    else {
      currentParagraph.push(trimmedLine);
    }
  }

  // Add any remaining paragraph
  if (currentParagraph.length > 0) {
    result.push(`<p>${currentParagraph.join(" ")}</p>`);
  }

  return result.join("\n");
}

/**
 * Escape HTML special characters
 * @param text Text to escape
 * @returns Escaped text
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Wrap HTML content with the same template and styling as index.html
 * @param htmlContent The HTML content to wrap
 * @param title The title for the page
 * @returns Complete HTML document
 */
function wrapWithTemplate(
  filename: string,
  htmlContent: string,
  title: string
): string {
  return `<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title} - Axodouble</title>
  <link rel="shortcut icon" href="favicon.png" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${title} - Axodouble">
  <meta name="keywords" content="axodouble, axodouble.com, Axodouble, ${title.toLowerCase()}">
  <link rel="canonical" href="https://axodouble.com/${title.toLowerCase()}">

  <link rel="stylesheet" type="text/css" href="style.css?d=${Date.now()}" />
</head>

<body>
  <svg href="index.html">
    <image href="dev.svg" width="100%" height="100%"  />
  </svg>
  <span>
    <a href="index.html">Axodouble</a>/<span class="white">${filename}</span>;<br>
  </span>
  
  <div class="content-container">
    ${htmlContent}
  </div>
</body>
</html>`;
}

/**
 * Batch translate multiple markdown files to HTML
 * @param markdownPaths Array of paths to markdown files
 * @param outputDir Directory to write the HTML files to
 * @returns Array of paths to generated HTML files
 */
export function batchTranslate(markdownPaths: string[], outputDir: string) {
  if (!markdownPaths || markdownPaths.length === 0) {
    throw new Error("No markdown files provided");
  }

  const result = markdownPaths
    .map((path) => translateMarkdownToHtml(path, outputDir))
    .filter((res) => res.filename !== "append");

  const blogList = result.map((file) => {
    return {
      filename: file.filename,
      title: file.title || file.filename,
    };
  });

  writeFileSync(
    join(outputDir, "g.blog-list.json"),
    JSON.stringify(blogList, null, 2),
    "utf-8"
  );

  return result;
}
