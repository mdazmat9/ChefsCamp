import React, { Component } from "react";
import "./style.css";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Cookie from "js-cookie";

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      selected: "",
      indexSelected: 0,
      suggestions: [],
      redirect: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  componentDidMount() {
    let userName = Cookie.get("userName");
    console.log(this.props.contests && 1);
    if (!this.props.contests && userName) {
      axios.get(`/contests/${userName}`).then(res => {
        this.props.handleLiftContests(res.data);
      });
    }
  }

  handleChange(event) {
    if (event.keyCode !== 13) {
      this.setState({ value: event.target.value, indexSelected: 0 });
      if (this.props.contests) {
        this.populateSuggestions(event.target.value);
      }
    }
  }

  handleClick(event) {
    this.setState({
      suggestions: [],
      value: event.target.innerText,
      selected: event.target.getAttribute("data-code"),
      indexSelected: 0,
      redirect: true
    });
  }

  handleKeyDown(event) {
    //User pressed Enter
    if (event.keyCode === 13) {
      if (this.state.suggestions.length === 0) {
        alert("Enter valid input!");
      } else {
        this.setState({
          selected: this.state.suggestions[this.state.indexSelected].code,
          value: this.state.suggestions[this.state.indexSelected].code,
          suggestions: [],
          indexSelected: 0,
          redirect: true
        });
      }
    }

    // User pressed the up arrow, decrement the index
    else if (event.keyCode === 38) {
      if (this.state.indexSelected === 0) {
        return;
      }

      this.setState({ indexSelected: this.state.indexSelected - 1 });
    }
    // User pressed the down arrow, increment the index
    else if (event.keyCode === 40) {
      if (this.state.indexSelected - 1 === this.state.suggestions.length) {
        return;
      }

      this.setState({ indexSelected: this.state.indexSelected + 1 });
    }
  }

  populateSuggestions(val) {
    if (val.length === 0) {
      this.setState({ suggestions: [] });
    } else {
      let suggests = [],
        curVal = val;
      let { contests } = this.props;
      for (let i = 0; i < contests.length; ++i) {
        if (suggests.length === 10) {
          //allows on 10 items at a time
          break;
        }
        let element = contests[i].detail.toLowerCase();
        let reg = new RegExp(curVal.toLowerCase(), "g");
        var res = element.match(reg);
        if (res) {
          suggests.push(contests[i]);
        }
      }
      this.setState({ suggestions: suggests });
    }
  }

  render() {
    const textBox = {
      height: "30px",
      width: "500px",
      border: "solid #b9b9b9 2px"
    };
    const searchList = {
      width: "calc(508px)"
    };

    let renderList;
    if (this.props.contests) {
      if (this.state.suggestions.length > 0) {
        renderList = (
          <ul style={searchList} className="suggestions">
            {this.state.suggestions.map((suggestion, index) => {
              let className;
              if (index === this.state.indexSelected) {
                className = "suggestion-active";
              }
              return (
                <li
                  key={suggestion.code}
                  className={className}
                  data-code={suggestion.code}
                  onClick={this.handleClick}
                >
                  {suggestion.detail}
                </li>
              );
            })}{" "}
          </ul>
        );
      } else {
        renderList = null;
      }
    } else {
      renderList = (
        <ul style={searchList} className="suggestions">
          <li>
            <strong>Loading . . .</strong>
          </li>
        </ul>
      );
    }
    if (this.state.redirect) {
      return <Redirect to={`/contest/${this.state.selected}`} />;
    } else {
      return (
        <div
          style={{
            border: "solid #b9b9b9 3px",
            height: "600px",
            paddingTop: "150px"
          }}
        >
          <input
            type="text"
            style={textBox}
            onKeyDown={this.handleKeyDown}
            onChange={this.handleChange}
            value={this.state.value}
            placeholder="e.g. JAN17, january long"
          />
          {renderList}
        </div>
      );
    }
  }
}

export default Search;
