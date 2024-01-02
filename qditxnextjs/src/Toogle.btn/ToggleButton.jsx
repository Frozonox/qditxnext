import React from 'react'
import './ToggleButton.css'
function ToggleButton(props) {
  return (
    <div>									
      <label className="lbl-toggle">
      <input className="checkbox-btn" type="checkbox" checked={props.status}/>
      <span className='slider'></span>
      </label>
    </div>
  )
}

export default ToggleButton