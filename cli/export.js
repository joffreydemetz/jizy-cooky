import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const basePath = process.cwd();
const exportsDir = path.join(basePath, 'exports');
const buildDir = path.join(basePath, 'build');

function getExportNames() {
    if (!fs.existsSync(exportsDir)) {
        return [];
    }
    return fs.readdirSync(exportsDir).filter(name => {
        const configPath = path.join(exportsDir, name, 'cooky.config.json');
        return fs.existsSync(configPath);
    });
}

function moveFolderContents(src, dest) {
    if (!fs.existsSync(src)) {
        return;
    }
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    for (const item of fs.readdirSync(src)) {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        if (fs.lstatSync(srcPath).isDirectory()) {
            moveFolderContents(srcPath, destPath);
            fs.rmdirSync(srcPath);
        } else {
            if (fs.existsSync(destPath)) {
                fs.unlinkSync(destPath);
            }
            fs.renameSync(srcPath, destPath);
        }
    }
}

function cleanDir(dir) {
    if (!fs.existsSync(dir)) {
        return;
    }
    for (const item of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, item);
        if (fs.lstatSync(fullPath).isDirectory()) {
            cleanDir(fullPath);
            fs.rmdirSync(fullPath);
        } else {
            fs.unlinkSync(fullPath);
        }
    }
    fs.rmdirSync(dir);
}

function buildExport(name) {
    const configPath = path.join(exportsDir, name, 'cooky.config.json');
    if (!fs.existsSync(configPath)) {
        console.error(`Config not found: ${configPath}`);
        process.exit(1);
    }

    console.log(`\n=== Building export: ${name} ===\n`);

    const debug = process.argv.includes('--debug') ? ' --debug' : '';
    const target = targetArg ? ` --target "${targetArg}"` : '';
    const cmd = `node ./cli/jpack.js --action build --name ${name} --config "${configPath}"${debug}${target}`;

    try {
        execSync(cmd, { stdio: 'inherit', cwd: basePath });
    } catch (e) {
        console.error(`Build failed for ${name}`);
        process.exit(1);
    }

    if (!targetArg) {
        const buildOutput = path.join(buildDir, name);
        const exportOutput = path.join(exportsDir, name);

        // Move built files to exports/{name}/, preserving the config
        moveFolderContents(buildOutput, exportOutput);
        cleanDir(buildOutput);
    }

    console.log(`\n=== Export ${name} -> exports/${name}/ ===\n`);
}

// Parse args
const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
const allFlag = process.argv.includes('--all');
const targetIdx = process.argv.indexOf('--target');
const targetArg = targetIdx !== -1 ? process.argv[targetIdx + 1] : null;

if (allFlag) {
    const names = getExportNames();
    if (names.length === 0) {
        console.log('No exports found in exports/');
        process.exit(0);
    }
    console.log(`Building ${names.length} export(s): ${names.join(', ')}`);
    for (const name of names) {
        buildExport(name);
    }
} else if (args.length > 0) {
    for (const name of args) {
        buildExport(name);
    }
} else {
    console.log('Usage:');
    console.log('  node ./cli/export.js <name>         Build a single export');
    console.log('  node ./cli/export.js <n1> <n2> ...  Build multiple exports');
    console.log('  node ./cli/export.js --all          Build all exports');
    console.log('  Add --debug for verbose output');
    console.log('');
    const names = getExportNames();
    if (names.length > 0) {
        console.log('Available exports: ' + names.join(', '));
    } else {
        console.log('No exports found. Create exports/<name>/cooky.config.json to get started.');
    }
}
