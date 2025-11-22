import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { build } from "esbuild";

const REPO_URL = "https://codeberg.org/ampmod/extensions";
const BRANCH = "pages";
const TARGET_DIR = "extensions";
const REMOVE_FILES = ["index.html", "_headers"];
const REMOVE_FOLDERS = ["test"];

function removeRecursive(p) {
  if (!fs.existsSync(p)) return;
  const stat = fs.statSync(p);
  if (stat.isDirectory()) {
    fs.readdirSync(p).forEach(f => removeRecursive(path.join(p, f)));
    fs.rmdirSync(p);
  } else {
    fs.unlinkSync(p);
  }
}
removeRecursive(TARGET_DIR);

execSync(`git clone --branch ${BRANCH} --depth 1 ${REPO_URL} ${TARGET_DIR}`, { stdio: "inherit" });

for (const file of REMOVE_FILES) {
  const filePath = path.join(TARGET_DIR, file);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

for (const folder of REMOVE_FOLDERS) {
  const folderPath = path.join(TARGET_DIR, folder);
  removeRecursive(folderPath);
}

function getJsFiles(dir) {
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "_app") continue;
      files = files.concat(getJsFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      files.push(fullPath);
    }
  }
  return files;
}

const jsFiles = getJsFiles(TARGET_DIR);

(async () => {
  for (const file of jsFiles) {
    const outFile = file;
    await build({
      entryPoints: [file],
      outfile: outFile,
      minify: true,
      allowOverwrite: true,
    });
  }
  console.log("Extensions pulled successfully!");
})();
