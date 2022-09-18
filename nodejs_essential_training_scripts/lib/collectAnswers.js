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

    rl.question(`${firstQuestion}\n`, questionAnswered);

    return emitter;
}
