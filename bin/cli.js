#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const args = process.argv.slice(2);
console.log("Args:", args);
const projectName = args[0];

if (!projectName) {
  console.error("❌ Please provide a project name. Example: npx quickstart-nodejs my-app");
  process.exit(1);
}

const source = path.resolve(__dirname, "../template");
const target = path.resolve(process.cwd(), projectName);

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`❌ Source folder does not exist: ${src}`);
    process.exit(1);
  }
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  fs.readdirSync(src, { withFileTypes: true }).forEach(entry => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

console.log(`🔄 Generating '${projectName}' from template...`);
copyRecursive(source, target);

console.log(`✅ Project '${projectName}' created!`);
console.log("👉 Next steps:");
console.log(`  cd ${projectName}`);
console.log("  npm install");
console.log("  npm start");
console.log("🚀 Happy coding!");