

const SUBCATEGORY_SYNONYMS: Record<string, string[]> = {
  'tshirts': ['tshirt', 't-shirt', 't shirt', 'shirt'],
  'shirts': ['shirt', 'tshirt', 't-shirt', 't shirt'],
  'tops': ['top', 'crop top', 'tank top'],
  'dress': ['dress', 'gown', 'frock', 'maxi', 'outfit','sleeves'],
  'jeans': ['jean', 'jeans', 'denim', 'trouser', 'pants']
};

const subCat1 = "Tshirts"
const title1 = "Men Tshirt"

const subCat2 = "Tshirts"
const title2 = "Pure Cotton V-Neck T-Shirt"

export  function wordToArray(title:string):string[]{
    const array = title.toLowerCase().split(" ")
  
    return array;
}



export  function isTitleMatchingCategory(subCat:string,title:string) {
    const cleanWordsArr =  wordToArray(subCat);
    const cleanTitle = title.toLowerCase()

   

    const found = cleanWordsArr.includes(cleanTitle);
    
    
}
