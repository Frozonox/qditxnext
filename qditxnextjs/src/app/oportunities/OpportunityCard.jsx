import React from 'react'
import Styles from './Card.module.css'
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa el CSS de Bootstrap


function OpportunityCard(props) {
  return (

    <div className={Styles.box}>

        <div className={Styles.title}><span>{props.title}</span></div>
        <div className={Styles.subtitle}><span>{props.subtitle}</span></div>

        <div className={Styles.band}></div>

        <div >
            <div  className={Styles.body}>

                <span className={Styles.company} >{props.company}</span>
                <br></br>
                <span>{props.payment}</span>
                <br></br>
                <span>{props.area}</span>
                
            </div>

            <hr></hr>

            <div className={Styles.footer}>

                <span>{props.status}</span>
                    
                <span>{props.type}</span>

            </div>

        </div>

 
    </div>
 
  )
}

export default OpportunityCard