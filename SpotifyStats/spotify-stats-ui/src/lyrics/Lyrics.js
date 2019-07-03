import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from './lyrics-reducers';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

class Lyrics extends Component {

  renderLyrics(artist, title) {
    this.props.requestLyrics(artist, title)
  }

  render() {
    let searchFields = <div>
      <div><input style={{ transform: "translate(-50%, 0%)", marginTop: "10px", marginBottom: "3px" }} className="form-control" type="text" id="title" placeholder="song name"></input></div>
      <div><input style={{ transform: "translate(-50%, 0%)", marginTop: "3px", marginBottom: "10px" }} className="form-control" type="text" id="artist" placeholder="artist name"></input></div>
      <button style={{ transform: "translate(-50%, 0%)" }} className="btn btn-primary" onClick={() => this.renderLyrics(document.getElementById("artist").value, document.getElementById("title").value)}>Request Lyrics</button>
    </div>

    let searchEnabled = this.props.searching ?
      <button style={{ transform: "translate(-50%, 0%)" }} className="btn btn-secondary" onClick={() => this.props.toggleSearch()}>Hide Search</button> :
      <button style={{ transform: "translate(-50%, 0%)" }} className="btn btn-primary" onClick={() => this.props.toggleSearch()}>Lyric Search</button>;
    let search = this.props.searching ? searchFields : false;
    let lyrics = this.props.lyrics;


    return (
      <div style={{ width: "25%" }}>
        <Modal show={this.props.modal} onHide={() => this.props.toggleModal()}>
          <Modal.Header closeButton>
            <Modal.Title>
              <h1>{this.props.title}</h1>
              <h4 style={{ color: "grey" }}>{this.props.artist}</h4></Modal.Title>
          </Modal.Header>
          <Modal.Body><h5 style={{
            textAlign: "center",
            whiteSpace: "pre-wrap"
          }}>{lyrics}</h5></Modal.Body>
          <Modal.Footer>
            <Button className="btn btn-primary" onClick={() => this.props.toggleModal()}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>



        <div style={{
          position: "relative",
          left: "50%",
        }}>
          {searchEnabled}
          {search}
        </div>
      </div>
    );
  }
}


export default connect(
  state => state.lyricsReducer,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(Lyrics);
