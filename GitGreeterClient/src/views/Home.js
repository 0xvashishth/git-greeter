import React, { Fragment } from "react";

import Hero from "../components/Hero";
import Content from "../components/Content";
import Loading from "../components/Loading";
import {   withAuthenticationRequired } from "@auth0/auth0-react";

const Home = (props) => (
  <Fragment>
    <Hero />
    <hr />
    <Content />
  </Fragment>
);

// export default Home;
export default withAuthenticationRequired(Home, {
  onRedirecting: () => <Loading />,
});
