const cp = require("child_process");

const questionApp = cp.spawn("node", ['ask.js']);

questionApp.stdin.write("pkro\n");
questionApp.stdin.write("blah\n");
questionApp.stdin.write("blubb\n");

questionApp.stdout.on("data", data => {
    console.log(`from the question app: ${data}`);
});

questionApp.on('close', () => console.log("questionApp process exited"));

/*
from the question app: what's your name?

from the question app: event: question answered with pkro
what would you rather be doing?event: question answered with blah
what's your preferred programming language?event: question answered with blubb

from the question app: [ 'pkro', 'blah', 'blubb' ]

questionApp process exited
 */
