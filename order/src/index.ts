import { connect, JSONCodec, Msg } from 'nats'
import express from 'express'
import db from './connection'
import {createOrder,updateOrder} from './helpers'
const app = express()
const port = 4000
const jc = JSONCodec()
let paymentStatus:string
//mongoose connection
db.on('error', (error) => {
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
            if (subject == 'order:status') {
                (await this.stan).subscribe(subject, {
                    callback: (err: any, msg: Msg) => {
                        const data = msg.data;
                        orders = jc.decode(data)
                        // console.log(orders);
                        if(orders.status){
                            paymentStatus='payment success'
                        }else{
                            paymentStatus='payment failed'
                        }
                        updateOrder(orders.data,paymentStatus)
                        resolve(orders.data)
                    }
                });
            }else{
                (await this.stan).subscribe(subject, {
                    callback: (err: any, msg: Msg) => {
                        const data = msg.data;
                        let product = jc.decode(data)
                        // console.log(orders);
                        
                        resolve(product)
                    }
                });
            }
        })
    } 


}




const nats = new NatsConnect()

app.post('/create-order',async (req, res) => {
   nats.publish("get:product","64121a51628d1642a37e878d")
   await nats.subscribe("getproduct:result").then((data)=>{
       createOrder(data)
       nats.publish("create:order", data)
   })
    
    nats.subscribe("order:status").then((data)=>{
        res.send(data)
        
    })
})

app.listen(port, () => {
    console.log("order server running");

})

