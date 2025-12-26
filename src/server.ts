import app from "./app";
import config from "./config";
const port = config.port || 5000;

app.listen(port, () => {
  console.log("server is running on the port :", port);
});
