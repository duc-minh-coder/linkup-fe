const fs = require("fs");
const path = require("path");

const targetFolders = ["src/pages", "src/layouts", "src/components"];

function containsJSX(code) {
    return /<[\w\d]+[\s>]/.test(code); // đơn giản, bắt đầu với <Tag>
}

function walk(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            walk(fullPath);
        } else if (path.extname(file) === ".js") {
            const content = fs.readFileSync(fullPath, "utf8");
            if (containsJSX(content)) {
                const newPath = fullPath.replace(/\.js$/, ".jsx");
                fs.renameSync(fullPath, newPath);
                console.log(`✅ Renamed: ${file} → ${path.basename(newPath)}`);
            }
        }
    });
}

targetFolders.forEach(folder => {
    const absPath = path.resolve(folder);
    if (fs.existsSync(absPath)) {
        walk(absPath);
    } else {
        console.warn(`❌ Folder not found: ${absPath}`);
    }
});
