import React, { Component } from 'react';

import Graph from './Graph.jsx';
import GenericMessage from './GenericMessage.jsx';
import SaveLoadModal from './SaveLoadModal.jsx';
import SpeciesInfo from './SpeciesInfo.jsx';

const granularity = ['Life', 'Domain', 'Kingdom', 'Phylum', 'Class', 'Order', 'Family', 'Genus', 'Species'];

export default class SpeciesAdmin extends Component {

  constructor() {
    super();
    this.state = {
      dialog: {
        title: '',
        message: '',
      },
      saving: false,
      loading: false,
      species: '',
      graphId: '',
      name: '',
      nodes: [{ id: 'Life', rank: 'Life', group: 0 }],
      links: [],
      display: ''
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
      let idSourceA = a.source.id || a.source;
      let idSourceB = b.source.id || b.source;
      let idTargetA = a.target.id || a.target;
      let idTargetB = b.target.id || b.target;
      return (idSourceA === idSourceB && idTargetA === idTargetB);
    });

    this.setState({nodes, links});
    this.setState({ loadingNode: false });
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
    this.setState({ loadingNode: true });
    const name = this.capFirstLetter(this.state.species);
    this.getId(name);
  }

  resetMessageDialog = () => {
    this.setMessageDialog('','');
  }

  setMessageDialog = (title, message) => {
    this.setState({ dialog: { title, message }, loadingNode: false, loadingSpecies: false });
  }

  deleteSpecies = (speciesId) => {
    let target = [{ source: { id: speciesId } }];
    let idsToDelete = [];
    while (target[0] && this.state.links.filter((link) => { return link.source.id === target[0].source.id }).length <= 1
           && target[0].source.id !== 'Life') {
      idsToDelete.push(target[0].source.id);
      source = this.state.links.filter((link) => { return link.target.id === target[0].source.id });
      target = source;
    }
    this.deleteNodesById(idsToDelete);
    this.setState({display: ''});
  }

  deleteNodesById = (idArray) => {
    this.setState({
                    nodes: this.state.nodes.filter((node) => { return !idArray.includes(node.id) }),
                    links: this.state.links.filter((link) => { return !idArray.includes(link.target.id) })
                  });
  }

  setSpeciesToDisplay = (species) => {
    this.setState({ display: ''});
    this.setState({ loadingSpecies: true });
    let specieInfo = Meteor.call("api.getSpeciesInfo", species, (error, result) => {
      if (error) {
        this.setMessageDialog('Error', error.error);
      } else {
        this.setState({ display: { species: species, info: result } });
        this.setState({ loadingSpecies: false });
      }
    });
  }

  noUserMessage = () => {
    return (
      <div className="row no-user-info">
        <i>To save and load, please <a className="login-link" onClick={this.showLogin}>login or sign up</a>.</i>
      </div>
    );
  }

  showLogin = () => {
    document.getElementById('login-sign-in-link').click();
  }

  newGraph = () => {
    this.setMessageDialog('New graph', 'Are your sure you want to reset to a new graph? Any unsaved changes will be lost.');
  }

  deleteGraph = () => {
    this.setMessageDialog('Delete graph', 'Are your sure you want to delete the current graph: '+this.state.name+'? This can\'t be undone.');
  }

  saveAndLoadDiv = () => {
    return (
      <div className="row">
        <div className="col-xs-12">
          <button className="btn options" onClick={this.showSave}> Save </button>
          <button className="btn options" onClick={this.showLoad}> Load </button>
          <button className="btn options" onClick={this.newGraph}> New </button>
          <button className="btn options danger" onClick={this.deleteGraph} disabled={this.state.graphId === ''}> Delete </button>
        </div>
      </div>
    );
  }

  showSave = () => {
    this.setState({saving: true});
  }

  showLoad = () => {
    this.setState({loading: true});
  }

  hideSaveLoad = () => {
    this.setState({saving: false, loading: false});
  }

  getGraph = () => {
    let graph = { graphId: this.state.graphId, name: this.state.name, nodes: this.state.nodes, links: this.state.links };
    return graph;
  }

  handleSaveLoad = (save, params) => {
    /* do something */
    if (save === 's') {
      let name = params[0];
      let overwrite = params[1];
      let nodes = this.state.nodes;
      let links = this.state.links;
      let graphId = this.state.graphId;
      if (!overwrite) {
        Meteor.call('graphs.newGraph', name, nodes, links, (err, result) => {
          if (err) this.setMessageDialog('Error', err.message);
          else this.setState({ name: name, graphId: result, display: '' });
        });
      }
      else {
        Meteor.call('graphs.updateGraph', graphId, name, nodes, links, (err, result) => {
          if (err) this.setMessageDialog('Error', err.message);
          else this.setState({ name: name, graphId: graphId, display: '' });
        });
      }
    } else {
      let selected = params[0];
      let graphId = selected.id;
      let name = selected.name;
      Meteor.call('graphs.getGraph', graphId, (err, result) => {
          if (err) this.setMessageDialog('Error', err.message);
          else this.setState({ name: name, graphId: graphId, nodes: result.nodes, links: this.formatLinks(result.links), display: '' });
      });
    }
    this.hideSaveLoad();
  }

  formatLinks = (links) => {
    return links.map((link) => { return { source: link.source.id, target: link.target.id, value: link.value }; });
  }

  resetGraph = () => {
    if (this.state.dialog.title === 'Delete graph') {
      Meteor.call('graphs.deleteGraph', this.state.graphId, (err, result) => {
          if (err) this.setMessageDialog('Error', err.message);
          else this.setState({nodes: [{ id: 'Life', rank: 'Life', group: 0 }], links: [], name: '', graphId: '', display: ''});
      });
    } else {
      this.setState({nodes: [{ id: 'Life', rank: 'Life', group: 0 }], links: [], name: '', graphId: '', display: ''});
    }
    this.resetMessageDialog();
  }

  render() {
    return (
      <div>
        <div className="row main-content">
          <div className="col-sm-7 col-xs-12 graph-side">
            <div className="row graph-title">
              <h2>Graph: {this.state.graphId ? this.state.name : '-- (unsaved graph)'} </h2>
              <div className="row">
                {
                  this.props.currentUser ? this.saveAndLoadDiv() : this.noUserMessage()
                }
              </div>
            </div>
            <div className="row query">
              <div className="inline">
                <form>
                  <label htmlFor="species">Enter a species:</label>
                  <input type="text" name="species" value={this.state.species} onChange={this.handleSpecies}/>
                  <input type="submit" value="Search" className="btn options" onClick={this.updateTree} />
                </form>
              </div>
              { this.state.loadingNode ? <div className="loading-waiting" /> : ''}
            </div>

            <div className="col-xs-2" >
              <img src="./imgs/convenciones.png" className="conventions" />
            </div>
            <div className="col-xs-10" >
              <Graph nodes={this.state.nodes} links={this.state.links} speciesCallback={this.setSpeciesToDisplay} />
            </div>
          </div>
          <div className="row col-sm-5 col-xs-12">
            <div>
              <SpeciesInfo species={this.state.display} deleteSpecies={this.deleteSpecies} loading={this.state.loadingSpecies}/>
            </div>
          </div>
        </div>
        {
          this.state.dialog.title !== ''
          ? (this.state.dialog.title === 'New graph' || this.state.dialog.title === 'Delete graph'
            ? <GenericMessage title={ this.state.dialog.title } message={ this.state.dialog.message } remove={ this.resetGraph } cancel={ this.resetMessageDialog } showCancel={true}/>
            : <GenericMessage title={ this.state.dialog.title } message={ this.state.dialog.message } remove={ this.resetMessageDialog }/>)
          : ''
        }
        {
          this.state.saving || this.state.loading ?
          <SaveLoadModal save={this.state.saving}
          graph={this.getGraph()} myGraphs={this.props.graphs}
          cancel={this.hideSaveLoad} remove={this.handleSaveLoad}/> : ''
        }
      </div>
    );
  }

}
