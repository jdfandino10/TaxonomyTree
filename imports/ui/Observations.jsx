import React, { Component } from 'react';
import Observation from './Observation.jsx';
import Map from './Map.jsx';

export default class Observations extends Component {

	constructor(props){
		super(props);
		this.state = { index: 0 };
	}

	nextObservation = (e) => {
		e.preventDefault();
		let index = this.state.index;
		if (this.props.observations.length - 1 > index){
			index = index + 1;
		} else {
			index = 0;
		}
		this.setState({index: index});
	}

	prevObservation = (e) =>{
		e.preventDefault();
		let index = this.state.index;
		if (0 < index){
			index = index - 1;
		} else {
			index = this.props.observations.length - 1;
		}
		this.setState({index: index});
	}

	render() {

		if(this.props.observations.length > 0){
			console.log(this.props.observations[this.state.index]);
			return (
				<div className="col-xs-12">
					<h3>Observations:</h3>
					<Observation observation={this.props.observations[this.state.index]} />
					<button onClick={this.nextObservation} className="btn options float-right">Next Observation </button>
					<button onClick={this.prevObservation} className="btn options float-right">Previous Observation </button>
					<h3>Map:</h3>
					<Map observations={this.props.observations} />

				</div>
			);
		}else{
			return (
				<div>
					<h3>Observations:</h3>
					<p>There are no observations for this species.</p>
				</div>
			);
		}

	}
}
