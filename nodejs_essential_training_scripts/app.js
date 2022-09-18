const {inc, dec, getCount} = require('./myModule');

console.log(getCount()); // 0
inc();
inc();
inc();
console.log(getCount()); // 3
