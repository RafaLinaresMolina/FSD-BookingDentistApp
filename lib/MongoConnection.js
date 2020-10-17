const mongoose = require("mongoose");

/**
 * Class that manage mongoose connections
 */
class MongoConnection {
  constructor(obj) {
    this.uri = obj.uri;
    this.config = obj.config;
  }

  /**
   * Method that create the connection to MongoDB in mongoose
   */
  connect = async () => {
    try {
      mongoose.connect(this.uri, this.config);
      process.log.info(
        `Connected to MongoDB on '${process.env.MONGO_CLUSTER}.${process.env.MONGO_DB}' succesfully!`
      );
    } catch (err) {
      process.log.err(err);
    }
  };
}

module.exports = MongoConnection;
