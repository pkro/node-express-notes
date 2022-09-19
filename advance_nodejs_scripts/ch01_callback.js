const delay = (seconds) => new Promise((resolve, reject) => {
    reject({message: "custom failure"}); // something going wrong
    setTimeout(resolve, seconds * 1000);
});

delay(1)
    .then(()=>console.log('all went well'))
    .catch(err=>console.log(err.message))

console.log('end first tick');
