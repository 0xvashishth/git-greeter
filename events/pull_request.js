const pull_requestCreate = async (context) => {
  var author = context.payload.sender.login;
  var repo = context.payload.repository.name;
  var issue_number = context.payload.pull_request.number;
  var owner = context.payload.repository.owner.login;

  var body = `Hey **${author}** 🙋🏻‍♂️<br/>Thanks for contributing to this repository :octocat: Your contribution is greatly appreciated and will help us to improve our project. We will review your pull_request as soon as possible. ✨`;

  // Post a comment on the opening pull request
  return await context.octokit.issues.createComment({
    owner,
    repo,
    issue_number,
    body,
  });
};

const pull_requestClose = async (context) => {
  var author = context.payload.sender.login;
  var repo = context.payload.repository.name;
  var issue_number = context.payload.pull_request.number;
  var owner = context.payload.repository.owner.login;
  var pull_state = context.payload.pull_request.merged;

  var body;

  if (!pull_state) {
    body = `Hey **${author}** 🙋🏻‍♂️<br/>Thanks for giving time to this repository :octocat: ✨<br/>See you soon 🎊`;
  } else {
    body = `Hey **${author}** 🙋🏻‍♂️<br/>Hureeeeh🎉🥳 Your pull request has been merged :octacat: **Thanks for contributing** ✨`;
  }

  // Post a comment on the opening pull request
  return await context.octokit.issues.createComment({
    owner,
    repo,
    issue_number,
    body,
  });
};

const pull_requestReopened = async (context) => {
  var author = context.payload.sender.login;
  var repo = context.payload.repository.name;
  var issue_number = context.payload.pull_request.number;
  var owner = context.payload.repository.owner.login;
  var pull_state = context.payload.pull_request.state;

  var body = `Hey **${author}** 🙋🏻‍♂️<br/>Thanks for reopening this pull request :octocat:`;

  // Post a comment on the opening pull request
  return await context.octokit.issues.createComment({
    owner,
    repo,
    issue_number,
    body,
  });
};

const pull_requestAddLabel = async (context) => {
  var repo = context.payload.repository.name;
  var issue_number = context.payload.pull_request.number;
  var owner = context.payload.repository.owner.login;
  // add label on pull request when created
  return await context.octokit.issues.addLabels({
    owner,
    repo,
    issue_number,
    labels: ["review_needed"],
  });
};

const pull_requestAddLabelOnSynchronize = async (context) => {
  var repo = context.payload.repository.name;
  var issue_number = context.payload.pull_request.number;
  var owner = context.payload.repository.owner.login;
  // add label on pull request when edited
  return await context.octokit.issues.addLabels({
    owner,
    repo,
    issue_number,
    labels: ["updated"],
  });
};

const pull_requestListFiles = async (context) => {
  var repo = context.payload.repository.name;
  var pull_number = context.payload.issue.number;
  var owner = context.payload.repository.owner.login;
  // getting files data on the pull request
  var response = await context.octokit.pulls.listFiles({
    owner,
    repo,
    pull_number,
  });

  var files = response.data;
  var body = `<table>
  <tbody>
  <tr>
  <th><a href="#">File Name</a></th>
  <th><a href="#">Status</a></th>
  <th><a href="#">Additions</a></th>
  <th><a href="#">Deletions</a></th>
  <th><a href="#">URL</a></th>
  </tr>
  `;
  for (var i = 0; i < files.length; i++) {
    var filename = files[i].filename;
    var status = files[i].status;
    var additions = files[i].additions;
    var deletions = files[i].deletions;
    var url = files[i].blob_url;
    body += `<tr>
    <td>${filename}</td>
    <td>${status}</td>
    <td>${additions}</td>
    <td>${deletions}</td>
    <td><a href="${url}">Link</a></td>
    </tr>
    `;
  }
  body += `</tbody>
  </table>`;
  var issue_number = pull_number;
  // Post a comment on requesting file details
  return await context.octokit.issues.createComment({
    owner,
    repo,
    issue_number,
    body,
  });
};

module.exports = {
  pull_requestCreate,
  pull_requestClose,
  pull_requestReopened,
  pull_requestAddLabel,
  pull_requestAddLabelOnSynchronize,
  pull_requestListFiles,
};
