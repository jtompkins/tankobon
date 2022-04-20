import * as path from 'path';
import { Command } from 'commander';
import { ManganatoSource } from './sources/manganato.js';
import { EPubRenderer } from './renderers/epubRenderer.js';
const program = new Command();
program.name('Mangaka').description('A script to download Manga pages and bind them into an ePub').version('0.1');
program.requiredOption('-m, --manga-stub <stub>', 'The Manganato URL stub for the manga series');
program.requiredOption('-s, --chapter-stubs <stubs...>', 'A list of chapter stubs to download');
program.requiredOption('-t, --title <title>', 'The title of the output ePub');
program.option('-o, --output <path>', 'The fully-resolved local path to write the output ePub');
program.option('-a, --author <author>', 'The author of the output ePub');
program.option('-c, --cover <path>', 'The fully-resolved local path to a cover image');
program.parse();
const options = program.opts();
console.log('options', options);
const job = {
  title: options.title,
  author: options.author || 'Manga Author',
  coverPath: options.cover,
  outputPath: path.resolve(options.output || '.'),
  source: {
    type: 'manganato',
    mangaStub: options.mangaStub,
    chapterStubs: options.chapterStubs,
  },
};
console.log('job', job);
const source = new ManganatoSource(job.source);
const renderer = new EPubRenderer(job);
await source.setup();
await renderer.setup();
console.log('Downloading files...');
const chapterFiles = await source.fetch();
console.log('Writing ebook to', job.outputPath);
await renderer.render(chapterFiles);
console.log('Cleaning up temp directories...');
await source.cleanup();
await renderer.cleanup();
console.log('Done!');
//# sourceMappingURL=index.js.map