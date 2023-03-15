import { connect, JSONCodec, Msg } from 'nats'
import express from 'express'
import bodyParser from 'body-parser'
import db from './connection'
import {createProduct,getProduct} from './helper'
const app = express()
const port = 5500
const jc = JSONCodec()
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({ extended: true })); 
//mongoose connection
db.on('error', (error:Error) => {
    console.error('MongoDB connection error:', error);
});

db.once('open', () => {
    console.log('Connected to MongoDB');
});
let orders: any;


class NatsConnect {
    stan;
    constructor() {
        this.stan = connect({ servers: "0.0.0.0:4222" })
        this.stan.then(() => {
            console.log("Nats connected");
        })
            .catch(() => {
                console.log("Nats Not Connected");

            })
    }
    async publish(subject: string, data: any) {
        (await this.stan).publish(subject, jc.encode(data))
        console.log(subject, "published");

    }
    subscribe(subject: string) {
        return new Promise(async(resolve,reject)=>{
                (await this.stan).subscribe(subject, {
                    callback: (err: any, msg: Msg) => {
                        const data = msg.data;
                        
                        let product = getProduct(jc.decode(data))
                        resolve(product)
                    }
                });
        })
    } 


}




const nats = new NatsConnect()

app.post('/create-product',(req,res)=>{
    console.log(req.body);
    
    createProduct(req.body)  
    res.send("Product created") 
}) 
nats.subscribe("get:product").then((data)=>{
    console.log(data);
    nats.publish("getproduct:result",data)
})

app.listen(port, () => {
    console.log("order server running"); 

})

