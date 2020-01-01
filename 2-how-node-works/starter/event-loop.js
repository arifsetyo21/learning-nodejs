const fs = require('fs')
const crypto = require('crypto')

/* NOTE variable start to count how much time consume later */
const start = Date.now()
/* NOTE to assign how many thread use in this compute */
process.env.UV_THREADPOOL_SIZE = 1

/* NOTE This is test how sequence execution the code with setTimeout(), setImmediate(), fs or I/O, and top-level code */
setTimeout(() => {
   console.log('Timer 1 finished')
}, 0);

setImmediate(() => {
   console.log('Immediate 1 finished')
})

fs.readFile("test-file.txt", () => {
   console.log("I/O finished")
   console.log("----------------------")

   setTimeout(() => {
      console.log("Timer 2 finished")
   }, 0)

   setTimeout(() => {
      console.log("Timer 3 finished")
   }, 3000)
   
   process.nextTick(() => console.log("Process.nextTick()"))
   setImmediate(() => {
      console.log('Immediate 2 finished')
   })

   crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
      console.log( Date.now() - start, "Password encrypted")
   })
   
   crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
      console.log( Date.now() - start, "Password encrypted")
   })
   
   crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
      console.log( Date.now() - start, "Password encrypted")
   })
   
   crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
      console.log( Date.now() - start, "Password encrypted")
   })
   
   crypto.pbkdf2Sync('password', 'salt', 100000, 1024, 'sha512')
   console.log( Date.now() - start, "Password encrypted with syncronous")

})

console.log("Hello from the top-level code")