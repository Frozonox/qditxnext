import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";

function LoadScreen() {
  return (
    <div style={{display: 'flex', direction: 'row', justifyContent: 'center', alignItems: 'center', marginTop: '120px' }}>
        <img className='img-fluid' src='./giphy.gif'></img>
    </div>
  )
}

export default LoadScreen