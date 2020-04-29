import React, { Component } from "react";
import "./ranklist.css";
import Cookie from "js-cookie";
import axios from "axios";

class Ranklist extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
			data: null
		};
		this.componentDidMount = this.componentDidMount.bind(this);
		this.renderTableData = this.renderTableData.bind(this);
		this.renderTableHeader = this.renderTableHeader.bind(this);
	}
	componentDidMount() {
		let userName = Cookie.get("userName");
		axios
			.get(
				`/rankings/${this.props.match.params.contestCode}/${userName}`
			)
			.then(res => {
				this.setState({ loaded: true, data: res.data });
			});
	}
	renderTableData() {
		return this.state.data.result.data.content.map((user, index) => {
			return (
				<tr key={index}>
					<td>{user.rank}</td>
					<td>{user.username}</td>
					<td>{+parseFloat(user.totalScore).toFixed(3)}</td>
				</tr>
			);
		});
	}

	renderTableHeader() {
		let header = ["#", "user name", "total score"];
		return header.map((key, index) => {
			return <th key={index}>{key.toUpperCase()}</th>;
		});
	}

	render() {
		if (this.state.loaded) {
			return (
				<div style={{ border: "solid 5px" }}>
					<table id="ranklist">
						<caption style={{ textAlign: "left" }}>Ranklist</caption>
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
					style={{
						border: "solid black 5px",
						height: "350px",
						paddingTop: "350px",
						width: "963px",
						fontSize: "30px"
					}}
				>
					<strong>Loading . . .</strong>
				</div>
			);
		}
	}
}

export default Ranklist;
