import {build} from "esbuild";
import chokidar from "chokidar";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

const isWatchMode = process.argv.includes("--watch");

const getTimestamp = () => {
    const dateFormat = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    }

    return new Date().toLocaleString(undefined, dateFormat);
}


const srcDir = "src";
const buildDir = "docs";

fs.ensureDirSync(buildDir);

const transpileTS = (file) => {
    build({
        entryPoints: [file],
        outdir: buildDir,
        bundle: false,
        format: "esm",
        sourcemap: true,
    }).catch((e) => {
        console.error(e)
    });
};

const copyFile = (file) => {
    const dest = path.join(buildDir, path.relative(srcDir, file));
    fs.copy(file, dest);
};

const handleChange = (file) => {
    console.log(`[${getTimestamp()}] File changed:`, file);

    if (file.endsWith(".ts")) {
        transpileTS(file);
        console.log(chalk.green(`[${getTimestamp()}] Transpiled: ${file}`));
    } else {
        copyFile(file);
        console.log(chalk.green(`[${getTimestamp()}] Copied: ${file}`));
    }

    console.log(chalk.grey(`\r\n[${getTimestamp()}] Watching for file changes...`));
};

if (isWatchMode) {
    const watcher = chokidar.watch(srcDir, {persistent: true});
    watcher.on("add", handleChange).on("change", handleChange)
} else {
    const files = fs.readdirSync(srcDir);
    files.forEach((file) => {
        const srcFile = path.join(srcDir, file);
        if (fs.statSync(srcFile).isFile()) {
            handleChange(srcFile);
        }
    });
}

