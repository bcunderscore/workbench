import { describe, expect, it } from 'vitest';
import { hasMetadata, stripMetadata } from './jpeg-metadata';

const segment = (marker: number, payload: number[]) => [0xff, marker, 0, payload.length + 2, ...payload];
const SCAN = [0xff, 0xda, 0, 3, 0x01, 0x12, 0x34, 0xff, 0xd9];
const jpeg = (...segments: number[][]) => Uint8Array.from([0xff, 0xd8, ...segments.flat(), ...SCAN]);

const JFIF = segment(0xe0, [0x4a, 0x46]);
const EXIF = segment(0xe1, [0x45, 0x78, 0x69, 0x66]);
const ICC = segment(0xe2, [0x49, 0x43]);
const IPTC = segment(0xed, [0x50, 0x68]);

describe('stripMetadata', () => {
  it('removes EXIF/XMP and IPTC segments and keeps everything else byte-for-byte', () => {
    const stripped = stripMetadata(jpeg(JFIF, EXIF, ICC, IPTC));
    expect(hasMetadata(stripped)).toBe(false);
    expect(Array.from(stripped)).toEqual(Array.from(jpeg(JFIF, ICC)));
  });

  it('leaves a clean JPEG unchanged', () => {
    const clean = jpeg(JFIF, ICC);
    expect(hasMetadata(clean)).toBe(false);
    expect(Array.from(stripMetadata(clean))).toEqual(Array.from(clean));
  });
});

describe('shipped images', () => {
  it('carry no EXIF, XMP, or IPTC metadata (GPS lives there)', () => {
    const jpegs = import.meta.glob<string>(['/src/**/*.{jpg,jpeg,JPG,JPEG}', '/public/**/*.{jpg,jpeg,JPG,JPEG}'], {
      query: '?inline',
      import: 'default',
      eager: true,
    });
    const bytes = (dataUri: string) => Uint8Array.from(atob(dataUri.split(',')[1]), (c) => c.charCodeAt(0));
    expect(Object.keys(jpegs).length).toBeGreaterThan(0);
    const offenders = Object.keys(jpegs).filter((path) => hasMetadata(bytes(jpegs[path])));
    expect(offenders, 'run: node scripts/strip-image-metadata.mjs <files>').toEqual([]);
  });
});
