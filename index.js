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
  async function getLogin(context) {
    console.log("Inside any things");
    var responseData
    console.log(context.payload.repository.owner.login)
    try {
      const response = await fetch(`https://git-greeter-server.vashishth-patel.repl.co/api/user/frombot?username=${context.payload.repository.owner.login}`, {
        method: "GET",
      });
      responseData = await response.json();
      console.log(response.status)
      if (response.status != 201) {
        console.log("Seconda time", responseData)
        return 0;
      }
      // console.log("Seconda time", responseData)
      // context["resonseData"] = responseData
    } catch (error) {
      console.log("Error in the response", error);
    }
    return responseData;
  }

  // async function middleware(context, res, next) {
  //   console.log("Inside Middleware");
  //   console.log(context.payload.repository.owner.login)
  //   return next();
  //   // try {
  //   //   const response = await fetch(`https://git-greeter-server.vashishth-patel.repl.co/api/user/frombot?username=${req.payload.repository.owner.login}`, {
  //   //     method: "GET",
  //   //   });
  //   //   const responseData = await response.json();
  //   //   console.log(response.status)
  //   //   if (response.status != 201) {
  //   //     // return;
  //   //   }
  //   //   console.log("Seconda time", responseData)
  //   //   req["resonseData"] = responseData
  //   // } catch (error) {
  //   //   console.log("Error in the response", error);
  //   // }
  //   // next()
  //   // // return;
  // }

  // on opening the issue
  app.on("issues.opened", async (context) => {
    var getData = await getLogin(context);
    if (getData == 0) {
      return;
    }
    var issueGreetMessage = getData.issueCreate
    await issueController.issueCreate(context, issueGreetMessage);
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
    var getData = await getLogin(context);
    if (getData == 0) {
      return;
    }
    var Message = getData.pull_requestCreate

    await pull_requestController.pull_requestCreate(context, Message);
    return await pull_requestController.pull_requestAddLabel(context)
  });
  // on synchronizing the pull request
  app.on("pull_request.synchronize", async (context) => {
    return await pull_requestController.pull_requestAddLabelOnSynchronize(context)
  });
  // on cosing or merging the pull request
  app.on("pull_request.closed", async (context) => {
    var getData = await getLogin(context);
    if (getData == 0) {
      return;
    }
    var MessageMerged = getData.pull_requestCloseMerged
    var MessageNot = getData.pull_requestClosedNotMerged
    return await pull_requestController.pull_requestClose(context, MessageMerged, MessageNot);
  });
  // on reopening the pull request
  app.on("pull_request.reopened", async (context) => {
    var getData = await getLogin(context);
    if (getData == 0) {
      return;
    }
    var Message = getData.pull_requestReopened
    return await pull_requestController.pull_requestReopened(context, Message);
  });

  // on creating issue comments
  app.on("issue_comment.created", async (context) => {
    var body = context.payload.comment.body;
    var getData = await getLogin(context);
    if (getData == 0) {
      return;
    }
    // console.log("Inside comment", getData)
    if (body == "/assign") {
      // assigning issue or pull request to user
      return await issueController.issueAssign(context);
    } else if (body == "/listfiles") {
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
