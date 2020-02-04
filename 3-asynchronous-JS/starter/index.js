const fs = require("fs");
const superagent = require("superagent");

// NOTE Read file asyncronously in js
fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  console.log(`Breed : ${data}`);

  //NOTE Using superagent for request to resouce
  superagent
    // NOTE Method which returned a promises
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    // NOTE Handle successfuly case while request using promise
    .then(res => {
      console.log(res.body.message);

      // NOTE write result path image to file
      fs.writeFile("dog-img.txt", res.body.message, err => {
        console.log("Random dog image saved to file!");
      });
    })
    // NOTE Catch for handle rejected or unsuccessfuly image
    .catch(err => {
      console.log(err.message);
    });
});
