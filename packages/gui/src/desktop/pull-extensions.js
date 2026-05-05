import { execSync } from "child_process";
import fs from "fs/promises";
import path from "path";
import zlib from "zlib";
import { pipeline } from "stream/promises";
import { createReadStream, createWriteStream } from "fs";
import crypto from "crypto";

async function main() {
  const bundleUrl = "https://codeberg.org/ampmod/extensions/archive/pages.bundle";
  const tmpDir = `/tmp/ampmod-${crypto.randomUUID()}`;
  const targetDir = path.resolve(import.meta.dirname, "extensions");
  const bundlePath = path.join(tmpDir, "pages.bundle");
  const exclude = ["index.html", "_headers", "test", "favicon.ico", ".github", ".vscode"];

  await fs.rm(tmpDir, { recursive: true, force: true });
  await fs.rm(targetDir, { recursive: true, force: true });
  await fs.mkdir(tmpDir, { recursive: true });

  try {
    execSync(`curl -L ${bundleUrl} -o ${bundlePath}`, { stdio: 'ignore' });
    execSync(`git clone ${bundlePath} ${path.join(tmpDir, "repo")}`, { stdio: 'ignore' });
    
    await fs.cp(path.join(tmpDir, "repo"), targetDir, { recursive: true });
    await fs.rm(path.join(targetDir, ".git"), { recursive: true, force: true });

    for (const item of exclude) {
      const excludePath = path.join(targetDir, item);
      await fs.rm(excludePath, { recursive: true, force: true });
    }

    const files = await fs.readdir(targetDir, { recursive: true });
    for (const file of files) {
      const filePath = path.join(targetDir, file);
      const stat = await fs.stat(filePath);
      
      if (stat.isFile() && !file.endsWith('.br')) {
        await pipeline(
          createReadStream(filePath),
          zlib.createBrotliCompress(),
          createWriteStream(`${filePath}.br`)
        );
        await fs.rm(filePath);
      }
    }
  } catch (error) {
    process.exit(1);
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}

main();