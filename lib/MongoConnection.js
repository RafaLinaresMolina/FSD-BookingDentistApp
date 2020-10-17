const mongoose = require("mongoose");

class MongoConnection {
  constructor(obj) {
    this.uri = obj.uri;
    this.config = obj.config;
    this.db = null;
  }

  connect = async () => {
    try {
      mongoose.connect(this.uri, this.config);
      console.log("Successfully conected to MongoDB");
    } catch (err) {
      console.log(err);
    }
  };
}


module.exports = MongoConnection;
