Notes from various nodejs and expressjs related courses

# Node.js essential training

Notes from the linkedin learning course by Alex Banks

## Intro

- Apache creates a new thread for each request; the threads have to wait until e.g. disk io is finished before they can continue
- Node is single threaded and runs in an asynchronous event loop, non-blocking event driven IO. When accessing resources, the event loop doesn't have to wait for e.g. a disk read to finish but can continue with other tasks. If a thread gets saturated with tasks / requests, it can be forked to provide new threads (this is not happening automatically though but is a common way to add new resources in the cloud)

Run js files with `node filename` (`.js` suffix optional)

## Node globals

### The global object

- What `window` is in the browser, `global` is in node, e.g. `global.console.log("hello")`.
- Like in the browser, all global properties are globally accessible (without the `global` prefix)

https://nodejs.org/api/globals.html

Some commonly used globals: `__dirname`, `__filename`

### Require / modules

Files can be imported using the *common js module pattern* to import modules that come with nodejs or external / own modules:

    const path = require("path") // ships with nodejs
    console.log(`The filename is ${path.basename(__filename)}`);

### Argument variables with process.argv

`process.argv` contains an array with

- 0: path to the systems node binary that executes the current file
- 1: the path of the current file
- 2...: the passed arguments


    // firstFile.js
    console.log(process.argv);
    console.log(`Entered ${process.argv.slice(2)}`);

    const [, , myFirstArg, mySecondArg] = process.argv; // using destructuring
    console.log(`${myFirstArg} ${mySecondArg}`);
    
    $ node firstFile.js hey hey
    Entered /home/pk/.nvm/versions/node/v16.17.0/bin/node,/home/pk/projects/lynda/node_express_notes/ch03/firstFile.js,hey,hey
    Entered hey,hey
    hey hey

Using flags and values in the arguments and obtain their values using a self defined `grab` function:

    function grab(flag) {
        const valueIdx = process.argv.indexOf(flag) + 1;
        return process.argv.length > valueIdx ? process.argv[valueIdx] : 'not provided';
    }
    
    const user = grab("--user");
    const pass = grab("--pass");
    console.log(`${user}:${pass}`);

Other `process` properties: `process.pid`, `process.versions.node`

### Standard output

