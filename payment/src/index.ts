import express from 'express'
import {connect, Msg,JSONCodec} from 'nats'
const app=express()
const port=4500
const jc =JSONCodec()

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
        (await this.stan).subscribe(subject,{
            callback:(err:any,msg:Msg)=>{
                const data = msg.data
                makePayment(jc.decode(data))
                
            }
        })
    }
}
const nats = new NatsConnect()
nats.subscribe("products")
nats.subscribe("create:order")

function makePayment(data:any){
    data.payment='Order Confirmed'
    const response={data,status:true}
    nats.publish("order:status",response)
    
} 

app.listen(port,()=>{
    console.log("payment server running");
    
})