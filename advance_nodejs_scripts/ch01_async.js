const fs = require('fs');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const beep = () => process.stdout.write("\x07");
const delay = (seconds) => new Promise((resolves) => {
    setTimeout(resolves, seconds*1000);
})

// the function that contains await must be defined as async
async function doStuffSequentially () {
    console.log('starting');
    await delay(1);
    console.log("waiting");
    await delay(2);
    // we can now also be specific in which lines we want to catch errors
    try {
        await writeFile('file.txt', 'sample file...');
        beep();
        console.log("file created");
    } catch (error) {
        console.log(error.message);
    }
    await delay(1);
    await unlink('file.txt');
    console.log("file deleted");
    return 'success';
}

// call:
doStuffSequentially().then(msg => console.log(msg));

// or in an async function
async function start() {
    const res = await doStuffSequentially();
    console.log(res);
}
start();

// or as an iifi (imediately invoked function expression), anti-pattern now
(async function () {
    const res = await doStuffSequentially();
    console.log(res);
})();
