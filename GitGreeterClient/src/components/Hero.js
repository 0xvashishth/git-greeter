import React from "react";

var logo = "https://user-images.githubusercontent.com/89864614/222511122-1cb14207-250a-4104-b99f-6dd0f8c094d0.jpg";


const Hero = () => (
  <div className="text-center">
    <img className="mb-3 rounded app-logo" src={logo} alt="React logo" width="120" />
    <h2 className="mb-4">git-greeter Bot Configuration</h2>

    <p className="">
      This is <b>git-greeter</b> bot's configuration page for setting up the messages. Please Install the bot on your repository to start work with it.
    </p>
  </div>
);

export default Hero;
