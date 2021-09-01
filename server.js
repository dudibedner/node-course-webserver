const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engins', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use((req, res, next) => {
    let now = new Date().toString();
    let log = `${now}: ${req.method} ${req.url}`;
    fs.appendFile('server.log', log + '\n', (err) => {
        if(err) {
            console.log('Unable to append to server.log file.');
            console.log(err.message);
        }
    });
    console.log(log);
    next();
});

app.use((req, res, next) => {
    if(new Date().getSeconds() % 5 !== 0) {
        next();
    }
    else {
        res.render('maintenance.hbs', {
            pageTitle: 'Under Maintenance',
        });
    }
});

hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());
hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => {
    //res.send('<h1 style="color: navy">Hello express!<h1>');
    res.render('home.hbs', {
        username: 'Dudi Bedner',
        pageTitle: 'Home',
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
    });
});

app.get('/foo', (req, res) => {
    let a = parseInt(req.query.a);
    let b = parseInt(req.query.b);

    console.log(a);
    console.log(b);
    res.send(`<h2 style="color: green">${a} + ${b} = ${a + b}</h2>`);
});

app.listen(3000, console.log('Server is up and running, listening on port 3000'));
