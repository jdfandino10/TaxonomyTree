import React, { Component } from 'react';
import Observations from './Observations.jsx';

export default class SpeciesInfo extends Component {

	deleteSpecies = () => {
		this.props.deleteSpecies(this.props.species.species);
	}

	render() {
		let img, status, count;
		if(this.props.species){
			if(this.props.species.info.taxa_stats.species_counts[0].taxon.image_url){
				if (this.props.species.info.taxa_stats.species_counts[0].taxon.image_url.includes("wikipedia"))
					img = this.props.species.info.taxa_stats.species_counts[0].taxon.image_url.replace(/75px/g, '150px');
				else
					img = this.props.species.info.taxa_stats.species_counts[0].taxon.image_url;
			}
			if(this.props.species.info.taxa_stats.species_counts[0].taxon.conservation_status_name)
				status = this.props.species.info.taxa_stats.species_counts[0].taxon.conservation_status_name.replace(/_/g,' ');
			count = this.props.species.info.taxa_stats.species_counts[0].count;
			return (
				<div className="col-xs-12">
					<h2>Species Information</h2>
					<div className="col-xs-12">
						<h3>General:</h3>
						<div className="col-xs-12 observation">
							<label>Species:</label> <i>{this.props.species.species} </i> <br/>
							<label>Identified Count:</label> {count? count : 'N/A'} <br/>
							<label>Conservation status:</label> {status? status : 'N/A'} <br/>

							<label>Image:</label> <div className="image"> {img? <img alt="" src={img} width="150" /> : 'No image available'} </div><br/>
						</div>
					</div>

					<button onClick={this.deleteSpecies} className="btn options float-right">Delete Species from graph </button>
					<Observations observations={this.props.species.info.observations} />

				</div>
			);
		}else{
			return (
				<div>
					<h2>Species Information</h2>
					{this.props.loading ? <div className="loading-waiting" /> : <p>Click a species node in the graph in order to see information about it</p>}
				</div>
			);
		}

	}
}
