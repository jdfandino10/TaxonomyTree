import React, { Component } from 'react';


export default class Observation extends Component {

	render() {

		let date, notes, photo, copyright, place = '';
		if(this.props.observation){
			date = this.props.observation.observed_on_string;
			notes = this.props.observation.description;
			if(this.props.observation.photos.length > 0){
				photo = this.props.observation.photos[0].small_url;
				copyright = this.props.observation.photos[0].attribution;
			}
			place = this.props.observation.place_guess;
			return (
				<div className="col-xs-12 observation">
					<h4>Observation Information:</h4>
					<label>Date:</label> <b>{date ? date : 'N/A'} </b> <br/>
					<label>Description:</label> {notes ? notes : 'N/A'} <br/>
					<label>Place Guess:</label> {place? place : 'N/A'}<br/>
					<label>Image:</label>
					<div className="image">
				{photo? <img alt="" src={photo} width="150" /> : 'No image available'}  <br/>
					<label>{copyright ? copyright : ''}</label>
				</div>

				</div>
			);
		}else{
			return (
				<div>

				</div>
			);
		}

	}
}
