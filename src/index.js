import app from "./app.js";
import { configuration } from "./config/config.js";
import { DataBaseConnect } from "./database/dbconnect.js";

(async () => {
  try {
    await DataBaseConnect();
    app.get("/", (req, res) => {
      res.json({
        Name: "Shivam Anand",
      });
    });
    app.listen(configuration.PORT || 4040, () => {
      console.log(
        `Server started at http://localhost:${configuration.PORT || 4040}/`
      );
    });
  } catch (error) {
    console.log("ERROR : ", error);
  }
})();
