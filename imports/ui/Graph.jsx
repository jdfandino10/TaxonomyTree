import React, { Component } from 'react';

export default class Graph extends Component {


	render() {
		return (
			<div>
        		<svg width="960" height="500"></svg>
        		{console.log(this.props.nodes)}
        		{console.log(this.props.links)}
			</div>
		);
	}
}