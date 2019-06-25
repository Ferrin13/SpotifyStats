import React from 'react';
import './meter-bar-component.css'

class MeterBarComponent extends React.Component {
  render() {
    return(
      <div style={{display: "flex"}}>
        <div className="progress-title">{this.props.title}</div>
        <div style={{width: "100%", display: "flex", flexDirection: "column", justifyContent: "center"}}>
          <div style={{display: "block"}}>
            <div className="progress">
              <div className={"progress-bar"} role="progressbar" style={{width: this.props.percent + "%"}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MeterBarComponent