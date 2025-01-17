/* NOTE Module replace template */
module.exports = (temp, product) => {
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