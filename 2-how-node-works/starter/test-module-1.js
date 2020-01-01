/* NOTE Solution 1 */

/* class Calculator {
   add(a, b) {
      return a + b;
   }
   
   multiply(a, b) {
      return a*b;
   }

   devide(a, b){
      return a/b
   }
}

module.exports = Calculator; */

// NOTE Solution 2
module.exports = class {
   add(a, b) {
      return a+b
   }
   multiply(a, b) {
      return a*b;
   }
   devide(a, b){
      return a/b
   }
}