// designed to handle errors that occur during the processing of HTTP requests

// will automatically respond back if any error occurs in the API

const Response = require("../helpers/Response.helpers");

module.exports = (err, req, res, next) => {
  try {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    console.log(err);
    Response(res).status(status).error(message).send();
  } catch (error) {
    console.log(error);
  }
};
