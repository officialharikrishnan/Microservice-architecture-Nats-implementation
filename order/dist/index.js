"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nats_1 = __importDefault(require("nats"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
class NatsConnect {
    constructor() {
        this.agent = nats_1.default.connect({ servers: '0.0.0.0:4222' });
        console.log(this.agent);
    }
}
app.listen(5000, () => {
    console.log("order server running");
});
