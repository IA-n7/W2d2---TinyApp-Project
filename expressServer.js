var express = require("express");
var app = express();
var PORT = 8080;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  var short = "";
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return short;
}

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

//URL Page
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
 
//Specific ID Page
app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id,
                        longURL: urlDatabase[req.params.id]
                      };
  res.render("urls_show", templateVars);
});

//Home page
app.get("/", (req, res) => {
  res.end("Hello!");
});

//POSTing submitted URLs
app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});