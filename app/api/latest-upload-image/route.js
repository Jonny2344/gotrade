import { promises as fs } from 'fs';
import path from 'path';

function detectMimeType(buffer) {
  if (!buffer || buffer.length < 12) {
    return 'application/octet-stream';
  }

  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return 'image/png';
  }

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }

  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return 'image/webp';
  }

  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
    return 'image/gif';
  }

  return 'application/octet-stream';
}

export async function GET() {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  const preferredFilePath = path.join(uploadsDir, '15mmcopper.png');

  try {
    try {
      const preferredBuffer = await fs.readFile(preferredFilePath);
      const preferredMimeType = detectMimeType(preferredBuffer);

      if (preferredMimeType.startsWith('image/')) {
        return new Response(preferredBuffer, {
          status: 200,
          headers: {
            'Content-Type': preferredMimeType,
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        });
      }
    } catch {
      // Preferred file not present yet; fall back to latest upload.
    }

    const entries = await fs.readdir(uploadsDir, { withFileTypes: true });
    const files = entries.filter((entry) => entry.isFile());

    if (files.length === 0) {
      return new Response('No uploaded images found.', { status: 404 });
    }

    const filesWithStats = await Promise.all(
      files.map(async (file) => {
        const absolutePath = path.join(uploadsDir, file.name);
        const stat = await fs.stat(absolutePath);
        return {
          absolutePath,
          mtimeMs: stat.mtimeMs,
        };
      })
    );

    filesWithStats.sort((a, b) => b.mtimeMs - a.mtimeMs);
    const latestFilePath = filesWithStats[0].absolutePath;
    const fileBuffer = await fs.readFile(latestFilePath);
    const mimeType = detectMimeType(fileBuffer);

    if (!mimeType.startsWith('image/')) {
      return new Response('Latest upload is not an image file.', { status: 415 });
    }

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch {
    return new Response('Unable to read uploaded image.', { status: 500 });
  }
}
