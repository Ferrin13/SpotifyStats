import React from 'react';
import axios from "../services/axios-service"
import ReactTable from 'react-table'
import MeterBar from "../utilities/meter-bar-component"
import './user-tracks-component.css'
import UserSummaryComponent from '../user-summary/user-summary-component';
import LoadingSpinnerComponent from '../utilities/loading-spinner-component'
import {fetchTracksWithFeatures, fetchTracksSummary, toggleTracksSummary, sortTracksBy, setSortObjectList} from './user-tracks-actions'
import {connect} from 'react-redux'
var config = require('../config')

class UserTrackComponent extends React.Component {

  componentDidMount() {
    this.refreshTracks()
      .then(() => this.props.fetchTracksWithFeatures())
      .then(() => this.props.fetchTracksSummary());
  }

  refreshTracks = () => {
    return axios.get('/spotify/refresh-tracks')
  }

  doubleToPercent(input) {
    return Math.round(input * 100)
  }

  //Slightly gheto normalization
  loudnessToPercent(loudness) {
    const MIN_LOUDNESS = -30; //Docs say -60, but lowest example in my library is -23
    return Math.round((1 - (loudness/MIN_LOUDNESS))*100) 
  }

  //Also gheto normalization
  tempoToPercent(tempo) {
    const MAX_TEMPO = 200; //This is pretty much completely arbitrary 
    return Math.round((tempo/MAX_TEMPO) * 100);
  }

  getSortButtonClass(colName) {
    if(this.props.sortDescDictionary && this.props.sortDescDictionary[colName.toLowerCase()] !== undefined) {
      return this.props.sortDescDictionary[colName.toLowerCase()] ? 'btn-secondary' : 'btn-primary'
    }
    return('');
  }

  getListColumns = () => {
    return [
      {
        Header: '',
        Cell: (row) => {
          return row.original.image &&
            <div className='ablbum-img-container'>
              <img alt="" height={config.defaultTrackImgSize} src={row.original.image.url}/>
            </div>
        },
        id: 'trackImage',
        width: config.defaultTrackImgSize
      }, {
        Header: 'Title',
        accessor: 'title',
        width: 300
      }, {
        Header: 'Artist',
        accessor: 'artist',
        width: 300
      }, {
        Header: 'Release Date',
        accessor: 'releaseDate',
        width: 200
      }, {
        Header: 'Popularity',
        accessor: 'popularity',
        show: false
      }, {
        Header: 'Danceability',
        accessor: 'danceability',
        show: false
      }, {
        Header: 'Energy',
        accessor: 'energy',
        show: false
      }, {
        Header: 'Loudness',
        accessor: 'loudness',
        show: false
      }, {
        Header: 'Acousticness',
        accessor: 'acousticness',
        show: false
      }, {
        Header: 'Instrumentalness',
        accessor: 'instrumentalness',
        show: false
      }, {
        Header: 'Valence',
        accessor: 'valence',
        show: false
      }, {
        Header: 'Tempo',
        accessor: 'tempo',
        show: false
      }, {
        Header: '',
        Cell: (row) => 
          <div>
            <MeterBar percent={this.doubleToPercent(row.original.acousticness)} title="Acousticness"></MeterBar>
            <MeterBar percent={this.doubleToPercent(row.original.energy)} title="Energy"></MeterBar>
            <MeterBar percent={this.doubleToPercent(row.original.danceability)} title="Danceability"></MeterBar>
            <MeterBar percent={this.doubleToPercent(row.original.instrumentalness)} title="Instrumentalness"></MeterBar>
            <MeterBar percent={this.loudnessToPercent(row.original.loudness)} title="Loudness"></MeterBar>
            <MeterBar percent={row.original.popularity} title="Popularity"></MeterBar>
            <MeterBar percent={this.tempoToPercent(row.original.tempo)} title="Tempo"></MeterBar>
            <MeterBar percent={this.doubleToPercent(row.original.valence)} title="Valence (Positivity)"></MeterBar>
          </div>,
        minWidth: 400
      }
    ]; 
  }

  getListData = () => {
    return this.props.tracksWithFeatures.map(twf => ({
      artist: (twf.track.artistNames).join(', '),
      acousticness: twf.features.acousticness,
      danceability: twf.features.danceability,
      energy: twf.features.energy,
      image: twf.track.image,
      instrumentalness: twf.features.instrumentalness,
      loudness: twf.features.loudness,
      popularity: twf.track.popularity,
      releaseDate: twf.track.releaseDate,
      tempo: twf.features.tempo,
      title: twf.track.name,
      valence: twf.features.valence
    }));
  }

  render() {
    let listData = [];
    let listColumns = this.getListColumns();
    let tracksLoaded = this.props.tracksWithFeatures && this.props.tracksWithFeatures.length > 0
    if(tracksLoaded) {
      listData = this.getListData()
    }

    return(
      <div style={{display: "flex", justifyContent: "center" }}>
        <div style={{width: "100%", padding: "25px", maxWidth: "1500px"}}>
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <div>{this.props.tracksWithFeatures ? this.props.tracksWithFeatures.length: "No"} tracks loaded</div>
            <button disabled={!this.props.userTracksSummary} className="btn btn-primary" onClick={this.props.toggleTracksSummary}>{this.props.showSummary ? "Hide" : "Show"} Summary</button>
            {this.props.summaryLoading ?
              <LoadingSpinnerComponent size={100} style={{margin: "15px"}}></LoadingSpinnerComponent>
              : this.props.showSummary && this.props.userTracksSummary && 
                <UserSummaryComponent librarySummary={this.props.userTracksSummary}></UserSummaryComponent>}

            <span style={{paddingTop: "20px"}} >Sort By:</span>
            <div  style={{maxWidth: "900px"}}>
              <div className='row no-gutters'>
                  {
                    ['Acousticness', 'Danceability', 'Energy', 'Instrumentalness', 'Loudness', 'Popularity', 'Tempo', 'Valence'].map((colName, index) =>
                      <div key={index} className='col-lg-auto' style={{display: "flex", justifyContent: "center"}}> 
                        <button 
                          className={`btn ${this.getSortButtonClass(colName)}`} 
                          onClick={() => this.props.sortTracksBy(colName.toLowerCase())/*Infuriatingly, this prevents separating the table into a dumb component */}>
                            {colName}
                        </button>
                      </div>
                    )
                  }
              </div>
            </div>
          </div>
          <div className="list-container">
            {this.props.tracksLoading ?
              <LoadingSpinnerComponent size={200} style={{margin: "15px"}}></LoadingSpinnerComponent>
              : tracksLoaded && <ReactTable defaultSortMethod={this.sortMethod}
                  sorted={this.props.sortObjectList}
                  onSortedChange={sorted => this.props.setSortObjectList(sorted)}
                  data={listData}
                  columns={listColumns}>
                </ReactTable>
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return state.userTracksState
}

const mapDispatchToProps = {fetchTracksWithFeatures, fetchTracksSummary, toggleTracksSummary, sortTracksBy, setSortObjectList}

export default connect(mapStateToProps, mapDispatchToProps)(UserTrackComponent)