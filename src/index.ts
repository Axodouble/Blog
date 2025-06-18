import { readdirSync, existsSync, mkdirSync, writeFile } from 'fs';
import { join, extname } from 'path';
import { getMarkdownFiles } from './tools/files';
import { translateMarkdownToHtml, batchTranslate } from './tools/translate';

const markdownDir = join(process.cwd(), 'input');
const defaultOutputDir = join(process.cwd(), 'output');

// Parse command line arguments
const args = process.argv.slice(2);
let inputDir = markdownDir;
let outputDir = defaultOutputDir;
let singleFile = '';

// Process arguments
for (let i = 0; i < args.length; i++) {
    if (args[i] === '-i' && args[i + 1]) {
        inputDir = join(process.cwd(), args[i + 1]!);
        i++;
    } else if (args[i] === '-o' && args[i + 1]) {
        outputDir = join(process.cwd(), args[i + 1]!);
        i++;
    } else if (args[i] === '-f' && args[i + 1]) {
        // Add ability to process a single file
        singleFile = args[i + 1]!;
        i++;
    }
}

// Ensure output directory exists
if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
}

console.log('=== Markdown to HTML Converter ===');

// Process either a single file or all files in a directory
if (singleFile) {
    const filePath = singleFile.startsWith('/') ? singleFile : join(process.cwd(), singleFile);
    
    if (!existsSync(filePath)) {
        console.error(`Error: File does not exist: ${filePath}`);
        process.exit(1);
    }
    
    if (extname(filePath).toLowerCase() !== '.md') {
        console.error(`Error: File is not a markdown file: ${filePath}`);
        process.exit(1);
    }
    
    console.log(`Processing single file: ${filePath}`);
    const outputPath = translateMarkdownToHtml(filePath, outputDir);
    console.log(`Generated HTML: ${outputPath}`);
} else {
    // Process all markdown files in the input directory
    try {
        const files = getMarkdownFiles(inputDir);
        
        if (files.length === 0) {
            console.log(`No markdown files found in: ${inputDir}`);
        } else {
            console.log(`Found ${files.length} markdown files in: ${inputDir}`);
            const outputFiles = batchTranslate(files, outputDir);
            console.log(`Generated ${outputFiles.length} HTML files in: ${outputDir}`);
            outputFiles.forEach(file => console.log(` - ${file.title || file.filename}`));
        }
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}