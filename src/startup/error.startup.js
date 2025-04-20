// for global uncaught error not specified 

module.exports = () => {
  process.on("uncaughtException", (err) => {
    console.log(err.message);
  });
  process.on("uncaughtException", (err) => {
    console.log(err.message);
  });
  console.log("🚧 Error Handler Applied");
};
