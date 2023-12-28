const express = require("express");
const {
  getStoredRestaurants,
  storeRestaurants,
} = require("../util/restaurant-data");
const router = express.Router();
const uuid = require("uuid");

router.get("/restaurants", (req, res) => {
  let order = req.query.order;
    let nextOrder = "desc";
  if (order !== "asc" && order !== "desc") {
    order = "asc";
  }

  if (order == "desc") {
    nextOrder = "asc";
  }

  const storedRestaurants = getStoredRestaurants();

  storedRestaurants.sort((a, b) => {
    if ((order === "asc" && a.name > b.name) || (order === "desc" && b.name > a.name)) {
      return 1;
    }
    return -1;
  });
  res.render("restaurants", {
    numberOfRestaurants: storedRestaurants.length,
    restaurants: storedRestaurants,
    nextOrder: nextOrder,
  });
});

router.get("/restaurants/:id", (req, res) => {
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

router.get("/recommend", (req, res) => {
  res.render("recommend");
});

router.post("/recommend", (req, res) => {
  const restaurant = req.body;
  restaurant.id = uuid.v4();

  const storedRestaurants = getStoredRestaurants();
  storedRestaurants.push(restaurant);
  storeRestaurants(storedRestaurants);
  res.redirect("/confirm");
});

router.get("/confirm", (req, res) => {
  res.render("confirm");
});

module.exports = router;
