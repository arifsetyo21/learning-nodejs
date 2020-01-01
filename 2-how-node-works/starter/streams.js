const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
   // Solution 1
   // fs.readFile("test-file.txt", (err, data) => {
   //    if (err) console.log(err);
   //    res.end(data);
   // })

   // Solution 2 : streams
   /* NOTE this method can read from file piece by piece */
   // const readable = fs.createReadStream("testr-file.txt");
   // readable.on("data", chuck => {
      /* NOTE diffrent with this method is we can send every single piece of data */
      /* NOTE Sending method is in there */
      /* NOTE The response will see piece by piece of data */
   //    res.write(chuck);
   // });
   /* NOTE if any signal read stream is fin or file the readed is finished, the response will send end event */
   // readable.on("end", () => {
   //    res.end();
   // });
   // readable.on("error", err => {
   //    console.log(err);
   //    res.status = 500;
   //    res.end("file not found");
   // });

   // Solution 3
   const readable = fs.createReadStream("test-file.txt");
   readable.pipe(res);
   // readableSource.pipe(writeableDest)
   
})

server.listen(8000, "127.0.0.1", () => {
   console.log("listening...")
});