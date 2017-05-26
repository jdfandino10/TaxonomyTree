import React, { Component } from 'react';
import Observations from './Observations.jsx';
import Map from './Map.jsx';
import GenericMessage from './GenericMessage.jsx';

export default class SpeciesInfo extends Component {

	constructor(props){
		super(props);
		this.state = { component: 'general', 'dialog': { title:'', message: '' } };
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.species !== nextProps.species) this.setState({component: 'general'});	
	}

	deleteSpecies = () => {
		this.props.deleteSpecies(this.props.species.species);
		this.resetMessageDialog();
	}

	showDeleteSpecies = () => {
		let title = 'Delete node'
		let message = 'Are you sure you want to delete the ' + this.props.species.species + ' node? ' +
					  'This will also delete parent nodes that don\'t lead to other species.';
		this.setState({ dialog: { title, message } });
	}

	resetMessageDialog = () => {
		this.setState({ 'dialog': { title:'', message: '' } });
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
					<h2>{this.props.species.species} Information</h2>
					<button onClick={this.changeComponent} value="general" className={"btn options" + (this.state.component === "general" ? " selected" : "")}>General</button>
					<button onClick={this.changeComponent} value="observations" className={"btn options" + (this.state.component === "observations" ? " selected" : "")}>Observations</button>
					<button onClick={this.changeComponent} value="map" className={"btn options" + (this.state.component === "map" ? " selected" : "")}>Map</button>
					{this.state.component == 'general'?
										<div className="col-xs-12">
											<div className="col-xs-12 observation">
												<label>Species:</label> <i>{this.props.species.species} </i> <br/>
												<label>Identified Count:</label> {count? count : 'N/A'} <br/>
												<label>Conservation status:</label> {status? status : 'N/A'} <br/>

												<label>Image:</label> <div className="image"> {img? <img alt="" src={img} width="150" /> : 'No image available'} </div><br/>
											</div>
										</div> : this.state.component == 'observations'? <Observations observations={this.props.species.info.observations} /> :
										this.state.component == 'map'? <div className="col-xs-12">
																			<Map observations={this.props.species.info.observations} />
																		</div> : ''}
					
					<button onClick={this.showDeleteSpecies} className="btn options danger">Delete Species</button>
					{
						this.state.dialog.title !== ''
		            	? <GenericMessage title={ this.state.dialog.title } message={ this.state.dialog.message } remove={ this.deleteSpecies } cancel={ this.resetMessageDialog } showCancel={true}/>
		          		: ''
        			}
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
