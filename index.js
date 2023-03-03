

module.exports = (app, { getRouter }) => {
  // Checking, app is currently working or not
  app.log("Yay! The app was loaded!");

  const router = getRouter("/api");

  // Use any middleware
  router.use(require("express").static("public"));

  // Add a new route
  router.get("/installation", (req, res) => {
    res.send("Hello GitHub World");
  });

  // On every event, can be used for the website authentication
  app.onAny(async (ontext) => {
    console.log("Inside any things");
  });

};
