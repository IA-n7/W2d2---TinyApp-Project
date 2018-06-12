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
  var randomString = "";
  var allPossibleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 5; i++)
    randomString += allPossibleCharacters.charAt(Math.floor(Math.random() * allPossibleCharacters.length));
  return randomString;
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
  console.log(req.body);
  var long = req.body["longURL"];
  var urlID = generateRandomString();
  res.redirect(`/urls/${urlID}`);
  urlDatabase[urlID] = long;
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