- Communicate with the running process using the `process.stdin` and `process.stdout` streams.
- `process.stdout` doesn't automatically add a new line like `console.log`


        `process.stdout.write("Hello world\n\n");

### Standard input

`process.stdin.on('data', data => process.stdout.write(`\n${data.toString().trim()}\n`);`

`data` is a stringbuffer that must be converted with `toString`; The above listener runs asynchronously until stopped (e.g. with `process.exit()` or ctrl-c).

A listener for `exit` can also be defined that runs a function when the program is terminated with `process.on('exit', ()=> /*...*/)`.

Example program:

    const questions = [
        "what's your name?",
        "what would you rather be doing?",
        "what's your preferred programming language?"
    ]
    
    const ask = (i=0) => {
        process.stdout.write(`\n\n${questions[i]}`);
        process.stdout.write(` > \n\n`);
    }
    
    const answers = [];
    
    ask(0);
    process.stdin.on('data', data => {
        const answer = data.toString().trim();
        answers.push(answer);
        if(answers.length < questions.length) {
            ask(answers.length);
        } else {
            process.exit();
        }
    });
    
    process.on("exit", ()=> {
        for(let i in questions) {
            process.stdout.write(`\n${questions[i]}: ${answers[i]}`);
        }
    })

### setTimeout / setInterval

Same as in browser JS

Progress percentage example:

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



## Node modules

### Core modules

    Core moduleas come with nodejs and don't need to be installed separately.
    
    Some examples:
    
    const path = require("path");
    const util = require("util");
    const v8 = require("v8");
    const {getHeapStatistics} = require("v8"); // destructured import as usual
    
    const dirUploads = path.join(__dirname, 'www', 'files', 'uploads');
    console.log(dirUploads); // ./www/files/uploads
    
    util.log(path.basename(__filename)); // with date (util.log is deprecated though)
    
    util.log(getHeapStatistics());

### readline

Questions example using readline (using callbacks as nodejs is asynchronous, so we can't just do a `for` loop of the questions; for a synchronous version, `readline-sync` can be installed and used instead): 

    const readline = require("readline");
    
    function collectAnswers(questions, callback) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    
        const questionAnswered = answer => {
            answers.push(answer);
            if (answers.length < questions.length) {
                rl.question(questions[answers.length], questionAnswered);
            } else {
                callback(answers);
            }
        }
    
        const answers = [];
        const [firstQuestion] = questions;
    
        rl.question(firstQuestion, questionAnswered);
    }
    
    const questions = [
        "what's your name?",
        "what would you rather be doing?",
        "what's your preferred programming language?"
    ];
    
    collectAnswers(questions, answers => {
        console.log(answers);
        process.exit();
    })
    
### Export custom modules

Simplest form:

myModule.js:

    module.exports = "pkro";

app.js:

    const name = require("./myModule"); // name is "pkro"

All variables inside the module are scoped to the module and can be modified by functions in the same scope (=same module):

myModule:

    let count = 0;
    
    const inc = () => ++count;
    const dec = () => --count;
    
    const getCount = () => count;
    
    module.exports = {
        inc,
        dec,
        getCount
    };

app.js:

    const {inc, dec, getCount} = require('./myModule');
    // or const counter = require('./myModule'), then use counter.inc() etc.

    console.log(getCount()); // 0
    inc();
    inc();
    inc();
    console.log(getCount()); // 3

### Building questions.js with a module

`collectAnswers.js` module:

    const readline =require("readline");
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    module.exports = (questions, callback = answers => answers) => { // optional callback argument
        const questionAnswered = answer => {
            answers.push(answer);
            if (answers.length < questions.length) {
                rl.question(questions[answers.length], questionAnswered);
            } else {
                callback(answers);
            }
        }
    
        const answers = [];
        const [firstQuestion] = questions;
    
        rl.question(firstQuestion, questionAnswered);
    }

`ask.js`:

    const collectAnswers = require('./lib/collectAnswers');
    
    const questions = [
        "what's your name?",
        "what would you rather be doing?",
        "what's your preferred programming language?"
    ];
    
    collectAnswers(questions, answers => {
        console.log(answers);
        process.exit();
    })

### Custom events with the EventEmitter

`EventEmitter` is used to handle and raise custom events (asynchronously) and is nodes implementation of the pub/sub design pattern

    const events = require('events');
    
    const emitter = new events.EventEmitter();
    // create custom event; message and user are the second and third argument
    // passed to emitter.emit in this case (any number of arguments can be used)
    emitter.on('myCustomEvent', (message, user)=>{
        console.log(`${user} said ${message}`);
    })
    
    emitter.emit('myCustomEvent', 'Hello World', 'Computer'); // Computer said Hello World
    emitter.emit('myCustomEvent', 'hey ho', 'pkro'); // pkro said hey ho
    
    process.stdin.on("data", data => {
        const input = data.toString().trim();
        if(input.toLowerCase() === 'exit') {
            emitter.emit("myCustomEvent", "Goodbye", 'process');
            process.exit();
        }
        emitter.emit("myCustomEvent", input, "terminal");
    });

### Improving the `collectAnswers.js` module using `EventEmitter`

`collectAnswers.js`:

    const readline =require("readline");
    const {EventEmitter} = require('events');
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    module.exports = (questions, callback = answers => answers) => {
        const emitter = new EventEmitter();
    
        const questionAnswered = answer => {
            emitter.emit("answer", answer);
            answers.push(answer);
            if (answers.length < questions.length) {
                rl.question(questions[answers.length], questionAnswered);
            } else {
                emitter.emit("complete", answers);
                callback(answers);
            }
        }
    
        const answers = [];
        const [firstQuestion] = questions;
    
        rl.question(firstQuestion, questionAnswered);
    
        return emitter;
    }


`ask.js`:

    const collectAnswers = require('./lib/collectAnswers');
    
    const questions = [
        "what's your name?",
        "what would you rather be doing?",
        "what's your preferred programming language?"
    ];
    
    const answerEvents = collectAnswers(questions);
    
    answerEvents.on("answer", answer => console.log(`event: question answered with ${answer}`));
    answerEvents.on("complete", answers => {
        console.log(answers);
        process.exit();
    });
    // more than one listener can be defined for a given event
    // they are executed in the order they are defined
    answerEvents.on("complete", () => process.exit());

## File system basics

Most functions of the `fs` module have synchronous counterparts with a `Sync` suffix.

### List directory files

    const fs = require('fs');
    
    // list files (synchronously), blocking further execution until done
    const files = fs.readdirSync("./assets");
    console.log(files);
    
    // asnychronously
    fs.readdir('./assets', (err, files) => {
        if (err) {
            throw err;
        }
        console.log(files);
    })

### Read files

    const fs = require('fs');
    
    // sync
    const text = fs.readFileSync('./assets/Readme.md', "UTF-8");
    console.log(text.toString());
    
    // async (no error handling for brevity)
    fs.readFile('./assets/Readme.md', "utf-8", (err, text) => console.log(text.toString()) )

    // read binary (no encoding defaults to 'binary')
    const img = fs.readFileSync('./assets/alex.jpg');

### Write and append files, create directories

Examples of both async and sync versions omitted from here on if they don't add anything, as is the `fs` import.

    const md = `
    # Title
    
    Some text
    `;
    
    if (!fs.existsSync('./assets/tmp')) {
        console.log('directory exists');
        fs.mkdir('./assets/tmp', err => {
            // err thrown if directory already exists or not a writable location
            if (err) { 
                throw err;
            }
            createFile();
        });
    }
    
    function createFile() {
        fs.writeFile('./assets/tmp/myfile.md', md.trim(), err => {
            if (err) throw err; // NO error thrown if file exists
            console.log("File written");
        });
    }

### Append files

Note: `json files` can be required (no file system needed).

Append creates a file if it doesn't exist.

    const fs = require('fs');
    const colorData = require('./assets/colors.json');
    
    colorData.colorList.forEach((entry) => {
        fs.appendFile('./assets/myfile.md', `\n- ${entry.color} is ${entry.hex} in hex`, err => { if (err) throw err});
    });

### Rename and remove files and directories

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

## Files and streams

Streams are used to read / write files, communicate with the network / internet and with processes and other input / outputs like the terminal. `process.stdin` is a stream.

### Readable file streams

Reading a file chunk by chunk (defaulting to 64kb chunks):

    const fs = require('fs');
    const path = require('path');
    
    const readStream = fs.createReadStream(path.join(__dirname, 'assets', 'lorum-ipsum.md'), 'utf-8');
    
    console.log("type something...");
    //process.stdin.on("data", data => {
    readStream.on("data", data => {
        console.log(`I read ${data.length - 1} characters of text`);
    });

    /* output:
    I read 65535 characters of text
    I read 65535 characters of text
    ...
    I read 56950 characters of text*/

    // just read the first chunk
    readStream.once('data', data => console.log(data));
    
    readStream.on('end', () => console.log("finished"));

### Writable file streams

When creating a write stream, the index is set to 0, even if it's an existing file.
    
    // write to the stdout write stream
    process.stdout.write('hello');
    
    // same for file write stream
    const writeStream = fs.createWriteStream(path.join(__dirname, 'assets', 'streamwritten.txt'), 'utf-8');
    
    // overwrites content of the file if it existed before creating the writeStream
    // as createWriteStream sets the file pointer to 0
    writeStream.write('hello');
    // appends to the file as the file pointer is now updated
    writeStream.write(' world'); // content is now "hello world"
    
    // write terminal input to file until ctrl-c
    process.stdin.on("data", data => {
        writeStream.write(data);
    });
    
    // the same but shorter:
    process.stdin.pipe(writeStream);
    
    
    // copy content from readstream to write stream (file)
    // here it appends to the stuff already appended above
    // as we didn't create a new writeStream
    const readStream = fs.createReadStream(path.join(__dirname, 'assets', 'lorum-ipsum.md'));
    
    // same as readStream.pipe(writeStream);
    readStream.on("data", data => {
        writeStream.write(data);
    });
    

### Create a child process with `exec`

Use `exec` to execute any *synchronous* process asynchronously (or synchronously using `execSync`).

It can also be used to start other node processes (e.g. `cp.exec("node myScript", (...) => {...})`) and stream its output.

It is not designed for asynchronous or long running processes.

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


### Create a child process with `spawn`

`spawn` can be used to start asynchronous processes.

    const cp = require("child_process");
    
    // first arg: command, second arg: array with all command parameters
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

# Advanced node.js

Notes from the linkedin learning course by Alex Banks
