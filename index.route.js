const express = require('express');
const locationRoutes = require('./server/location//location.route');

const router = express.Router(); // eslint-disable-line new-cap

router.get("/", (req, res) => res.send("Hello World!"));

// /api/location/
router.use('/location',locationRoutes);

module.exports = router;