import React, { Component } from "react";
import Login from "./components/Login.jsx";
import NavBar from "./components/NavBar.jsx";
import Search from "./components/seachComponent/Search.jsx";
import Ranklist from "./components/ranklist/Ranklist.jsx";
import ProblemInfo from "./components/problemPage/ProblemInfo.jsx";
import Ide from "./components/ide/Ide.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ContestPage from "./components/contestPage/ContestPage.jsx";
import axios from "axios";
import Cookie from "js-cookie";
import NotFound from "./components/NotFound.jsx";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      band: "",
      isLoggedIn: false,
      loading: false,
      contests: null
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleLiftContests = this.handleLiftContests.bind(this);
  }
  handleLiftContests(data) {
    let contest = data.result.data.content.contestList,
      contestsList = [];
    for (let i = 0; i < contest.length; ++i) {
      contestsList.push({
        detail: `${contest[i].name}(${contest[i].code})`,
        code: contest[i].code
      });
    }
    this.setState({ contests: contestsList });
  }
  handleLogin(userName, band) {
    this.setState({
      userName: userName,
      band: band,
      isLoggedIn: true,
      loading: false
    });
  }
  handleLogout() {
    this.setState({
      userName: "",
      band: "",
      isLoggedIn: false
    });
    Cookie.remove("userName");
    Cookie.remove("band");
  }
  componentDidMount() {
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);
    let code = params.get("code");
    if (Cookie.get("userName")) {
      this.setState({
        isLoggedIn: true,
        userName: Cookie.get("userName"),
        band: Cookie.get("band")
      });
    } else if (code) {
      this.setState({ loading: true });
      // console.log(code);
      axios
        .get(`http://localhost:80/auth/?code=${code}`)
        .then(res => {
          // console.log(res);
          Cookie.set("userName", res.data.result.data.content.username, {
            expires: 30
          });
          Cookie.set("band", res.data.result.data.content.band, {
            expires: 30
          });
          this.handleLogin(
            res.data.result.data.content.username,
            res.data.result.data.content.band
          );
        })
        .catch(err => {
          console.log("err", err);
        });
    }
  }

  render() {
    return (
      <center>
        <div style={{ width: "963px", maxWidth: "963px" }}>
          <Router>
            <NavBar
              handleLogout={this.handleLogout}
              userName={
                this.state.loading
                  ? ". . ."
                  : this.state.userName === ""
                  ? "User"
                  : this.state.userName
              }
              band={this.state.band === "" ? "N/A" : this.state.band}
            />
            <Switch>
              <Route
                exact
                path="/"
                render={props =>
                  this.state.isLoggedIn ? (
                    <Search
                      {...this.state}
                      contests={this.state.contests}
                      handleLiftContests={this.handleLiftContests}
                    />
                  ) : (
                    <Login />
                  )
                }
              />
              <ProtectedRoute
                exact
                userDetails={this.state}
                path="/contest/:contestCode"
                component={ContestPage}
              />
              <ProtectedRoute
                exact
                userDetails={this.state}
                path="/ranklist/:contestCode"
                component={Ranklist}
              />
              <ProtectedRoute
                exact
                userDetails={this.state}
                path="/contest/:contestCode/problem/:problemCode"
                component={ProblemInfo}
              />
              <ProtectedRoute
                exact
                userDetails={this.state}
                path="/ide"
                component={Ide}
              />
              <Route path="/" component={NotFound} />
            </Switch>
          </Router>
        </div>
      </center>
    );
  }
}

export default App;
