import React from 'react'

function LoadingSpinnerComponent(props) {
  const DEFAULT_SIZE = 64;
  const DEFAULT_MARGIN = 10;
  let size = props.size ? props.size : DEFAULT_SIZE;
  let margin = props.margin ? props.margin : DEFAULT_MARGIN ;
  return(
    <div 
      className="spinner-border"
      role="status"
      style={{width: size + "px", height: size + "px", margin: margin + "px"}}
    >
      <span className="sr-only" style={{width: size + "px", height: size + "px"}}>Loading...</span>
    </div>
  )
}

export default LoadingSpinnerComponent