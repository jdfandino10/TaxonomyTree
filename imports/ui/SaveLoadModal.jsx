import React, { Component } from 'react';

export default class SaveLoadModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: this.props.save ? 'Save' : 'Load',
      name: '',
      overwrite: false,
      selected: {
        id: '',
        name: ''
      }
    }
  }

  setSelected = (g) => {
    selected = {
      id: g._id,
      name: g.name
    }
    this.setState({selected});
  }

  componentDidMount() {
    this.ok_button.focus();
    
  }

  accept(e) {
    e.preventDefault();
    if (this.props.save) {
      this.props.remove('s', [this.state.name, this.state.overwrite]);
    } else {
      this.props.remove('l', [this.state.selected]);
    }
  }

  cancel(e) {
    e.preventDefault();
    this.props.cancel();
  }

  blockF(e) {
    let okButton = null;
    okButton = this.ok_button;
    let cancelButton = null;
    cancelButton = this.cancel_button;
    let firstTabStop = null;
    firstTabStop = okButton;
    let lastTabStop = null;
    lastTabStop = cancelButton || okButton;
    if (e.keyCode === 9) {
      if (e.shiftKey) {
        if (document.activeElement === firstTabStop) {
          e.preventDefault();
          lastTabStop.focus();
        }
      } else if (document.activeElement === lastTabStop) {
        e.preventDefault();
        firstTabStop.focus();
      }
    }
    if (e.keyCode === 27) {
      cancelButton.click();
    }
  }

  stopEvent(e) {
    let ev = e || window.event;
    ev.cancelBubble = true;
    if (ev.stopPropagation) ev.stopPropagation();
  }

  componentDidMount() {
    if (this.props.myGraphs.length > 0) this.setSelected(this.props.myGraphs[0]);
  }

  generateLoad = () => {
    console.log(this.props.myGraphs);
    return (
      <div className="overflow-load">{this.props.myGraphs.length > 0 ? this.props.myGraphs.map((g) => {
        console.log(g);
        let date = g.dateCreated;
        let dateStr = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
        dateStr += ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        return (
          <div key={g._id} className={'load-item ' + (this.state.selected.id === g._id ? 'selected':'')}
               onClick={() => {this.setSelected(g)}}>
            <h4>{g.name}</h4>
            <label>Date created: </label><p>{dateStr}</p>
          </div>
        );
      })
      : 'You have no graphs to load.'}
      </div>);
  }

  handleName = (e) => {
    this.setState({name: e.target.value});
  }

  handleOverwrite = (e) => {
    this.setState({overwrite: !this.state.overwrite, name: !this.state.overwrite ? this.props.graph.name : '' });
  }

  generateSave = () => {
    return (
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" name="name" value={this.state.name} onChange={this.handleName}/>
        {
          this.props.graph.graphId!==''
          ? <div><label htmlFor="name">Overwrite:</label>
            <input type="checkbox" name="vehicle" value="Car" checked={this.state.overwrite} onClick={this.handleOverwrite} />
            </div>
          : ''
        }
      </div>
    );
  }

  render() {
    return (

      <div className="row fixed-container">
        <div className="message-float col-xs-12" onClick={this.cancel.bind(this)}>
          <div ref={(t) => { this.title = t; }} role="dialog" className="message-container" onClick={this.stopEvent.bind(this)} onKeyDown={this.blockF.bind(this)}>
            <div className="row">
              <div className="col-xs-12">
                <h2 className="text-center game-over">{this.state.title}</h2>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 text-center">
                {this.props.save ? this.generateSave() : this.generateLoad()}
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 text-center">
                <button ref={(ob) => { this.ok_button = ob; }} className="btn options" onClick={this.accept.bind(this)}>Ok</button>
                <button ref={(cb) => { this.cancel_button = cb; }} className="btn options" onClick={this.cancel.bind(this)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-overlay" onClick={this.cancel.bind(this)} />
      </div>

    );
  }
}