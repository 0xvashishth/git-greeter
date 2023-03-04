import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Row } from "reactstrap";
import { getConfig } from "../config";

function Content () {
  const {
    getAccessTokenSilently,
    loginWithPopup,
    getAccessTokenWithPopup,
    user
  } = useAuth0();
  const [content, setContent] = useState({
    name: "",email: "",username: "", 
    issueCreate: "", issueAssign: "", issueEdit: "",issueAddLabel: "", issueClosedCompleted: "", issueClosedNotCompleted: "", issueReopened: "",
    pull_requestCreate: "", pull_requestCloseMerged: "", pull_requestClosedNotMerged: "", pull_requestReopened: "",
    pull_requestAddLabel: "", pull_requestAddLabelOnSynchronize: "", pull_requestListFiles: "",
    reactOnIssueCommentCreate: "", reactOnIssueCommentEdit: ""
  });
  const [loader, setLoader] = useState("");
  const { apiOrigin = "http://localhost:3001", audience } = getConfig();

  const handleChange = (name) => (event) => {
    const value = event.target.value;
    setContent({ ...content, [name]: value });
  };

  const callApi = async () => {
    try {
      // console.log(userdata)
      console.log(user)
      const token = await getAccessTokenSilently();

      const response = await fetch(`${apiOrigin}/api/user?username=${user.nickname}&name=${user.name}&email=${user.email}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(responseData)
      const responseData = await response.json();
      console.log("Seconda time", responseData)
      setContent(responseData);
    } catch (error) {
      console.log("Error in the response", error);
    }
  };

  const UpdateDataApi = async () => {
    try {
      setLoader("Please Wait...!");
      const token = await getAccessTokenSilently();

      const response = await fetch(`${apiOrigin}/api/user/update`, {
        method: "POST",
        body: JSON.stringify(content),
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
      console.log("Data Successfully Updated..!", data)
      // setContent(responseData);
      setLoader("Data Successfully Updated..!")
    } catch (error) {
      console.log("Error in the response", error);
    }
  };
  useEffect(()=>{
    callApi(); 
  }, [])


    return (
      <div className="next-steps my-5">
        <Row className="d-flex justify-content-between">
            <label className="form-cotrol" htmlFor="issueCreate">Issue Greeting Message (MarkDown Supporte & use @author to mention the issue creator)</label>
            <textarea id="issueCreate" value={content.issueCreate} onChange={handleChange("issueCreate")} type="text" className="form-control" placeholder="Type Issue Greeting Message"/>
            <label className="form-cotrol" htmlFor="pull_requestCreate">Pull Request Greeting Message (MarkDown Supported & use @author to mention the pull request creator)</label>
            <textarea id="pull_requestCreate" value={content.pull_requestCreate} onChange={handleChange("pull_requestCreate")} type="text" className="form-control" placeholder="Type Pull Request Greeting Message"/>
            <label className="form-cotrol" htmlFor="pull_requestCloseMerged">Pull Request Closing Message When Merged (MarkDown Supported & use @author to mention the pull request creator)</label>
            <textarea id="pull_requestCloseMerged" value={content.pull_requestCloseMerged} onChange={handleChange("pull_requestCloseMerged")} type="text" className="form-control" placeholder="Type Pull Request Merge Greeting Message"/>
            <label className="form-cotrol" htmlFor="pull_requestClosedNotMerged">Pull Request Closing Message When UnMerged (MarkDown Supported & use @author to mention the pull request creator)</label>
            <textarea id="pull_requestClosedNotMerged" value={content.pull_requestClosedNotMerged} onChange={handleChange("pull_requestClosedNotMerged")} type="text" className="form-control" placeholder="Type Pull Request Close UnMerged Greeting Message"/>
            <label className="form-cotrol" htmlFor="pull_requestReopened">Pull Request Reopening Message (MarkDown Supported & use @author to mention the pull request creator)</label>
            <textarea id="pull_requestReopened" value={content.pull_requestReopened} onChange={handleChange("pull_requestReopened")} type="text" className="form-control" placeholder="Type Pull Request Reopen Greeting Message"/>
        </Row>
        <div className="mt-4">
          <button className="btn btn-outline-secondary" onClick={UpdateDataApi}>Update Messages</button>
          &nbsp;&nbsp;
          {loader}
        </div>
      </div>
    );
}

export default Content;
