import React, { Component } from "react";
import "./styles/submissions.css";
import axios from "axios";
import Cookie from "js-cookie";

class SuccessfulSubmissions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      data: null,
      message: null,
      showMess: false,
    };
  }
  componentDidMount() {
    let userName = Cookie.get("userName");
    axios
      .get(
        `http://104.211.140.20:80/submissions/${this.props.problemCode}/${userName}`
      )
      .then(res => {
        if (res.data.result.data.message === "submissions fetched successfully") {
          this.setState({ loaded: true, data: res.data });
        } else {
          this.setState({
            loaded: true,
            showMess: true,
            message: res.data.result.data.message
          });
        }
      });
  }

  renderTableData() {
    if (this.state.showMess === false) {
      return this.state.data.result.data.content.map((problem, index) => {
        return (
          <tr key={index}>
            <td>{problem.username}</td>
            <td>{parseFloat(problem.time).toFixed(2)}</td>
            <td>{Math.round((problem.memory / 1024) * 10) / 10}</td>
            <td>{problem.language}</td>
          </tr>
        );
      });
    } else {
      return <strong>{this.state.message}</strong>;
    }
  }

  renderTableHeader() {
    let header = ["user", "time", "mem", "lang"];
    return header.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>;
    });
  }

  render() {
    if (this.state.loaded) {
      return (
        <div style={{ border: "solid black 3px" }}>
          <table id="submissions">
            <caption style={{ textAlign: "left", fontSize: "15px" }}>
              <b>Successful Submissions</b>
            </caption>
            <tbody>
              <tr>{this.renderTableHeader()}</tr>
              {this.renderTableData()}
            </tbody>
          </table>
        </div>
      );
    } else {
      return (
        <div
          style={{ border: "solid black 3px", width: "320px", height: "211px" }}
        >
          <table id="submissions">
            <caption style={{ textAlign: "left", fontSize: "15px" }}>
              <b>Successful Submissions</b>
            </caption>
            <strong style={{ marginTop: "211px" }}>Loading . . .</strong>
          </table>
        </div>
      );
    }
  }
}

export default SuccessfulSubmissions;
