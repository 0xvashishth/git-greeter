var commentController = require("./events/comment");


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



  // on creating issue comments
  app.on("issue_comment.created", async (context) => {
    var body = context.payload.comment.body;
    if (body == "/assign") {
      // assigning issue or pull request to user
      return await issueController.issueAssign(context);
    }else if(body == "/listfiles"){
      // listing files of the pull request
      return await pull_requestController.pull_requestListFiles(context);
    }
    return await commentController.reactOnIssueCommentCreate(context);
  });

  // on editing issue comments
  app.on("issue_comment.edited", async (context) => {
    return await commentController.reactOnIssueCommentEdit(context);
  });
};
