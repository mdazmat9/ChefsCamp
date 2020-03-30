import React, { Component } from "react";

class Welcome extends Component {
  render() {
    return (
      <div>
        <center>
          <h1>Welcome to <span style={{fontSize:'45px'}}>&lt; Chef&apos;sCamp<span role="img" aria-label="Close">✅</span> /&gt;</span></h1>
          <h3>
            Hit <i>login</i> to get started!
          </h3>
        </center>
      </div>
    );
  }
}

export default Welcome;
