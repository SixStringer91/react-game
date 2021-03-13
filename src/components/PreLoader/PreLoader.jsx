import React from "react";
import loader from '../../img/preloader.svg'
import css from './PreLoader.module.css'


const PreLoader = () => {
  return (<div className={css.preloaderWrapper}>
    <img src={loader} alt="" />
  </div>)
}


export default PreLoader