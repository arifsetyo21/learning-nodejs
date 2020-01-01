const EventEmitter = require("events");
const http = require("http");

// const myEmitter = new EventEmitter();

/* NOTE Extends class in ES6/ES2015 */
class Sale extends EventEmitter {
   constructor() {
      super();
   }
}

/* NOTE Instanctiation class to variable */
const myEmitter = new Sale();


myEmitter.on("newSale", () => {
   console.log("there was a new sale!");   
})

myEmitter.on("newSale", () => {
   console.log("Customer name: Arif");
})

myEmitter.on("newSale", stock => {
   console.log(`There are now ${stock} items left in stock.`);
})

myEmitter.emit("newSale", 9)

/////////////////////////////

const server = http.createServer();

server.on("request", (req, res) => {
   console.log("request received!");
   console.log(req.url);
   res.end("request received!");
})

server.on("request", (req, res) => {
   console.log("Another request!");
})

server.on("close", () => {
   console.log("Server Closed");
})

server.listen(8000, "127.0.0.1", () => {
   console.log("waiting for request...")
})