import React, { Component } from 'react';

import d3graph from './d3graph.js';

export default class Graph extends Component {

  componentDidMount() {
  	let el = this.graphComponent;
  	// let graph = this.copyPropsGraph();
    let graph = { nodes: this.props.nodes, links: this.props.links };
    this.graph = new d3graph(el, graph);
  }

  componentDidUpdate(prevProps, prevState) {
  	// let graph = this.copyPropsGraph();
    let graph = { nodes: this.props.nodes, links: this.props.links };
  	this.graph.updateSimulation(graph);
  }

  shouldComponentUpdate(prevProps, nextState) {
  	return !(this.props.nodes === prevProps.nodes && this.props.links === prevProps.links);
  }

  componentWillUnmount() {
  	// d3graph.destroy();
  }

  render() {
    return (
      <div ref={(g) => { this.graphComponent = g; }} className="graph"></div>
    );
  }
}