const waitTime = 3000;
const waitInterval = 500;
let currentTime = 0;

const interval = setInterval(() => {
    const percent = Math.floor((currentTime+=waitInterval) / (waitTime / 100));
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`${percent}% done`);
}, waitInterval);
setTimeout(() => clearInterval(interval), waitTime);

