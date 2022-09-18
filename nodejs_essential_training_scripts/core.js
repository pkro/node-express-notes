const path = require("path");
const util = require("util");
const v8 = require("v8");
const {getHeapStatistics} = require("v8"); // destructured import as usual

const dirUploads = path.join(__dirname, 'www', 'files', 'uploads');
console.log(dirUploads); // ./www/files/uploads

util.log(path.basename(__filename)); // with date (util.log is deprecated though)

util.log(getHeapStatistics());
