import React, { Component } from 'react';
import './styles/rankButton.css'
import { Redirect } from 'react-router-dom';

class RanklistButton extends Component {
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            redirect: false,
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e){
        this.setState({redirect: true});
    }

    render() {
        if(this.state.redirect){
            return(
                <Redirect to={{pathname:`/ranklist/${this.props.contestCode}`, state: {from: this.props.location}}} />
            );
        } else {
            return (
                <div className='rankButton'>
                    <b><u>Contest Ranks</u></b>
                    <button onClick={this.handleClick}>Go to Contest Ranks</button>
                </div>
            );
        }
    }
}

export default RanklistButton;