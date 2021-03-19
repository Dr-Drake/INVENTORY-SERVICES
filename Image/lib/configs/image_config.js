var path = require("path");
var abspath = path.join(__dirname, "../../uploads")  // Folder has to exist

module.exports = {
    host: "http://localhost:7579",
    filePath: abspath
}