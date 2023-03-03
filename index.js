var issueController = require("./events/issue");
var commentController = require("./events/comment");
var pull_requestController = require("./events/pull_request");

module.exports = (app, { getRouter }) => {
  // Checking, app is currently working or not
  app.log("Yay! The app is loaded!");

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

  // on opening the issue
  app.on("issues.opened", async (context) => {
    await issueController.issueCreate(context);
    return await issueController.issueAddLabel(context)
  });
  // on editing the issue
  app.on("issues.edited", async (context) => {
    return await issueController.issueEdit(context);
  });
  // on closing the issue
  app.on("issues.closed", async (context) => {
    return await issueController.issueClose(context);
  })
  // on reopening the issue
  app.on("issues.reopened", async (context) => {
    return await issueController.issueReopened(context);
  })

  // on opening the pull request
  app.on("pull_request.opened", async (context) => {
    await pull_requestController.pull_requestCreate(context);
    return await pull_requestController.pull_requestAddLabel(context)
  });
  // on synchronizing the pull request
  app.on("pull_request.synchronize", async (context) => {
    return await pull_requestController.pull_requestAddLabelOnSynchronize(context)
  });
  // on cosing or merging the pull request
  app.on("pull_request.closed", async (context) => {
    return await pull_requestController.pull_requestClose(context);
  });
  // on reopening the pull request
  app.on("pull_request.reopened", async (context) => {
    return await pull_requestController.pull_requestReopened(context);
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
