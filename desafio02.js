const fs = require('fs');

class ProductManager {

    constructor(path) {
        this.products = [];
        this.path = path;
    }

    //-------------------------------------------------------------------------------------
    async addProduct(product) {

        const products = await this.getProducts();

        const productsLength = products.length;

        const { title, description, price, thumbnail, code, stock } = product

        const newproduct = {

            id: productsLength > 0 ? products[productsLength - 1].id + 1 : 1,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
        }

        const productRepeat = products.some(prod => prod.code === code);

        const data = Object.values(newproduct).includes(undefined);

        if (data) {
            return console.log("incomplete values, por favor llene todos los campos solicitaods");
        }

        if (productRepeat) {
            return console.log('Este codigo de producto ya existe, por favor verifique');
        }

        products.push(newproduct);

        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));

        }
        catch (error) {
            return error
        }
    }

    //-------------------------------------------------------------------------------------
    async getProducts() {

        try {
            const products = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(products);

        } catch (error) {
            return this.products;
        }
    }

    //-------------------------------------------------------------------------------------
   async getProductById(id) {

        const products= await this.getProducts();

        const search = products.find(product => product.id === id);

        !search ? console.log("Error el producto que buscas no existe") : console.log(search);
    }

    //-------------------------------------------------------------------------------------

    async deletProduct(id){

        const products = await this.getProducts();

        const productForDelete= products.findIndex(product => product.id === id);

        if( productForDelete == -1 ){
            return console.log("Error el producto que buscas no existe");
        }

        try{
            products.splice(productForDelete,1);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
        }
        catch(error){
            console.log(error);
        }
    }

    //-------------------------------------------------------------------------------------

    async updateProduct(id,prod){

        const products = await this.getProducts();

        for(let key in products){

            if(products[key].id == id){
                products[key].title = prod.title ? prod.title : products[key].title;
                products[key].description = prod.description ? prod.description : products[key].description;
                products[key].price = prod.price ? prod.price : products[key].price;
                products[key].thumbnail = prod.thumbnail ? [...products[key].thumbnail, prod.thumbnail] : products[key].thumbnail;
                products[key].code = prod.code ? prod.code : products[key].code;
            }
        }

        try {  
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));

        }
        catch (error) {
            return error
        }
    }

}

const productNew1 = new ProductManager('./products.json');