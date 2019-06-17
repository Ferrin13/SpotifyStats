import React from 'react'

class LoadingSpinnerComponent extends React.Component {
  constructor(props) {
    super(props)
    const DEFAULT_SIZE = 64;
    const DEFAULT_MARGIN = 10;
    this.state = {
      size: props.size ? props.size : DEFAULT_SIZE,
      margin: props.margin ? props.margin : DEFAULT_MARGIN 
    }
  }

  render() {
    return(
      <div 
        className="spinner-border"
        role="status"
        style={{width: this.state.size + "px", height: this.state.size + "px", margin: this.state.margin + "px"}}
      >
        <span className="sr-only" style={{width: this.state.size + "px", height: this.state.size + "px"}}>Loading...</span>
      </div>
    )
  }
}

export default LoadingSpinnerComponent