import mongoose from 'mongoose';

const connectionString = 'mongodb://localhost:27017/Microservice-products';

mongoose.connect(connectionString);

const db = mongoose.connection;


export default db