const events = require('nodejs_essential_training_scripts/events');

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

