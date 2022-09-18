const cp = require("child_process");

cp.exec("ls -l", (err, data, stderr) => {
    if(err) {
        console.log(stderr); // the error message you'd get on the command line, e.g. /bin/sh: 1: lsdfdsfd: not found
        throw err; // the full error (including stderr)
    }
    console.log(data);
});

console.log("faster!")


/*
output:

faster!
total 88
-rw-rw-r-- 1 pk pk   241 Sep 18 08:41 append.js
-rw-rw-r-- 1 pk pk   134 Sep 17 18:34 app.js
-rw-rw-r-- 1 pk pk   591 Sep 17 20:50 ask.js
*/

