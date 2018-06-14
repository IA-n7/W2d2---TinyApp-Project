const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set('view engine', 'ejs');

var urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: ""
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "B2C11"
  }
};

var users = { 
  "Ricky": {
    id: "1",
    email: "ricky@acadia.nb", 
    password: "purple-monkey-dinosaur"
  },
  "Fred": {
    id: "2",
    email: "fred@bringbackthebowls.qc", 
    password: "bowltheif"
  },
  "Van": { 
    id: "3",
    email: "van@ENGLAND.com", 
    password: "dishwasher-funk"
  },
  "Arielle": {
    id: "4",
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

function findURLsforUser (userid) {
  let urls = {};
  for (id in urlDatabase) {
    if (urlDatabase[id]["userID"] === userid) {
            urls[id] = urlDatabase[id]["longURL"];
    }
  }
  return urls;
}

function ifUser (req) {
  if((req.cookies["user-id"]) !== undefined) {
    return 1;
  } else {
    return 0;
  }
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
  let condition = ifUser(req);
  if (condition > 0) {
    let urls = findURLsforUser(req.cookies["user-id"]);
    let email = req.cookies["user-id"]["email"];
    let templateVars = { 
      "urls": urls,
      "user": users[req.cookies["user-id"]]["email"]
      };
    res.render("urls_index", templateVars);
  } else {
    let templateVars = { 
      "urls": "",
      "user": undefined
    };
  res.render("urls_index", templateVars);
  }
});

//Login Page
app.get("/login", (req, res) => {
  let templateVars = { 
    urls: urlDatabase,
    "user": users[req.cookies["user-id"]] 
  };
  res.render("login", templateVars);
});

//Generation Page
app.get("/urls/new", (req, res) => {
  let templateVars = {"user": users[req.cookies["user-id"]]["email"]};
  res.render("urls_new", templateVars);
});

//Specific ID Page
app.get("/urls/:id", (req, res) => {
  let condition = ifUser(req);
  if (condition > 0) {
      let templateVars = { 
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id]["longURL"],
    "user": users[req.cookies["user-id"]]["email"]
  };
  res.render("urls_show", templateVars);
} else {
  res.redirect("/login/");
}

});

//Register page
app.get("/register", (req, res) => {
 let templateVars = { "user": users[req.cookies["user-id"]] };
 res.render("register", templateVars);
});

//Redirect from /u
app.get("/u/:shortURL", (req, res) => {
  let short = req.params["shortURL"];
  res.redirect(urlDatabase[short]["longURL"]);
});








//URL generation
app.post("/urls", (req, res) => {
  let long = req.body["longURL"];
  let urlID = generateRandomString();
  let userID = req.cookies["user-id"];
  urlDatabase[urlID] = {};
  urlDatabase[urlID]["longURL"] = long;
  urlDatabase[urlID]["userID"] = userID;
  res.redirect(`/urls/${urlID}`);
});

//Delete URL
app.post("/urls/:id/delete", (req, res) => {
  let short = req.params.id;
    if(urlDatabase[short]["userID"] === req.cookies["user-id"]) {
      delete urlDatabase[short];
      res.redirect(`/urls`);
    } else {
        render404(res);
    }
});

//Edit redirect
app.post("/urls/:id/edit", (req, res) => {
  let short = req.params.id;
  if(urlDatabase[short]["userID"] === req.cookies["user-id"]) {
     res.redirect(`/urls/${short}`);
  } else {
    render404(res);
  }
});

//Update longURL
app.post("/urls/:id/update", (req, res) => {
  let long = req.body["longURL"];
  let short = req.params["id"];
  urlDatabase[short]["longURL"] = long;
  res.redirect(`/urls/`);
});

//NewURL redirect
app.post("/urls/new", (req, res) => {
  if (req.cookies["user-id"] === undefined) {
    res.redirect(`/login`);
  } else {
    res.redirect(`/urls/new`);
  }
});

//Login writing
app.post("/login", (req,res) => {
  let emailCheck = req.body['email'];
  let passwordCheck = req.body['password'];
  if(emailCheck === undefined || passwordCheck === undefined){
    render404(res);
  }
  for (checkUser in users) {
    if(emailCheck === users[checkUser]["email"] && passwordCheck === users[checkUser]["password"]){
      let temp = users[checkUser]["id"];
      res.cookie("user-id", temp);    
      res.redirect("/urls");
      break;
    } else {
    }
  }
  render404(res);
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

  let hashedPassword = bcrypt.hashSync(password, 10);

  if((email === "") || (password === "")){
    render404(res);
  } else {
    for (checkUser in users) {
      if(email === checkUser["email"]){
        render404(res);
      }
    }
    insertUser["id"] = userID;
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
