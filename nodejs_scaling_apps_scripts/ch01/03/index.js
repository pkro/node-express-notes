import {fork} from 'child_process';

// array only used to be able to count the processes, fork is executed on array creation
// (otherwise we could do [()=>fork(...), ...] instead of forking directly)
const processes = [
    fork('./app', ['3001']),
    fork('./app', ['3002']),
    fork('./app', ['3003'])
];

console.log(`forked ${processes.length}`);
