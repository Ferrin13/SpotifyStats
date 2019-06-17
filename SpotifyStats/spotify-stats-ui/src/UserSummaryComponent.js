import React from 'react';
import './UserSummaryComponent.css'
import './UserTracksComponent.css'

class UserSummaryComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      librarySummary: props.librarySummary
    }
  }

  render() {
    return(
      //Inspired by https://bootsnipp.com/snippets/exy4M
      <div className="container justify-content-center">
        <div className="row justify-content-center">
          <div className="col-xl-6" style={{maxWidth: "500px"}}>
            <div className="tile">
              <div className="wrapper">
                <div className="header">Library Info</div>
                  <div className="dates">
                    <div className="">
                        <strong>Favorite Artist</strong>{this.state.librarySummary.libraryInfo.favoriteArtistName}
                        <span></span>
                    </div>
                    <div className="">
                        <strong>Songs Per Artist</strong>{this.state.librarySummary.libraryInfo.songsPerArtist.toFixed(2)}
                        <span></span>
                    </div>
                  </div>
                  <div className="dates">
                    <div className="">
                      <strong>Shortest Song</strong>{this.state.librarySummary.libraryInfo.shortestSongName}
                    </div>
                    <div className="">
                      <strong>Longest Song</strong>{this.state.librarySummary.libraryInfo.longestSongName}
                    </div>
                  </div>
              </div>
            </div>
          </div>
          <div className="col-xl-6" style={{maxWidth: "500px"}}>
            <div className="tile">
              <div className="wrapper">
                <div className="header">Song Averages</div>
                  <div className="stats">
                    <div>
                      <strong>Acousticness</strong>{this.state.librarySummary.trackAverages.acousticnessAverage.toFixed(2)}
                    </div>
                    <div>
                      <strong>Danceability</strong>{this.state.librarySummary.trackAverages.danceabilityAverage.toFixed(2)}
                    </div>
                    <div>
                      <strong>Energy</strong>{this.state.librarySummary.trackAverages.energyAverage.toFixed(2)}
                    </div>
                    <div>
                      <strong>Instrumentalness</strong>{this.state.librarySummary.trackAverages.instrumentalnessAverage.toFixed(2)}
                    </div>
                  </div>
                  <div className="stats">
                    <div>
                      <strong>Loudness</strong>{this.state.librarySummary.trackAverages.loudnessAverage.toFixed(2)}
                    </div>
                    <div>
                      <strong>Popularity</strong>{this.state.librarySummary.trackAverages.popularityAverage.toFixed(2)}
                    </div>
                    <div>
                      <strong>Tempo</strong>{this.state.librarySummary.trackAverages.tempoAverage.toFixed(2)}
                    </div>
                    <div>
                      <strong>Valence (Positivity)</strong>{this.state.librarySummary.trackAverages.valenceAverage.toFixed(2)} 
                      {/* <strong>Length</strong>{new Date(this.state.librarySummary.trackAverages.lengthMsAverage).toISOString().substr(15, 4) /*This is pretty hacky */}
                    </div>
                  </div>
                </div>
              </div> 
            </div>
          </div>
        </div>
    )
  }
}

export default UserSummaryComponent