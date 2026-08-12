
export  function priceStringToInt(price:string) {    
const match = price.match(/\d+/);

const number = match ? Number(match[0]) : null;
return number
}
