import mongoose from 'mongoose'
import db from './connection'


function createOrder(data:any):void{
    db.collection('orders').insertOne(data)
}
async function updateOrder(data:any,paymentStatus:string){
    let id= ""+data._id
    
    db.collection('orders').updateOne({_id:new mongoose.Types.ObjectId(id)},{
        $set:{
            paymentStatus:paymentStatus
        }
    })

}
export  {createOrder,updateOrder} 