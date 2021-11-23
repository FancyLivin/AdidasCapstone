// Helper functions for setting up webpage
function importAll(r) {
    return r.keys().map(r);
}

function getRange(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

const images = importAll(
    require.context("../public", false, /\.(png|jpe?g|svg|webp)$/)
);
  
const brandList = ['nike', 'adidas', 'new+balance', 'jordan', 'fila', 'reebok', 
'asics', 'champion', 'under+armour', 'skechers', 'saucony', 
'avia', 'colombia', 'fubu', 'shaq', 'puma', 'salomon', 'umbro',
'hoka+one+one', 'brooks']

const modelList = ['Model 1', 'Model 2', 'Model 3', 'Model 4', 'Model 5', 'Model 6', 'Model 7', 'Model 8']

const getRandomImage = () => {
    return getRange(0, images.length);
}

module.exports = {
    getRange, 
    getRandomImage,
    images,
    brandList,
    modelList,
}