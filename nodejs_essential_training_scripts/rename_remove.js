const fs = require('fs');
const path = require('path');

// build OS specifice path, e.g. '\' instead of '/' for windows
const basePath = path.join(__dirname, 'assets');
const tmpPath = path.join(basePath, 'tmp');
const fileToCreate = path.join(basePath, 'randomfile.txt');
const movedFile = path.join(tmpPath, 'movedfile.txt');

if(!fs.existsSync(tmpPath)) {
    fs.mkdirSync(tmpPath);
}

fs.writeFileSync(fileToCreate, 'some text', 'utf-8');
// rename can be used to move a file or directory (no separate move function)
fs.renameSync(fileToCreate, movedFile);

// rmSync also accepts options
fs.readdirSync(tmpPath).forEach(fileName => fs.rmSync(path.join(tmpPath, fileName)));

// alternative to rm / rmSync:
// fs.unlinkSync(movedFile);

// would fail if not empty
fs.rmdirSync(tmpPath);



