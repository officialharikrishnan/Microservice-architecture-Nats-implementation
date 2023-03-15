"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema();
const order = mongoose_1.default.model('order', orderSchema);
function createOrder(data) {
    const newOrder = new order(data);
    newOrder.save();
}
exports.default = createOrder;
