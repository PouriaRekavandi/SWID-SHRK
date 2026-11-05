import fs from 'fs';
import path from 'path';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';

const projectRoot = process.cwd();
const logoPng = path.join(projectRoot, 'src/assets/logo_transparent.png');
const logoJpg = path.join(projectRoot, 'src/assets/logo.jpg');
const profilePng = path.join(projectRoot, 'src/assets/profile.png');
const profileJpg = path.join(projectRoot, 'src/assets/profile.jpg');

// Pure Node.js high-precision flood-fill background removal (Zero external dependencies)
function createTransparentLogo() {
  if (!fs.existsSync(logoJpg)) {
    console.warn('logo.jpg not found, skipping transparent logo generation.');
    return;
  }

  console.log('Generating high-resolution transparent logo with pure Node.js...');
  const rawJpg = fs.readFileSync(logoJpg);
  const decoded = jpeg.decode(rawJpg, { useTArray: true });
  const { width, height, data } = decoded;

  const png = new PNG({ width, height });

  // 4-way BFS flood-fill from all 4 borders to remove off-white background
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let qHead = 0;
  let qTail = 0;

  const push = (idx) => {
    if (!visited[idx]) {
      visited[idx] = 1;
      queue[qTail++] = idx;
    }
  };

  // Seed borders
  for (let x = 0; x < width; x++) {
    push(x);
    push((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    push(y * width);
    push(y * width + width - 1);
  }

  while (qHead < qTail) {
    const idx = queue[qHead++];
    const o = idx * 4;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];

    // Background threshold: off-white/light-gray (#dcdcdc to #ffffff)
    if (r >= 215 && g >= 215 && b >= 215) {
      visited[idx] = 2; // Marked as 100% transparent exterior background
      const x = idx % width;
      const y = (idx / width) | 0;

      if (x > 0) push(idx - 1);
      if (x < width - 1) push(idx + 1);
      if (y > 0) push(idx - width);
      if (y < height - 1) push(idx + width);
    }
  }

  for (let i = 0; i < width * height; i++) {
    const o = i * 4;
    png.data[o] = data[o];
    png.data[o + 1] = data[o + 1];
    png.data[o + 2] = data[o + 2];
    if (visited[i] === 2) {
      png.data[o + 3] = 0; // Alpha 0 = completely transparent
    } else {
      png.data[o + 3] = 255; // Alpha 255 = fully opaque crest
    }
  }

  const pngBuffer = PNG.sync.write(png);
  fs.writeFileSync(logoPng, pngBuffer);

  // Copy to public and docs folders
  const pubDir = path.join(projectRoot, 'public');
  if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });
  fs.writeFileSync(path.join(pubDir, 'logo_transparent.png'), pngBuffer);

  const docsDir = path.join(projectRoot, 'docs');
  if (fs.existsSync(docsDir)) {
    fs.writeFileSync(path.join(docsDir, 'logo_transparent.png'), pngBuffer);
  }

  console.log(`Successfully created transparent logo (${pngBuffer.length} bytes)`);
}

function createProfilePng() {
  if (!fs.existsSync(profileJpg)) return;

  const rawJpg = fs.readFileSync(profileJpg);
  const decoded = jpeg.decode(rawJpg, { useTArray: true });
  const png = new PNG({ width: decoded.width, height: decoded.height });
  png.data.set(decoded.data);

  const pngBuffer = PNG.sync.write(png);
  fs.writeFileSync(profilePng, pngBuffer);

  const pubDir = path.join(projectRoot, 'public');
  if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });
  fs.writeFileSync(path.join(pubDir, 'profile.png'), pngBuffer);

  const docsDir = path.join(projectRoot, 'docs');
  if (fs.existsSync(docsDir)) {
    fs.writeFileSync(path.join(docsDir, 'profile.png'), pngBuffer);
  }
}

function ensureAssets() {
  // Always verify that logo_transparent.png exists AND has transparency
  let needsLogo = true;
  if (fs.existsSync(logoPng)) {
    try {
      const stats = fs.statSync(logoPng);
      if (stats.size > 20000) {
        // Quick verify first 25 pixels for transparency
        const buffer = fs.readFileSync(logoPng);
        const parsed = PNG.sync.read(buffer);
        // Corner pixel should be transparent (alpha == 0)
        if (parsed.data[3] === 0) {
          needsLogo = false;
        }
      }
    } catch {
      needsLogo = true;
    }
  }

  if (needsLogo) {
    createTransparentLogo();
  } else {
    // Sync to public and docs
    const buffer = fs.readFileSync(logoPng);
    const pubDir = path.join(projectRoot, 'public');
    if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });
    fs.writeFileSync(path.join(pubDir, 'logo_transparent.png'), buffer);

    const docsDir = path.join(projectRoot, 'docs');
    if (fs.existsSync(docsDir)) {
      fs.writeFileSync(path.join(docsDir, 'logo_transparent.png'), buffer);
    }
  }

  if (!fs.existsSync(profilePng)) {
    createProfilePng();
  }
}

ensureAssets();
