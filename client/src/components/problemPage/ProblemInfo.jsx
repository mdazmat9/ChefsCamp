import React, { Component } from "react";
import { Link } from "react-router-dom";
import MarkdownRender from "../../MarkdownRender.js";
import SuccessfulSubmissions from "./SuccessfulSubmissions";
import axios from "axios";
import Cookie from "js-cookie";
import "./styles/problemDescription.css";

class ProblemInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      loaded: false,
      data: null,
      message: "",
      path: `/contest/${this.props.match.params.contestCode}`
    };
    this.componentDidMount = this.componentDidMount.bind(this);
  }
  componentDidMount() {
    let userName = Cookie.get("userName");
    axios
      .get(
        `/contests/${this.props.match.params.contestCode}/problems/${this.props.match.params.problemCode}/${userName}`
      )
      .then(res => {
        if (res.data.result.data.content.body) {
          this.setState({ loaded: true, data: res.data });
        } else {
          this.setState({
            loaded: true,
            message: "Problems statement not currently available . . ."
          });
        }
      });
  }

  render() {
    if (this.state.loaded) {
      let data = this.state.data.result.data.content.body.split("<br />").join("\n");
      let renderProblemStatement = (
        <MarkdownRender source={data} />
      );
      return (
        <ul className="problemPage">
          <li style={{ textAlign: "left" }}>
            <strong>
              <Link
                to={this.state.path}
                style={{ color: "#1b1b1b", fontSize: "20px" }}
              >
                {" "}
                &lt;-Go Back
              </Link>
            </strong>
          </li>
          <li style={{ float: "left", width: "610px" }}>
            <div className="problemDescription">
              <h1>Problem Description</h1>
              <ul>
                <li style={{ float: "left" }}>
                  <h2>
                    {this.state.data.result.data.content.problemName} |{" "}
                    <small>
                      {this.state.data.result.data.content.problemCode}
                    </small>
                  </h2>
                </li>
                <li style={{ float: "right" }}>
                  <Link
                    to={{
                      pathname: `/ide`,
                      state: { from: this.props.location }
                    }}
                  >
                    <button>Submit</button>
                  </Link>
                </li>
              </ul>
              <div style={{ textAlign: "left" }}>{renderProblemStatement}</div>
            </div>
          </li>
          <li style={{ float: "right", width: "320px" }}>
            <SuccessfulSubmissions
              probStatus = {this.state.loaded}
              problemCode={this.props.match.params.problemCode}
            />
          </li>
        </ul>
      );
    } else {
      if (this.state.message === "") {
        return (
          <ul className="problemPage">
            <li style={{ textAlign: "left" }}>
              <strong>
                <Link
                  to={this.state.path}
                  style={{ color: "#1b1b1b", fontSize: "20px" }}
                >
                  {" "}
                  &lt;-Go Back
                </Link>
              </strong>
            </li>
            <li style={{ float: "left", width: "610px" }}>
              <div className="problemDescription">
                <h1>Problem Description</h1>
                <center>
                  <strong style={{ marginTop: "100px" }}>Loading . . .</strong>
                </center>
              </div>
            </li>
            <li style={{ float: "right", width: "320px" }}>
              <SuccessfulSubmissions
                probStatus = {this.state.loaded}
                problemCode={this.props.match.params.problemCode}
              />
            </li>
          </ul>
        );
      } else {
        return (
          <ul className="problemPage">
            <li style={{ textAlign: "left" }}>
              <strong>
                <Link
                  to={this.state.path}
                  style={{ color: "#1b1b1b", fontSize: "20px" }}
                >
                  {" "}
                  &lt;-Go Back
                </Link>
              </strong>
            </li>
            <li style={{ float: "left", width: "610px" }}>
              <div className="problemDescription">
                <h1>Problem Description</h1>
                <center>
                  <strong style={{ marginTop: "100px" }}>
                    Some thing went wrong . . . <Link to="/">Go back</Link>
                  </strong>
                </center>
              </div>
            </li>
            <li style={{ float: "right", width: "320px" }}>
              <SuccessfulSubmissions
                probStatus = {this.state.loaded} 
              />
            </li>
          </ul>
        );
      }
    }
  }
}

export default ProblemInfo;
