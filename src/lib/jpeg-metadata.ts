// APP1 holds EXIF and XMP, where phones write GPS coordinates; APP13 holds IPTC.
const METADATA_MARKERS = new Set([0xe1, 0xed]);
const START_OF_SCAN = 0xda;

type Segment = { marker: number; start: number; end: number };

function headerSegments(jpeg: Uint8Array): Segment[] {
  if (jpeg[0] !== 0xff || jpeg[1] !== 0xd8) throw new Error('not a JPEG');
  const segments: Segment[] = [];
  let i = 2;
  while (jpeg[i] === 0xff && jpeg[i + 1] !== START_OF_SCAN) {
    const end = i + 2 + ((jpeg[i + 2] << 8) | jpeg[i + 3]);
    segments.push({ marker: jpeg[i + 1], start: i, end });
    i = end;
  }
  return segments;
}

export function hasMetadata(jpeg: Uint8Array): boolean {
  return headerSegments(jpeg).some((s) => METADATA_MARKERS.has(s.marker));
}

/** Drops metadata segments byte-for-byte; pixel data is not re-encoded. */
export function stripMetadata(jpeg: Uint8Array): Uint8Array {
  const dropped = headerSegments(jpeg).filter((s) => METADATA_MARKERS.has(s.marker));
  const out = new Uint8Array(jpeg.length - dropped.reduce((n, s) => n + s.end - s.start, 0));
  let cursor = 0;
  let written = 0;
  for (const s of [...dropped, { start: jpeg.length, end: jpeg.length }]) {
    out.set(jpeg.subarray(cursor, s.start), written);
    written += s.start - cursor;
    cursor = s.end;
  }
  return out;
}
