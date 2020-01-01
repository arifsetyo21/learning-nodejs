// console.log(arguments)
// console.log(require('module').wrapper);

// export with module.exports
const Calc = require('./test-module-1')
const calc1 = new Calc()
console.log(calc1.add(4, 2))
console.log(calc1.multiply(2, 2))
console.log(calc1.devide(4, 2))

console.log("-------------");

// export with exports
const calc2 = require('./test-module-2')
console.log(calc2.add(4, 2))
console.log(calc2.multiply(2, 2))
console.log(calc2.devide(4, 2))

console.log("-------------");

// if want only function
const { add, multiply, devide } = require('./test-module-2')
console.log(add(4,2))

console.log("-------------");

// Caching
require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();