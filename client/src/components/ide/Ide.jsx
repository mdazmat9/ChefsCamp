import React, { Component } from "react";
import "./ide.css";
var CodeMirror = require("react-codemirror");
require("codemirror/lib/codemirror.css");

class Ide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "/*Start Writing Your Code*/",
      output: "",
      value: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    alert("Dummy button!");
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    let options = {
      lineNumbers: true
    };
    return (
      <div className="ide">
        <div style={{ textAlign: "left", border: "solid 5px" }}>
          <CodeMirror
            style={{ height: "auto" }}
            value={this.state.code}
            onChange={code => this.setState({ code })}
            options={options}
          />
        </div>
        <ul>
          <li style={{ float: "left" }}>
            <textarea
              value={this.state.value}
              onChange={this.handleChange}
              placeholder="custom input goes here"
            ></textarea>
          </li>
          <li style={{ float: "right" }}>
            <textarea
              readOnly
              value={this.state.output}
              placeholder="Output will be here"
            ></textarea>
          </li>
        </ul>
        <button onClick={this.handleClick}>Run</button>
        <button onClick={this.handleClick}>Submit</button>
      </div>
    );
  }
}

export default Ide;
