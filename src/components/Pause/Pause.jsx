import React from "react";
import css from './Pause.module.css'

const Pause = ({playerScore,yourBestScore})=>{
  return (
    
<div className={css.pause}>
Press <span>R</span> to return or <span>Space</span> to continue
</div>
  )
}


export default Pause