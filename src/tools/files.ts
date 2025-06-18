import { readdirSync } from "fs";
import { extname, join } from "path";
import { existsSync } from "fs";

function getMarkdownFiles(dir: string): string[] {
  if (!dir) {
    throw new Error("Directory path is required");
  }

  if (!existsSync(dir)) {
    throw new Error(`Directory does not exist: ${dir}`);
  }
    
  return readdirSync(dir)
    .filter((file) => extname(file).toLowerCase() === ".md")
    .map((file) => join(dir, file));
}

export { getMarkdownFiles };
