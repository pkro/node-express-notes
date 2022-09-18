const fs = require('fs');
const colorData = require('./assets/colors.json');

colorData.colorList.forEach((entry) => {
    fs.appendFile('./assets/somefile.md', `\n- ${entry.color} is ${entry.hex} in hex`, err => { if (err) throw err});
});
