import mongoose from "mongoose";
import db from "./connection";

function createProduct(data:any){
    console.log(data);
    
    db.collection('products').insertOne(data)
}
async function getProduct(id:any){
    let product = await db.collection('products').findOne({_id:new mongoose.Types.ObjectId(id)})
    return product
}

export {createProduct,getProduct}