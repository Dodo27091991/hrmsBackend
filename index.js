const mongoose = require('mongoose')
const dotenv=require('dotenv')
const express=require('express')
const cors =require('cors')
//const multer=require('multer')

// for multiThreading********************************************
const cluster = require("cluster");
const os = require("os");
//const numCPUs = require("node:os").availableParallelism();
const process = require("node:process");
let cpuCount = os.cpus().length;
//  End import for multi threading


//*************Environment Variable */
dotenv.config({path:'./config.env'})

//*************Database Connection */
mongoose.connect(process.env.DATABASE_URL).then((con)=>{
    console.log("connected to database")
}).catch((error)=>{
    console.log("There is an error")
})

//*************Express server setting */

//   below one line added *****************
function startexpress(){


const app=express()

app.use(express.json())
app.use(express.static(`${__dirname}/public`))
app.use(cors())
app.use('/api/v1/',require('./routes/userRoute'))

app.listen(5500,()=>{
    console.log("server is up at port:5500")
})

} //closing of the function added


// below code is for multi threading  *********************
if (cluster.isPrimary) {
    console.log(`Number of CPUs is ${cpuCount}`);
    console.log(`Primary ${process.pid} is running`);
  
    for (var i = 0; i < cpuCount; i++) {
      cluster.fork();
    }
  
    cluster.on("online", function (worker) {
      console.log("Worker =====>" + worker.process.pid + " is online");
    });
  
    cluster.on("exit", function (worker, code, signal) {
      console.log(
        "Worker " +
          worker.process.pid +
          " died with code: " +
          code +
          ", and signal: " +
          signal
      );
      console.log("Starting a new worker");
      cluster.fork();
    });
  } else {
    console.log("I Entered here")
    startexpress();
  }

// ***************Above code is for multithreading

