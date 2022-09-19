const fs = require('fs');
const { promisify } = require('util');

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const beep = () => process.stdout.write("\x07");
const delay = (seconds) => new Promise((resolves) => {
    setTimeout(resolves, seconds*1000);
})

Promise.race([
    // executed in parallel
    delay(2).then(()=>"I will not be returned"),
    delay(1).then(()=>"promise 2 finished"),
    delay(3).then(()=>"I will not be returned").then(()=>console.log("longest promise finished as well")), // longest, 5 seconds
]).then(res => console.log(res)); // executed after all promises are resolved

/*
Result (after 5 seconds):
promise 2 finished // after 1 second, the ONLY result of the Promise.race promise
longest promise finished as well // after five seconds
*/
