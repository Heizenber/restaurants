const path = require("path");
const uuid = require("uuid");
const express = require("express");
const fs = require("fs");

const {getStoredRestaurants, storeRestaurants} = require("./util/restaurant-data");

app = express();
app.listen(3000);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/restaurants", (req, res) => {

  const storedRestaurants = getStoredRestaurants();

  res.render("restaurants", {
    numberOfRestaurants: storedRestaurants.length,
    restaurants: storedRestaurants,
  });
});

app.get("/restaurants/:id", (req, res) => {
  const restaurantId = req.params.id;

  const storedRestaurants = getStoredRestaurants();
  for (const restaurant of storedRestaurants) {
    if (restaurant.id === restaurantId) {
      return res.render("restaurant-detail", {
        restaurant: restaurant,
      });
    }
  }

  res.status(400).render("404");
});

app.get("/recommend", (req, res) => {
  res.render("recommend");
});

app.post("/recommend", (req, res) => {
  const restaurant = req.body;
  restaurant.id = uuid.v4();


  const storedRestaurants = getStoredRestaurants();
  storedRestaurants.push(restaurant);
  storeRestaurants(storedRestaurants)
  res.redirect("/confirm");
});

app.get("/confirm", (req, res) => {
  res.render("confirm");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.use((req, res) => {
  res.status(404).render("404");
});

app.use((err, req, res, next) => {
  res.status(500).render("500");
});
