import mongoose from "mongoose";
import { configuration } from "../config/config.js";

export const DataBaseConnect = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to MongoDB");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected from MongoDB");
    });

    await mongoose.connect(`${configuration.URL}`);
  } catch (error) {
    if (error instanceof mongoose.Error.MongooseServerSelectionError) {
      console.error("Error selecting a server:", error);
    } else {
      console.error("Error connecting to MongoDB:", error);
    }
    process.exit(1);
  }
};
