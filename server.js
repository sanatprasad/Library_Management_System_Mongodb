const express =require('express');
const dotenv=require('dotenv');
const connectDB = require('./config/mongo');
const path = require('path');

//dotenv config
dotenv.config();

//mongodb connection
connectDB();

//rest object
const app=express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use("/api/v1/user",require("./routes/userRoutes"));
app.use("/api/v1/book",require("./routes/bookRoutes"));
app.use("/api/v1/author",require("./routes/authorRoutes"));
app.use("/api/v1/library",require("./routes/libRoutes"));
// //listen port
const port=process.env.PORT ||8080

app.listen(port,()=>{
    console.log(`Server Running in ${process.env.NODE_MODE} Mode on port ${process.env.PORT} `.bgCyan.white);
});