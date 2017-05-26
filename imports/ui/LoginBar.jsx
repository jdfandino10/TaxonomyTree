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
		let message = "On this webpage you can create any Taxonomy tree given the species. " +
					"Also, you can visualize information and observations* about the selected species. " +
					"Create a user to be able to save and load your creations!";
		let dialog = { title, message };
		let extraContent = (<div>*Infromation taken from <a href="https://www.inaturalist.org/" target="_blank">iNaturalist</a>.</div>);
		this.setState({dialog, extraContent});
	}

	resetMessageDialog = () => {
		this.setState({ dialog: { title: '', message: '' }, extraContent: undefined });
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
	                  <h1 id="logo-name" className="logo" >TaxTree</h1>
	                </div>
	            </div>
	            <div className="col-sm-5 col-xs-8 float-right">
	              <AccountsUIWrapper />
	              <button className="btn options about float-right" onClick={this.showAbout}>About</button>
	            </div>
	          </div>
	          { 
	          	this.state.dialog.title !== '' 
	          	? <GenericMessage title={ this.state.dialog.title } message={ this.state.dialog.message } 
	          					  remove={ this.resetMessageDialog } extraContent={ this.state.extraContent }/>
	          	: ''
	          }
	        </nav>
        );
	}

}