const fs = require('fs')
const http = require('http')
const url = require('url')

///////////////// NOTE FILE

/* NOTE Syncronous Way */
/* NOTE Read file in node.js */
/* const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')
console.log(textIn);
 */
/* NOTE Write file in node.js */
/* const textOut = `This is what we know about avocado : ${textIn}. \nCreated on ${Date.now()}`
fs.writeFileSync('./txt/output.txt', textOut)
console.log('File Written!') */

/* NOTE Non-blocking/ asyncronous way */
/* fs.readFile('./txt/start.txt', 'utf-8', function (err, data1) {
   fs.readFile(`./txt/${data1}.txt`, 'utf-8', function (err, data2) {
      console.log(data2)
      fs.readFile('./txt/append.txt', 'utf-8', function (err, data3) {
         console.log(data3)
         fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
            console.log('Your file has been written!');
         })
      })
   })
}) 
console.log('will read file!');
*/

const replaceTemplate = (temp, product) => {
   /* NOTE Template-Card */
   let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName)
   output = output.replace(/{%IMAGE%}/g, product.image)
   output = output.replace(/{%PRICE%}/g, product.price)
   output = output.replace(/{%FROM%}/g, product.from)
   output = output.replace(/{%NUTRIENS%}/g, product.nutriens)
   output = output.replace(/{%QUANTITY%}/g, product.quantity)
   output = output.replace(/{%DESCRIPTION%}/g, product.description)
   output = output.replace(/{%ID%}/g, product.id)

   if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
   return output
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')

/* NOTE loading file syncronously for eficiency */
/* This code will not calling again after first request */
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data)

////////////////// NOTE SERVER and URL(Routings)
const server = http.createServer((req, res) => {

   // console.log(req.url)
   // console.log(url.parse(req.url, true))
   /* NOTE get query and pathname only */
   let { query, pathname } =  url.parse(req.url, true)
   // const pathName = req.url
   
   /* NOTE Native routing with if clause */
   /* NOTE Overview Page */
   if (pathname === '/' || pathname === '/overview') {
      res.writeHead(200, {'Content-Type' : 'text/html'})

      /* NOTE for replace template template-card in element we defined */
      /* cardsHtml is an array, add join('') will join the array  */
      const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('')
      // console.log(cardsHtml);
      const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
      res.end(output)
      
   /* NOTE Product Page */
   } else if ( pathname === '/product') {
      res.writeHead(200, {'Content-Type' : 'text/html'})
      const product = dataObj[query.id]
      const output = replaceTemplate(tempProduct, product)
      // console.log(output)

      res.end(output)
   /* NOTE API */
   } else if ( pathname === '/api'){      
      res.writeHead(200, {'Content-Type' : 'application/json'})
      res.end(data)   
   
   /* NOTE Not found */
   } else {
      /* NOTE return 404 if the resource not found */
      res.writeHead(404, {
         'Content-Type': 'text/html',
         'my-own-header': 'hello-world'
      })
      res.end('<h1>Page not found</h1>')
   }
})

server.listen(8000, '127.0.0.1', () => {
   console.log('Listening to request on port 8000');
})