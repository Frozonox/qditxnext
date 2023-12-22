import React from 'react'

function OpportunityCard(props) {
  return (

    <div>
        <span>${props.title}</span>
        <span>{props.company}</span>
        <span>{props.payment}</span>
        <span>{props.area}</span>
        <span>{props.status}</span>
    </div>

  )
}

export default OpportunityCard