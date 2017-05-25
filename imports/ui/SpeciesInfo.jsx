import React, { Component } from 'react';


export default class SpeciesInfo extends Component {

	deleteSpecies = () => {
		this.props.deleteSpecies(this.props.species.species);
	}

	render() {
		console.log(this.props.species);
		let img = "";
		let count = "";
		if(this.props.species){
			img = this.props.species.info.taxa_stats.species_counts[0].taxon.image_url.replace(/75px/g, '150px');
			count = this.props.species.info.taxa_stats.species_counts[0].count;
			return (
				<div className="col-xs-12">
					<h2>Species Information</h2>
					<label>Species:</label> {this.props.species.species} <br/>
					<label>Identified Count:</label> {count? count : 'N/A'} <br/>
					<label>Image:</label> {img? <img alt="" src={img} width="200" /> : 'No image available'}<br/>
	      	<button onClick={this.deleteSpecies} className="btn options float-center">Delete Species from graph </button>
				</div>
			);
		}else{
			return (
				<div>
					<h2>Species Information</h2>
					<p>Select a specie in the graph in order to see information about it</p>
				</div>
			);
		}

	}
}
