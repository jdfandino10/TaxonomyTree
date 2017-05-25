import React, { Component } from 'react';
import Observations from './Observations.jsx';
import Map from './Map.jsx';

export default class SpeciesInfo extends Component {

	constructor(props){
		super(props);
		this.state = { component: 'general'};
	}

	deleteSpecies = () => {
		this.props.deleteSpecies(this.props.species.species);
	}

	changeComponent = (component) => {
		console.log(component);
		this.setState({component: component.target.value});
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
					{this.state.component == 'general'?
										<div className="col-xs-12">
											<h3>General:</h3>
											<div className="col-xs-12 observation">
												<label>Species:</label> <i>{this.props.species.species} </i> <br/>
												<label>Identified Count:</label> {count? count : 'N/A'} <br/>
												<label>Conservation status:</label> {status? status : 'N/A'} <br/>

												<label>Image:</label> <div className="image"> {img? <img alt="" src={img} width="150" /> : 'No image available'} </div><br/>
											</div>
										</div> : this.state.component == 'observations'? <Observations observations={this.props.species.info.observations} /> :
										this.state.component == 'map'? <div className="col-xs-12">
																						<h3>Map:</h3>
																						<Map observations={this.props.species.info.observations} />
																					</div> : ''}
					<button onClick={this.changeComponent} value="general" className="btn options float-right">General</button>
					<button onClick={this.changeComponent} value="observations" className="btn options float-right">Observations</button>
					<button onClick={this.changeComponent} value="map" className="btn options float-right">Map</button>
					<button onClick={this.deleteSpecies} className="btn options float-right">Delete Species</button>

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
