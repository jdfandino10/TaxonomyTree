import React, { Component } from 'react';


export default class Map extends Component {

	render() {
		if(this.props.observations){

			return (
				<div className="col-xs-12 observation">
					<h4>Observations Map:</h4>
					MAP
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
