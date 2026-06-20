import { useState } from "react";

import classes from "./ExpPicker.module.css";

function ExpPicker({ setNum }) {
  function setNumHandler(event) {
    setNum(Number(event.target.name));
  }

  return (
    <div>
      <h4 className={classes.head}>Expressions</h4>
      <button className={classes.btn} name="0" onClick={setNumHandler}>
        Simple
      </button>
      <button className={classes.btn} name="1" onClick={setNumHandler}>
        Custom
      </button>
      <button className={classes.btn} name="2" onClick={setNumHandler}>
        Chance
      </button>
    </div>
  );
}

export default ExpPicker;
