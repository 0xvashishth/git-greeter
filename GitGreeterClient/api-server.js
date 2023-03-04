const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const authConfig = require("./src/auth_config.json");
const connectDB = require("./db");
const defaultContent = require("./default_content.json");
const app = express();
const User = require("./user");
const router = express.Router();
const bodyParser = require('body-parser')
connectDB();

const port = process.env.API_PORT || 3001;
const appPort = process.env.SERVER_PORT || 3000;
const appOrigin = authConfig.appOrigin || `http://localhost:${appPort}`;

if (
  !authConfig.domain ||
  !authConfig.audience ||
  authConfig.audience === "YOUR_API_IDENTIFIER"
) {
  console.log(
    "Exiting: Please make sure that auth_config.json is in place and populated with valid domain and audience values"
  );

  process.exit();
}
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// Init Middleware
app.use(express.json({ extended: false }));
app.use(express.json());

app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ origin: appOrigin }));

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ["RS256"],
});

app.get("/api/external", checkJwt, (req, res) => {
  console.log("Hello");
  res.send({
    msg: "Your access token was successfully validated!",
  });
});

app.post("/api/user/update", async function(req, res) {
  const {
    _id,
    name,
    username,
    email,
    issueCreate,
    issueAssign,
    issueEdit,
    issueAddLabel,
    issueClosedCompleted,
    issueClosedNotCompleted,
    issueReopened,
    pull_requestCreate,
    pull_requestCloseMerged,
    pull_requestClosedNotMerged,
    pull_requestReopened,
    pull_requestAddLabel,
    pull_requestAddLabelOnSynchronize,
    pull_requestListFiles,
    reactOnIssueCommentCreate,
    reactOnIssueCommentEdit,
  } = req.body;
  const userupdate = await User.updateOne(
    { _id },
    { $set: req.body }
  );
  if (!userupdate) {
    return res.status(422).json({ message: "Something went wrong!!!!" });
  } else {
    return res.status(201).json({ message: "User Updated Successfully" });
  }
})

app.get("/api/user", checkJwt, async (req, res) => {
  const { username, name, email } = req.query;
  try {
    const user = await User.findOne({ username: username });
    // console.log(user);
    if (user == undefined) {
      console.log("User is not registered");
      try {
        const { issueCreate, issueAssign, issueEdit, issueAddLabel,
          issueClosedCompleted, issueClosedNotCompleted, issueReopened,
          pull_requestCreate, pull_requestCloseMerged, pull_requestClosedNotMerged,
          pull_requestReopened, pull_requestAddLabel, pull_requestAddLabelOnSynchronize,
          pull_requestListFiles, reactOnIssueCommentCreate, reactOnIssueCommentEdit } = defaultContent;
        const usernew = new User({
          name, email, username, issueCreate, issueAssign, issueEdit, issueAddLabel,
          issueClosedCompleted, issueClosedNotCompleted, issueReopened,
          pull_requestCreate, pull_requestCloseMerged, pull_requestClosedNotMerged,
          pull_requestReopened, pull_requestAddLabel, pull_requestAddLabelOnSynchronize,
          pull_requestListFiles, reactOnIssueCommentCreate, reactOnIssueCommentEdit
        });
        const userRegister = await usernew.save();
        if (userRegister) {
          return res
            .status(201)
            .json(userRegister);
        } else {
          res.status(500).json({ error: "Failed to register user" });
        }
      } catch (err) {
        console.log(err);
      }
    }
    console.log("User already registered..!")
    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
    return res.status(422).json({ error: "Something went wrong!" });
  }
});

app.listen(port, () => console.log(`API Server listening on port ${port}`));
