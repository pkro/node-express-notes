function grab(flag) {
    const valueIdx = process.argv.indexOf(flag) + 1;
    return process.argv.length > valueIdx ? process.argv[valueIdx] : 'not provided';
}

const user = grab("--user");
const pass = grab("--pass");
console.log(`${user}:${pass}`);
