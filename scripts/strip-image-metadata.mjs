// Usage: node scripts/strip-image-metadata.mjs <file.jpg> [...]
import { readFileSync, writeFileSync } from 'node:fs';
import { hasMetadata, stripMetadata } from '../src/lib/jpeg-metadata.ts';

for (const path of process.argv.slice(2)) {
  const jpeg = readFileSync(path);
  if (!hasMetadata(jpeg)) {
    console.log(`clean     ${path}`);
    continue;
  }
  writeFileSync(path, stripMetadata(jpeg));
  console.log(`stripped  ${path}`);
}
