import React, { Component } from 'react';

import Graph from './Graph.jsx';
import GenericMessage from './GenericMessage.jsx';

const granularity = ['Life', 'Domain', 'Kingdom', 'Phylum', 'Class', 'Order', 'Family', 'Genus', 'Species'];

export default class SpeciesAdmin extends Component {

  constructor() {
    super();
    this.state = {
      dialog: {
        title: '',
        message: '',
      },
      species: '',
      nodes: [{ id: 'Life', rank: 'Life', group: 0 }],
      links: []
    }
  }

  arrayUnique = (array, equal) => {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(equal(a[i], a[j])){
              a.splice(j--, 1);
            }
        }
    }
    return a;
  }

  capFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  handleSpecies = (e) => {
    this.setState({species: e.target.value});
  }

  createNodes = (name, lin) => {
    let doneLevel = [true, false, false, false, false, false, false, false, true];
    let newNodes = [
      { id: granularity[0], rank: granularity[0], group: 0 },
      { id: name, rank: granularity[granularity.length-1], group: granularity.length-1}
    ];
    let newLinks = [];
    
    lin.forEach( (elem) => {
      const r = this.capFirstLetter(elem.rank);
      const index = granularity.indexOf(r);
      if (index >= 0 && !doneLevel[index]) {
        doneLevel[index] = true;
        newNodes.push({ id: elem.name, rank: r, group: index });
      }
    });

    newNodes.sort(function(a, b) {
      return a.group - b.group;
    });

    for (let i = 0; i < newNodes.length - 1; i++) {
      let link = { source: newNodes[i].id, target: newNodes[i+1].id, value: newNodes[i+1].group - newNodes[i].group };
      newLinks.push(link);
    }

    let nodes = this.state.nodes.concat(newNodes);
    nodes = this.arrayUnique(nodes, function(a, b) {
      return a.id === b.id;
    });

    let links = this.state.links.concat(newLinks);
    links = this.arrayUnique(links, function(a, b) {
      return a.source === b.source && a.target === b.target;
    });

    this.setState({nodes, links});
    console.log(nodes);
    console.log(links);
  }

  getLineage = (name, id) => {
    Meteor.call('api.getLineageFromId', id, (error, result) => {
      if (error) {
        this.setMessageDialog('Error', error.error);
      } else {
        this.createNodes(name, result);
      }
    });
  } 

  getId = (name) => {
    Meteor.call('api.getSpeciesId', name, (error, result) => {
      if (error) {
        this.setMessageDialog('Error', error.error);
      } else {
        let true_name = this.capFirstLetter(result.unique_name);
        if (this.speciesAlreadyExist(true_name)) {
          this.setMessageDialog('Error', 'The species '+name+' already exists in the tree ('+result.unique_name+').');
        } else {
          this.getLineage(true_name, result.id);
        }
      }
    });
  }

  speciesAlreadyExist = (name) => {
    const nodes = this.state.nodes;
    let found = false;
    for (let i = nodes.length - 1; i >= 0 && !found; i--) {
      found = nodes[i].id === name;
    }
    return found;
  }

  updateTree = (e) => {
    e.preventDefault();
    const name = this.capFirstLetter(this.state.species);
    this.getId(name);
  }

  resetMessageDialog = () => {
    this.setMessageDialog('','');
  }

  setMessageDialog = (title, message) => {
    this.setState({ dialog: { title, message } });
  }

  render() {
    return (
      <div>
        <form>
          <label htmlFor="species">Enter a species:</label>
          <input type="text" name="species" value={this.state.species} onChange={this.handleSpecies}/>
          <input type="submit" value="Search" onClick={this.updateTree} />
        </form>
        <Graph nodes={this.state.nodes} links={this.state.links} />
        { 
          this.state.dialog.title !== '' 
          ? <GenericMessage title={ this.state.dialog.title } message={ this.state.dialog.message } remove={ this.resetMessageDialog }/>
          : ''
        }
      </div>
    );
  }

}
