import React, { Component } from 'react';

import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import GenericMessage from './GenericMessage.jsx';

export default class LoginBar extends Component {

	constructor(props) {
		super(props);
		this.state = {
			dialog: {
	        	title: '',
	        	message: '',
	      	}
		}
	}

	showAbout = () => {
		let title = "About";
		let message = "On this webpage you can create any animal tree given the species." +
					"Also, you can visualize information about the species on your tree." +
					"Create a user to be able to save your creations!";
		let dialog = { title, message };
		this.setState({dialog});
	}

	resetMessageDialog = () => {
		this.setState({ dialog: { title: '', message: '' } });
	}

	render() {
		return (
			<nav>
	          <div className="row">
	            <div className="col-sm-6 col-xs-4 logo">
	                <div className="hidden-xs">
	                  <h1 id="logo-name" className="logo" >Taxonomy Tree</h1>
	                </div>
	                <div className="hidden-sm hidden-md hidden-lg hidden-xl">
	                  <h1 id="logo-name" className="logo" >TT</h1>
	                </div>
	            </div>
	            <div className="col-sm-3 col-xs-4">
	              <button className="btn options" onClick={this.showAbout}>About</button>
	            </div>
	            <div className="col-sm-3 col-xs-4">
	              <AccountsUIWrapper />
	            </div>
	          </div>
	          { 
	          	this.state.dialog.title !== '' 
	          	? <GenericMessage title={ this.state.dialog.title } message={ this.state.dialog.message } remove={ this.resetMessageDialog }/>
	          	: ''
	          }
	        </nav>
        );
	}

}