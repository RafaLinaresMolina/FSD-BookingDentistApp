require("dotenv").config();
const express = require("express");
const MongoConnection = require("./lib/MongoConnection");
const app = express();
const PORT = process.env.PORT || 5500;
const Log = require("./lib/logger");
const authControler = require('./routers/autRouter');
const clientControler = require('./routers/clientRouter');

/**
 * This function create the MongoConnection Object
 * for manage the connection with the database
 * @returns MongoConnection
 */
const initMongoConfig = () => {
  const mongoUri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}.5y9t4.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
  const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  };
  const mongoConfig = { uri: mongoUri, config: mongoOptions };
  return new MongoConnection(mongoConfig);
};

/**
 * This method apply the config to the logger
 */
const initLogger = async () => {
  await Log.readConfig("./config/logger.json");
};

/**
 * This method initialize and execute the express API REST Service
 */
const initExpress = () => {
  app.use(express.json());
  app.use('/auth',authControler);
  app.use('/client',clientControler);
  app.listen(PORT, () => {
    Log.info(`Express running on port: ${PORT}`);
  });
};

/**
 * This method initialize all the components for the propper execution of the backend
 */
const init = async () => {
  try {
    await initLogger();
    process.log = Log;
    process.log.info("Logger loaded!");
    await initMongoConfig().connect();
    initExpress();
  } catch (err) {
    process.log.error(err.message);
  }
};

init();