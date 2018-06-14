const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
// const 

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set('view engine', 'ejs');

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "Ricky": {
    email: "ricky@acadia.nb", 
    password: "purple-monkey-dinosaur"
  },
 "Fred": {
    email: "fred@bringbackthebowls.qc", 
    password: "bowltheif"
  },
   "Van": { 
    email: "van@ENGLAND.com", 
    password: "dishwasher-funk"
  },
   "Arielle": {
    email: "ari@playsgoodmusic.mtl", 
    password: "cieling-fan"
  }
}

function generateRandomString() {
  let randomString = "";
  let allPossibleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 5; i++)
    randomString += allPossibleCharacters.charAt(Math.floor(Math.random() * allPossibleCharacters.length));
  return randomString;
}

//404 Helper
const render404 = res => {

  res.status(404).render("404");
};

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

//Home page
app.get("/", (req, res) => {
  res.end("HOME PAAAAAAAAGE \n Welcome to TinyApp! \n Try going to /urls!");
});

//URL Page
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase,
                      "user": users[req.cookies["user-id"]] 
                    };
  console.log(templateVars);
  res.render("urls_index", templateVars);
});

//Login Page
app.get("/login", (req, res) => {
  let templateVars = { urls: urlDatabase,
                      "user": users[req.cookies["user-id"]] 
                    };
  res.render("login", templateVars);
});

//Generation Page
app.get("/urls/new", (req, res) => {
    let templateVars = {"user": users[req.cookies["user-id"]]};
  res.render("urls_new", templateVars);
});

//Specific ID Page
app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id,
                        longURL: urlDatabase[req.params.id],
                        "user": users[req.cookies["user-id"]]
                      };
  res.render("urls_show", templateVars);
});

//Register page
app.get("/register", (req, res) => {
 let templateVars = { "user": users[req.cookies["user-id"]] };
 res.render("register", templateVars);
});

//Redirect from /u
app.get("/u/:shortURL", (req, res) => {
  let short = req.params["shortURL"];
  res.redirect(urlDatabase[short]);
});

//URL generation
app.post("/urls", (req, res) => {
  let long = req.body["longURL"];
  let urlID = generateRandomString();
  res.redirect(`/urls/${urlID}`);
  urlDatabase[urlID] = long;
});

//Delete URL
app.post("/urls/:id/delete", (req, res) => {
  let short = req.params.id;
  delete urlDatabase[short];
  res.redirect(`/urls`);
});

//Edit redirect
app.post("/urls/:id/edit", (req, res) => {
  let short = req.params.id;
  res.redirect(`/urls/${short}`);
});

//NewURL redirect
app.post("/urls/new", (req, res) => {
  res.redirect(`/urls/new`);
});

//Update longURL
app.post("/urls/:id/update", (req, res) => {
  let long = req.body["longURL"];
  let short = req.params["id"];
  urlDatabase[short] = long;
  res.redirect(`/urls/`);
});

//Login writing
app.post("/login", (req,res) => {
  let email = req.body['email'];
  let password = req.body['password'];
  if(email === undefined || password === undefined){
    render404(res);
  }
  //use user id cookie
  for (checkUser in users) {
    if(email === checkUser["email"] && password === checkUser["password"]){
      res.cookie("userid", checkUser["id"]);
    } else {
      render404(res);
    }
  }
  res.redirect("/urls");
});

//Logout writing
app.post("/logout", (req,res) => {
 res.clearCookie("user-id");
 res.redirect("/urls");
});

//Register - account submission
app.post("/register", (req,res) => {
  let email = req.body['email'];
  let password = req.body['password'];
  let userID = generateRandomString();
  let insertUser = {};
  if((email === "") || (password === "")){
    render404(res);
  } else {
    for (checkUser in users) {
      if(email === checkUser["email"]){
        render404(res);
      }
    }
    insertUser["email"] = email;
    insertUser["password"] = password;
    users[userID] = insertUser;
    res.cookie("user-id", userID);
    res.redirect("/urls");
  }
});

//Listening
app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
