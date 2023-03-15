import {connect,JSONCodec, Msg} from 'nats'
import express from 'express'

const app = express()
const port=4000
const jc = JSONCodec()
let orders:any;
const products=[
    {
      name:'iphone 12',
      price:70000
    },
    { 
      name:'samsung s22',
      price:100000
    },
    {
      name:'Realme ',
      price:30000
    }, 
    {
      name:'Mi 11',
      price:20000
    } 
  ]
  

class NatsConnect{
    stan;
    constructor(){
       this.stan = connect({servers:"0.0.0.0:4222"})
       this.stan.then(()=>{
        console.log("Nats connected");
       })
       .catch(()=>{
        console.log("Nats Not Connected");
        
       })
    }
    async publish(subject:string,data:any){
        (await this.stan).publish(subject,jc.encode(data))
        console.log(subject,"published");
        
    }
    async subscribe(subject:string){
        if(subject=='order:status'){
            (await this.stan).subscribe(subject, {
                callback: (err: any, msg: Msg) => {
                    const data =  msg.data;
                    console.log("data",jc.decode(data));
                    orders=jc.decode(data)
                }
            });
        }
    }
    
    
}


const nats = new NatsConnect()
nats.subscribe("order:status")
app.get("/",()=>{
    nats.publish("products",products)
    
})
app.post('/create-order',async(req,res)=>{
    const order={
        orderId:1,
        product:{ 
            name:'samsung s22',
            price:100000
          }
    }
    nats.publish("create:order",order)
        res.send("order confirmed")
})

app.listen(port,()=>{ 
    console.log("order server running");
    
})

  