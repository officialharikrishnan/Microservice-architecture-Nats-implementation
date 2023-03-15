"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nats_1 = require("nats");
const express_1 = __importDefault(require("express"));
const connection_1 = __importDefault(require("./connection"));
const helpers_1 = __importDefault(require("./helpers"));
const app = (0, express_1.default)();
const port = 4000;
const jc = (0, nats_1.JSONCodec)();
//mongoose connection
connection_1.default.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});
connection_1.default.once('open', () => {
    console.log('Connected to MongoDB');
});
let orders;
const products = [
    {
        name: 'iphone 12',
        price: 70000
    },
    {
        name: 'samsung s22',
        price: 100000
    },
    {
        name: 'Realme ',
        price: 30000
    },
    {
        name: 'Mi 11',
        price: 20000
    }
];
class NatsConnect {
    constructor() {
        this.stan = (0, nats_1.connect)({ servers: "0.0.0.0:4222" });
        this.stan.then(() => {
            console.log("Nats connected");
        })
            .catch(() => {
            console.log("Nats Not Connected");
        });
    }
    publish(subject, data) {
        return __awaiter(this, void 0, void 0, function* () {
            (yield this.stan).publish(subject, jc.encode(data));
            console.log(subject, "published");
        });
    }
    subscribe(subject) {
        return __awaiter(this, void 0, void 0, function* () {
            if (subject == 'order:status') {
                (yield this.stan).subscribe(subject, {
                    callback: (err, msg) => {
                        const data = msg.data;
                        console.log("data", jc.decode(data));
                        orders = jc.decode(data);
                    }
                });
            }
        });
    }
}
const nats = new NatsConnect();
nats.subscribe("order:status");
app.get("/", () => {
    nats.publish("products", products);
});
app.post('/create-order', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = {
        product: {
            name: 'samsung s22',
            price: 100000
        }
    };
    (0, helpers_1.default)(order);
    nats.publish("create:order", order);
    res.send("order confirmed");
}));
app.listen(port, () => {
    console.log("order server running");
});
