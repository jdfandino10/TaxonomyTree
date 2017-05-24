import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Graphs } from '../api/graphs.js';

import SpeciesAdmin from './SpeciesAdmin.jsx';
import LoginBar from './LoginBar.jsx';

class App extends Component {
	render() {
		return (
			<div className="container">
				<LoginBar />
				<SpeciesAdmin graphs={this.props.graphs} currentUser={this.props.currentUser}/>
			</div>
		);
	}
}

export default createContainer(() => {
	Meteor.subscribe('graphs');
	return {
		graphs: Graphs.find({}, { sort: { dateCreated: -1 } }).fetch(),
		currentUser: Meteor.user()
	}
}, App);