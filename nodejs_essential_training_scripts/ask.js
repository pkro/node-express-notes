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


