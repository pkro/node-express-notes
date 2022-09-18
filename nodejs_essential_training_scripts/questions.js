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


