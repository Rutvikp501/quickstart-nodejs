#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const source = path.join(__dirname, "../template");
const target = process.cwd();

function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  fs.readdirSync(src).forEach(file => {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);

    if (fs.lstatSync(srcFile).isDirectory()) {
      copyRecursive(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  });
}

copyRecursive(source, target);

console.log("✅ Quickstart Node.js project created!");
console.log("👉 Next steps:");
console.log("   npm install");
console.log("   npm start");
