const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var fs = require("fs");
var path = require("path");
const cookieSession = require("cookie-session");
const morgan = require("morgan");

// ===================== PORT LIVE =================

const port = 3000;

// ===================== EXPRESS PLUGIN DEFINITION ===================

app.use(express.static(__dirname + "/assets")); // asset folder 
app.use(bodyParser.json()); // json body
app.set("view engine", "ejs"); // set view engine 
app.set("views", "views"); // view engine 
app.use(cookieSession({ secret: "i2s" })); // session 
app.use(morgan("combined")); // Morgan logger
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// ====================== Konfigurasi situs =====================

// ==================== Auto include router

function includeRouter(folderName) {
  console.log(" ======================================= ")
  fs.readdirSync(folderName).forEach(function (file) {
    var fullName = path.join(folderName, file);
    var stat = fs.lstatSync(fullName);

    if (stat.isDirectory()) {
      includeRouter(fullName);
    } else if (file.toLowerCase().indexOf(".js")) {
      require("./" + fullName)(app);
      console.log(" Found Router => '" + fullName + "'");
    }
  });
  console.log(" ======================================= ")
}

// =================== Set Interval Refresh Check email Blast
includeRouter("router");

///// ============= Config PORT Aplikasi
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

