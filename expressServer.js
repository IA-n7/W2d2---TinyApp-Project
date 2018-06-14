const express = require("express");
const app = express();
const PORT = 8080;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var cookieParser = require('cookie-parser')

app.use(cookieParser())


app.set('view engine', 'ejs');

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  let randomString = "";
  let allPossibleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 5; i++)
    randomString += allPossibleCharacters.charAt(Math.floor(Math.random() * allPossibleCharacters.length));
  return randomString;
}

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

//URL Page
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase,
                      username: req.cookies["username"] 
                    };
  res.render("urls_index", templateVars);
});

//Generation Page
app.get("/urls/new", (req, res) => {
    console.log(req.cookies["username"]);
    let templateVars = {username: req.cookies["username"] 
                        };
  res.render("urls_new", templateVars);
});

//Specific ID Page
app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id,
                        longURL: urlDatabase[req.params.id],
                        username: req.cookies["username"]
                      };
  res.render("urls_show", templateVars);
});

//Home page
app.get("/", (req, res) => {
  res.end("OK");
});

//Register page
app.get("/register", (req, res) => {


  res.end("OK");
});

//Redirect from /u
app.get("/u/:shortURL", (req, res) => {
  let short = req.params["shortURL"];
  res.redirect(urlDatabase[short]);
});

//POSTing submitted URLs
app.post("/urls", (req, res) => {
  let long = req.body["longURL"];
  let urlID = generateRandomString();
  res.redirect(`/urls/${urlID}`);
  urlDatabase[urlID] = long;
});

//POSTing delete URL
app.post("/urls/:id/delete", (req, res) => {
  let short = req.params.id;
  delete urlDatabase[short];
  res.redirect(`/urls`);
});

//POSTing edit 
app.post("/urls/:id/edit", (req, res) => {
  let short = req.params.id;
  res.redirect(`/urls/${short}`);
});

//POSTing an updated longURL
app.post("/urls/:id/update", (req, res) => {
  let long = req.body["longURL"];
  let short = req.params["id"];
  urlDatabase[short] = long;
  res.redirect(`/urls/`);
});

app.post("/login", (req,res) => {
  let short = req.body['username']
 res.cookie("username", short);
 res.redirect("/urls");
});

app.post("/logout", (req,res) => {
 res.clearCookie("username");
 res.redirect("/urls");
});

//Listening
app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
