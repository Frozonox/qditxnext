import React, { useState } from 'react'
import Styles from './Card.module.css'
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa el CSS de Bootstrap


function OpportunityCard(props) {



  return (

    <div className={Styles.box}>

        <div className={Styles.title}><span>{props.title}</span></div>
        <div className={Styles.subtitle}><span>{props.subtitle}</span></div>

        <div style={{border: '4px solid', borderColor: props.color}}></div>

        <div >
            <div className={Styles.body}>
                
                <div  className={Styles.company}>
                <span>{props.company}</span>
                </div>
                <div className={Styles.infoxs}>
                <span>{props.payment}</span>

                <span>{props.area}</span>
                </div>
            </div>

            <hr style={{margin: '1px'}}></hr>

            <div className={Styles.footer}>

              <span>{props.id}</span>

               <div style={{backgroundColor: props.color, borderRadius: '30px', padding: '4px'}}>
                <span>{props.type}</span>
                </div>
                <div >
                <span>{props.status}</span>
                </div>

            </div>

        </div>

 
    </div>
 
  )
}

export default OpportunityCard