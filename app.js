const path = require('path');
const express = require('express');
const fs = require('fs');

app = express();
app.listen(3000);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/restaurants', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'restaurants.json');
    const fileData = fs.readFileSync(filePath)

    const storedRestaurants = JSON.parse(fileData)

    res.render('restaurants', {
        numberOfRestaurants: storedRestaurants.length,
        restaurants: storedRestaurants
    });
});

app.get('/recommend', (req, res) => {
    res.render('recommend');
});

app.post('/recommend', (req, res) => {
    const reataurant = req.body
    const filePath = path.join(__dirname, 'data', 'restaurants.json');
    const fileData = fs.readFileSync(filePath)

    const storedRestaurants = JSON.parse(fileData)
    storedRestaurants.push(reataurant)
    fs.writeFileSync(filePath, JSON.stringify(storedRestaurants))
    res.redirect('/confirm')
});

app.get('/confirm', (req, res) => {
    res.render('confirm');
});

app.get('/about', (req, res) => {
    res.render('about');
});


    