require("dotenv").config();
const express = require("express");
const MongoConnection = require("./lib/MongoConnection");
const app = express();
const PORT = process.env.PORT || 5500;

const mongoUri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}.5y9t4.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};
const mongoConfig = { uri: mongoUri, config: mongoOptions };
const mongo = new MongoConnection(mongoConfig);

mongo
  .connect()
  .then(() => init())
  .catch(console.error);

const init = () => {
  app.use(express.json());
  app.listen(PORT, () => console.log("server running on port " + PORT));
};
