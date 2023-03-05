import React, { } from "react";
// import { Button } from "reactstrap";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
// import { getConfig } from "../config";
import Loading from "../components/Loading";

export const ExternalApiComponent = () => {
  // const { apiOrigin = "https://replit.com/@Vashishth-Patel/git-greeter-server", audience } = getConfig();

  // const [state, setState] = useState({
  //   showResult: false,
  //   apiMessage: "",
  //   error: null,
  // });

  const {
    user
  } = useAuth0();
  console.log(user)
  return (
    <>
      <h1>get-greeter usage</h1>
      <hr />

      <p>
        You have to install it in the repository and also have to manually setup the messages and events in this website client.
      </p>
    </>
  );
};

export default withAuthenticationRequired(ExternalApiComponent, {
  onRedirecting: () => <Loading />,
});
