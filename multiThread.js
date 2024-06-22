const cluster = require("cluster");
const os = require("os");
const numCPUs = require("node:os").availableParallelism();
const process = require("node:process");

function startexpress() {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  var corsOptions = {
    origin: "http://example.com",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
}

cpuCount=os.cpus().length

if (cluster.isPrimary) {
  console.log(`Number of CPUs is ${cpuCount}`);
  console.log(`Primary ${process.pid} is running`);

  for (var i = 0; i < cpuCount; i++) {
    cluster.fork();
  }

  cluster.on("online", function (worker) {
    console.log("Worker " + worker.process.pid + " is online");
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
  startexpress();
}

