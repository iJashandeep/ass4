/********************************************************************************
* WEB322 – Assignment 04
* 
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
* 
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
* Name: Jashandeep Singh   Student ID: 145936225   Date: 14/07/2024
*
* Published URL: https://ass4-eight.vercel.app/
*
********************************************************************************/
const { log } = require("console");
const availableThemes = ["Technic", "Basic Set", "Icons"];

const legoData = require("./modules/legoSets");
legoData.initialize();

const express = require('express');
const path = require('path');
const { NONAME } = require("dns");
const app = express();

// Setting the "views" Application Setting
app.set('views', path.join(__dirname, 'views'));

// Updating express.static() Middleware
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

// Explicitly Requiring the "pg" Module
require('pg'); // explicitly require the "pg" module
const Sequelize = require('sequelize');

const HTTP_PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.render("home", { page: '/' });
});

app.get('/about', (req, res) => {
  res.render("about", { page: '/about' });
});

app.get('/lego/sets', (req, res) => {
  console.log(req.query);
  if (req.query.theme){
    legoData.getSetsByTheme(req.query.theme)
    .then(themeSets => {
      res.render('sets', {legoSets: themeSets, currentTheme: req.query.theme, availableThemes: availableThemes});
    })
    .catch(error => {
        console.error(error);
        res.status(404).render('404', {message: "No sets found for the specified theme."});
    });
  }
  else {
    legoData.getAllSets()
    .then(sets => {
        res.render('sets', {legoSets: sets, currentTheme: "", availableThemes: availableThemes});
    })
    .catch(error => {
        console.error(error);
        res.status(404).render('404', {message: "I'm sorry, we're unable to find what you're looking for."});
    });
  }
});

app.get('/lego/sets/:set_num', (req, res) => {
  const setNum = req.params.set_num;

  legoData.getSetByNum(setNum)
    .then((set) => {
      if (!set) {
        res.status(404).render("404", { message: "No set found for the specified set number." });
      } else {
        res.render('set', { legoSet: set });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(404).render("404", { message: "I'm sorry, we're unable to find what you're looking for." });
    });
});

app.use((req, res) => {
  res.status(404).render("404", { message: "The page you requested does not exist." });
});

legoData.initialize().then(() => {
  app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
}).catch((err) => {
  console.log(err);
});
