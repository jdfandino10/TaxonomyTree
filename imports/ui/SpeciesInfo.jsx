import React, { Component } from 'react';


export default class SpeciesInfo extends Component {

	deleteSpecies = () => {
		this.props.deleteSpecies(this.props.species);
	}

	render() {
		return (
			<div>
				INFO ANIMAL: {this.props.species}
        		<button onClick={this.deleteSpecies} className="btn options">Test borrar </button>
			</div>
		);
	}
}