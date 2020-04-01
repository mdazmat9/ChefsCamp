import React, { Component } from "react";
import Cookie from "js-cookie";
import { Link } from "react-router-dom";

const ul = {
  overflow: "hidden",
  listStyleType: "none",
  padding: "10px"
};

const floatLeft = {
  float: "left"
};
const colors = {
  "N/A": "#fad75a",
  "1★": "#666666",
  "2★": "#1e7d22",
  "3★": "#3366cc",
  "4★": "#684273",
  "5★": "#ffbf00",
  "6★": "#ff7f00",
  "7★": "#d0011b"
};
const style = {
  backgroundColor: "#fad75a",
  borderRadius: "10px",
  border: "medium none",
  padding: "10px 12px",
  color: "black",
  fontSize: "14px",
  fontWeight: "bold",
  letterSpacing: "3px",
  transition: "background 350ms cubic-bezier(0, 0, 0.25, 1) 0s",
  cursor: "pointer",
  marginLeft: "10px"
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
      <nav style={{ border: "solid black 5px", marginBottom: "5px" }}>
        <ul style={ul}>
          <Link to="/">
            <li style={floatLeft}>
              <strong style={{ fontSize: "30px", color: "#1b1b1b" }}>
                &lt; Chef&apos;sCamp
                <span role="img" aria-label="Close">
                  ✅
                </span>{" "}
                /&gt;
              </strong>
            </li>
          </Link>
          {Cookie.get("userName") && (
            <li style={{ float: "right", fontSize: "25px" }}>
              <button onClick={this.handleLogout} style={style}>
                Logout
              </button>
            </li>
          )}
          <li style={{ float: "right", fontSize: "25px", marginTop: "5px" }}>
            Hello{" "}
            <span
              style={{
                fontSize: "20px",
                color: "white",
                padding: "1px 8px",
                backgroundColor: colors[this.props.band]
              }}
            >
              {this.props.band}
            </span>{" "}
            {this.props.userName} !
          </li>
          <li>
            <Link to="/" style={{ color: "#1b1b1b", fontSize: "30px" }}>
              Home
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
}

export default NavBar;
