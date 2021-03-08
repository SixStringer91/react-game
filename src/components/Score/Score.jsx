import React from "react";
import css from './Score.module.css'

const Score = ({playerScore,yourBestScore,bestOfAll})=>{
  return (
<div className={css.playerScore}>
<div className={css.scoreElement}>
<div>Score</div>
<div className={css.tabloid}>{playerScore}</div>
</div>
<div className={css.scoreElement}>
<div>Your Best Score</div>
<div className={css.tabloid}>{yourBestScore}</div>
</div>
{
bestOfAll
?
  <div className={css.scoreElement}>
<div>Best of All</div>
<div className={css.tabloid}>{bestOfAll}</div>
</div>
:
<></>
}

</div>
  )
}


export default Score