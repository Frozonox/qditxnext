import React, { useState } from 'react'
import './ToggleButton.css'
function ToggleButton(props) {

  const [isChecked, setCheck] = useState(props.status);
 const handleChange = ()=>
 {
  setCheck(!isChecked);
 }

  return (
    <div>									
      <label className="lbl-toggle">
      <input className="checkbox-btn" type="checkbox" onChange={handleChange} checked={isChecked}/>
      <span className='slider'></span>
      </label>
    </div>
  )
}

export default ToggleButton