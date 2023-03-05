<h1 align="center"> git-greeter </h1>

---

- A GitHub App for automating the github basic workflow.

- App Link: https://github.com/apps/git-greeter

## Inspiration
In Open-source Programs or Open-Source Contributions, by automating out GitHub workflow, we can focus on real collaboration, instead of getting stuck doing boring housekeeping things, like greeting to the users and assigning initial labels and Reacting on some good messages and so on. And As humans, we can’t always be up 24/7. Sometimes it is nice for your contributors if they can receive prompt response and feedback, instead of waiting until you’re back.
Especially when I was the Project Admin at GirlScript Summer of Code, I faced these issues, So I got inspiration from that and started building this.

## What it does
Many things: 
- It can automatically respond to users on some events like opening the issue or opening the pull request.
- Apply labels to the issue.
- Listing Files on commenting the command in the pull request.
- Assigning the issue on commenting the command in the issue or pull.
- Sending message when pull or issue is closed based on the issue or pull state.
- React on some good messages which have some good keywords.
- Much more...

## How we built it
- I used one GitHub REST API Official documentation, and learnt how to make requests in GitHub Webhooks.
- I utilize Probot tool for configuring this app for GitHub.
- Used Replit for hosting all server, client and GitHub app.

## Challenges we ran into
- I faced an issue in retrieving the data from the mongo DB in Probot index.js configuration, but I found a way of doing the same, and that was same as we do in normal NodeJS server.

## Accomplishments that we're proud of
- This bot is customizable and whatever we want to do edit the messages.

## What we learned
- Learnt about GitHub REST API
- Learnt how to communicate with different apps via APIs.
- Learnt about GitHub Webhook events
- Got to know about awesome webhook event URL provider called `smee.io`

## What's next for git-greeter
- Want to add some more cool functionalities like making cards and commenting on the same in the issues and pull requests. cards mean the contribution done in the current repo by the user.

<b>Stay Tuned 🎉</b>
