import React, { Component } from "react";
import Cookie from "js-cookie";
import { Link } from "react-router-dom";
import logo from "./logos/logo2.png";

const ul = {
  overflow: "hidden",
  listStyleType: "none",
  padding: "10px",
  lineHeight: "40px",
};

const floatLeft = {
  float: "left",
};
const colors = {
  "N/A": "#fad75a",
  "1★": "#666666",
  "2★": "#1e7d22",
  "3★": "#3366cc",
  "4★": "#684273",
  "5★": "#ffbf00",
  "6★": "#ff7f00",
  "7★": "#d0011b",
};
const style = {
  backgroundColor: "#fad75a",
  borderRadius: "10px",
  border: "medium none",
  padding: "10px 12px",
  // fontSize: "14px",
  fontWeight: "bold",
  letterSpacing: "3px",
  transition: "background 350ms cubic-bezier(0, 0, 0.25, 1) 0s",
  cursor: "pointer",
  marginLeft: "10px",
};
class NavBar extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    this.props.handleLogout();
  }

  render() {
    return (
      <nav style={{ border: "solid #b9b9b9 3px", marginBottom: "5px" }}>
        <ul style={ul}>
          <li style={floatLeft}>
            <Link to="/">
              <strong style={{ fontSize: "30px", color: this.props.color }}>
                &lt; Chef&apos;sCamp
                <img src={logo} alt="logo" /> /&gt;
              </strong>
            </Link>
          </li>
          <li
            style={{ float: "right", cursor: "pointer", marginLeft: "15px" }}
            onClick={this.props.handleToggle}
          >
            <svg
              height="40px"
              viewBox="0 0 512 512"
              color="white"
              width="40px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill={this.props.color}>
                <path d="m57.8125 337.492188v57.175781c0 32.425781 26.453125 58.878906 58.878906 58.878906h57.175782l40.53125 40.53125c11.09375 11.09375 26.027343 17.28125 41.601562 17.28125s30.507812-6.1875 41.601562-17.28125l40.53125-40.53125h57.175782c32.425781 0 58.878906-26.453125 58.878906-58.878906v-57.175781l40.53125-40.53125c11.09375-11.09375 17.28125-26.027344 17.28125-41.601563s-6.1875-30.507813-17.28125-41.597656l-40.53125-40.535157v-57.171874c0-32.429688-26.453125-58.882813-58.878906-58.882813h-57.175782l-40.53125-40.53125c-22.1875-22.1875-61.015624-22.1875-83.203124 0l-40.53125 40.53125h-57.175782c-32.425781 0-58.878906 26.453125-58.878906 58.882813v57.171874l-40.53125 40.535157c-11.09375 11.089843-17.28125 26.023437-17.28125 41.597656s6.1875 30.507813 17.28125 41.601563zm198.1875-210.132813c17.066406 0 33.492188 3.199219 48.640625 9.175781 6.1875 2.558594 10.027344 8.53125 10.027344 14.929688 0 6.613281-4.054688 12.589844-10.242188 14.933594-33.707031 13.226562-69.757812 43.523437-69.757812 88.960937 0 45.441406 36.050781 75.734375 69.757812 88.960937 6.1875 2.347657 10.242188 8.320313 10.242188 14.933594 0 6.398438-3.839844 12.371094-10.027344 14.933594-15.148437 5.972656-31.574219 9.171875-48.640625 9.171875-74.238281 0-128-53.757813-128-128 0-74.238281 53.761719-128 128-128zm0 0" />
              </g>
            </svg>
            <sub style={{ fontSize: "20px" }}>
              <b>β</b>
            </sub>
          </li>
          {Cookie.get("userName") && (
            <li style={{ float: "right", fontSize: "25px" }}>
              <button onClick={this.handleLogout} style={style}>
                Logout
              </button>
            </li>
          )}
          <li style={{ float: "right", fontSize: "25px" }}>
            Hi{" "}
            <span
              style={{
                fontSize: "15px",
                verticalAlign: "middle",
                color: "white",
                padding: "1px 8px",
                backgroundColor: colors[this.props.band],
              }}
            >
              {this.props.band}
            </span>{" "}
            {this.props.userName} !
          </li>
          <li style={{ display: "inline" }}>
            <Link to="/" style={{ color: this.props.color, fontSize: "20px" }}>
              Home
            </Link>
          </li>
          <li style={{ display: "inline", marginLeft: "10px" }}>
            <Link
              to="/ide"
              style={{ color: this.props.color, fontSize: "20px" }}
            >
              IDE
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
}

export default NavBar;
