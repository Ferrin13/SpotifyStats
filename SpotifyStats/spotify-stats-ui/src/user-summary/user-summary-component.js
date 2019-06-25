import React from 'react';
import './user-summary-component.css'
import '../user-tracks/user-tracks-component.css'

function UserSummaryComponent(props) {
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
                      <strong>Favorite Artist</strong>{props.librarySummary.libraryInfo.favoriteArtistName}
                      <span></span>
                  </div>
                  <div className="">
                      <strong>Songs Per Artist</strong>{props.librarySummary.libraryInfo.songsPerArtist.toFixed(2)}
                      <span></span>
                  </div>
                </div>
                <div className="dates">
                  <div className="">
                    <strong>Shortest Song</strong>{props.librarySummary.libraryInfo.shortestSongName}
                  </div>
                  <div className="">
                    <strong>Longest Song</strong>{props.librarySummary.libraryInfo.longestSongName}
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
                    <strong>Acousticness</strong>{props.librarySummary.trackAverages.acousticnessAverage.toFixed(2)}
                  </div>
                  <div>
                    <strong>Danceability</strong>{props.librarySummary.trackAverages.danceabilityAverage.toFixed(2)}
                  </div>
                  <div>
                    <strong>Energy</strong>{props.librarySummary.trackAverages.energyAverage.toFixed(2)}
                  </div>
                  <div>
                    <strong>Instrumentalness</strong>{props.librarySummary.trackAverages.instrumentalnessAverage.toFixed(2)}
                  </div>
                </div>
                <div className="stats">
                  <div>
                    <strong>Loudness</strong>{props.librarySummary.trackAverages.loudnessAverage.toFixed(2)}
                  </div>
                  <div>
                    <strong>Popularity</strong>{props.librarySummary.trackAverages.popularityAverage.toFixed(2)}
                  </div>
                  <div>
                    <strong>Tempo</strong>{props.librarySummary.trackAverages.tempoAverage.toFixed(2)}
                  </div>
                  <div>
                    <strong>Valence (Positivity)</strong>{props.librarySummary.trackAverages.valenceAverage.toFixed(2)} 
                  </div>
                </div>
              </div>
            </div> 
          </div>
        </div>
      </div>
  )
}

export default UserSummaryComponent