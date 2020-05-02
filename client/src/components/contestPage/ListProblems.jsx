import React, { Component } from "react";
import "./styles/listProblems.css";
import Cookie from "js-cookie";
import { Redirect } from "react-router-dom";
import axios from "axios";

class ListProblems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: "",
      contestCode: this.props.contestCode,
      redirect: false,
      loaded: false,
      is404: false,
      message: "",
    };
    this.renderTableData = this.renderTableData.bind(this);
    this.renderTableHeader = this.renderTableHeader.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }
  componentDidMount() {
    let userName = Cookie.get("userName");
    axios.get(`/contests/${this.props.contestCode}/${userName}`).then((res) => {
      this.props.handleLiftContestDetail(res.data);
      if (res.data.result.data.content.problemsList.length > 0) {
        this.setState({ loaded: true });
      } else {
        this.setState({
          loaded: true,
          message: "Problems not currently available . . .",
          is404: true,
        });
      }
    });
  }
  renderTableData() {
    return this.props.data.result.data.content.problemsList.map(
      (problem, index) => {
        return (
          <tr key={index} style={(index%2===0 ? this.props.theme == 0  ? {backgroundColor: "#36454f"} : {backgroundColor: '#f8f8f8'} : null)}>
            <td onClick={this.handleClick}>{problem.problemCode}</td>
            <td>{problem.successfulSubmissions}</td>
          </tr>
        );
      }
    );
  }
  handleClick(e) {
    this.setState({ selected: e.target.innerText, redirect: true });
  }
  renderTableHeader() {
    let header = ["problem code", "submissions"];
    return header.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>;
    });
  }

  render() {
    if (this.state.is404) {
      return (
        <div style={{ height: "150px", width: "620px", paddingTop: "150px" }}>
          <center>
            <strong>{this.state.message}</strong>
          </center>
        </div>
      );
    } else if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: `${this.props.contestCode}/problem/${this.state.selected}`,
          }}
        />
      );
    } else {
      if (!this.state.loaded) {
        return (
          <div style={{ height: "150px", width: "620px", paddingTop: "150px" }}>
            <strong>Loading . . .</strong>
          </div>
        );
      }
      return (
        <div>
          <div
            style={{
              padding: "10px",
              marginBottom: "-5px",
              paddingBottom: "2px",
              border: "none",
            }}
          >
            <img
              src={this.props.data.result.data.content.bannerFile}
              alt="banner"
              style={{width: "580px"}}
            />
          </div>
          <table id="students">
            <caption style={{ textAlign: "left" }}>Problems</caption>
            <tbody>
              <tr>{this.renderTableHeader()}</tr>
              {this.renderTableData()}
            </tbody>
          </table>
        </div>
      );
    }
  }
}

export default ListProblems;
