import { readdirSync } from 'fs';
import { join, extname } from 'path';

const markdownDir = join(process.cwd() + '/markdown');

function getMarkdownFiles(dir: string): string[] {
    return readdirSync(dir)
        .filter(file => extname(file).toLowerCase() === '.md')
        .map(file => join(dir, file));
}

const args = process.argv.slice(2);
let inputDir = markdownDir;
let outputDir = join(process.cwd(), 'output');

for (let i = 0; i < args.length; i++) {
    if (args[i] === '-i' && args[i + 1]) {
        inputDir = join(process.cwd(), args[i + 1]!);
        i++;
    } else if (args[i] === '-o' && args[i + 1]) {
        outputDir = join(process.cwd(), args[i + 1]!);
        i++;
    }
}

const files = getMarkdownFiles(inputDir);
console.log('Markdown files:', files);
console.log('Output directory:', outputDir);