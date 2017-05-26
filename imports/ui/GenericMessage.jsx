import React, { Component } from 'react';

export default class GenericMessage extends Component {

  componentDidMount() {
    this.ok_button.focus();
  }

  accept(e) {
    e.preventDefault();
    this.props.remove();
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

  render() {
    return (

      <div className="row fixed-container">
        <div className="message-float col-xs-12" onClick={this.props.showCancel ? this.cancel.bind(this) : this.accept.bind(this)}>
          <div ref={(t) => { this.title = t; }} role="dialog" className="message-container" onClick={this.stopEvent.bind(this)} onKeyDown={this.blockF.bind(this)}>
            <div className="row">
              <div className="col-xs-12">
                <h2 className="text-center game-over">{this.props.title}</h2>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 text-center">
                <p>{this.props.message}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 text-center">
                <button ref={(ob) => { this.ok_button = ob; }} className="btn options" onClick={this.accept.bind(this)}>Ok</button>
                {this.props.showCancel ? <button ref={(cb) => { this.cancel_button = cb; }} className="btn options" onClick={this.cancel.bind(this)}>Cancel</button> : ''}
              </div>
            </div>
            {this.props.extraContent ? this.props.extraContent : ''}
          </div>
        </div>
        <div className="modal-overlay" onClick={this.props.showCancel ? this.cancel.bind(this) : this.accept.bind(this)} />
      </div>

    );
  }
}