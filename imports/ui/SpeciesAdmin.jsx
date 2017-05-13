import React, { Component } from 'react';

import Graph from './Graph.jsx';

const granularity = ['Life', 'Domain', 'Kingdom', 'Phylum', 'Class', 'Order', 'Family', 'Genus', 'Species'];

const mock = [{
  id: 'o1',
  name: 's1',
  lineage: [
    {
      rank: 'family',
      name: 'Thraupidae'
    },
    {
      rank: 'order',
      name: 'Passeriformes'
    },
    {
      rank: 'class',
      name: 'Aves'
    },
    {
      rank: 'phylum',
      name: 'Chordata'
    }
  ], 
},
{
  id: 'o2',
  name: 's2',
  lineage: [
    {
      rank: 'family',
      name: 'Thraupidae'
    },
    {
      rank: 'order',
      name: 'Passeriformes'
    },
    {
      rank: 'class',
      name: 'Aves'
    },
    {
      rank: 'phylum',
      name: 'Chordata'
    }
  ], 
}]

export default class SpeciesAdmin extends Component {

  constructor() {
    super();
    this.state = {
      species: '',
      nodes: [{id: 'Life', rank: 'Life'}],
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
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  handleSpecies = (e) => {
    this.setState({species: e.target.value});
  }

  createNodes = (name, lin) => {
    let doneLevel = [true, false, false, false, false, false, false, false, true];
    let newNodes = [{id: granularity[0], rank: granularity[0]}, {id: name, rank: granularity[granularity.length-1]}];
    let newLinks = [];
    
    lin.forEach( (elem) => {
      const r = this.capFirstLetter(elem.rank);
        const index = granularity.indexOf(r);
        if (!doneLevel[index]) {
          doneLevel[index] = true;
          newNodes.push({id: elem.name, rank: r});
        }
    }, this);
    newNodes.sort(function(a, b) {
      return granularity.indexOf(a.rank) - granularity.indexOf(b.rank);
    });
    for (let i = 0; i < newNodes.length - 1; i++) {
      let link = {source: newNodes[i].id, target: newNodes[i+1].id};
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
    // let  lin = undefined;
    // for (let i = 0; i < mock.length && lin === undefined; i++) {
    //   if (mock[i].id === id) lin = mock[i].lineage;
    // }
    // if (lin === 0) console.log("No se ha podido encontrar linaje");
    // else {
    //   this.createNodes(name, lin);
    // }
    let lineage = Meteor.call('api.getLineageFromId', id, (error, result) => {
    	if (error) {
    		console.log(error);
    	} else {
    		this.createNodes(name, result);
    	}
    });
  } 

  getId = (name) => {
    let ottId = Meteor.call('api.getSpeciesId', name, (error, result) => {
    	if (error) {
    		console.log(error);
    	} else {
    		console.log(result);
    		this.getLineage(name, result);
    	}
    });
  }

  updateTree = (e) => {
    e.preventDefault();
    const name = this.state.species;
    console.log(name);
    this.getId(name);
  }

  render() {
    return (
      <div>
        <form>
          <label htmlFor="species">Enter a species:</label>
          <input type="text" name="species" value={this.state.species} onChange={this.handleSpecies}/>
          <input type="submit" value="Submit" onClick={this.updateTree} />
        </form>
        <Graph nodes={this.state.nodes} links={this.state.links} />
      </div>
    );
  }

}
