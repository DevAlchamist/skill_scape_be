require("dotenv").config(); // intitializing env file

// only for async errors handling not synchronous errors
require("express-async-errors"); // catches any async error in the API, no need for any other ErrorHandling like try-catch // will work only after listening, middleware

const express = require("express");
const app = express();

//starting server
require("./startup/index.startup")(app);
