class ProductQueryError extends Error{
    constructor(message){
        super(message);

        this.name = "ProductQueryError"
    }
}


module.exports = {ProductQueryError}