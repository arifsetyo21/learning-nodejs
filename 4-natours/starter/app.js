const express = require('express');

const app = express();

const port = 8000;

app.get('/', function(req, res) {
   /* NOTE if want send with html */
   // res.status(200).send('Hello World!');

   /* NOTE if want send with json */
   res.status(200).json({ message: 'Hello from server side!', app: 'Natours' });
});

app.post('/', (req, res) => {
   res.status(200).send('you can post to this endpoint');
});

app.listen(port, () => {
   console.log(`App running on port ${port}...`);
});
