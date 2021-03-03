import React from "react";
import bang from '../../img/bubble-chat.svg'
import css from './Bang.module.css'



const Bang = ({blockSize,bangCoords,stateUpdater})=>{

return (<>
<div className={css.gameOverWrapper}>
<div className={css.gameOverTitle}>Game Over
<div className={css.buttonWrapper}>
<button type='button' onClick={()=>stateUpdater('gameStart',false)} className={css.returnButton}>Return</button>
</div>
</div>
</div>
<img className={css.bang} style = {{
left: `${(bangCoords.x-1)*blockSize}px`,
top: `${(bangCoords.y-1)*blockSize}px`,
width:`${blockSize*3}px`,
height:`${blockSize*3}px`
}}  src={bang}/>
</>
)




}


export default Bang