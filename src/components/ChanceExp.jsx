import { useState, useEffect } from "react";
import classes from "./ChanceExp.module.css";

function ChanceExp({ calc }) {
  const [chanceLgth, setChanceLgth] = useState(9);
  const [rollLgth, setRollLgth] = useState(9);
  const [chance, setChance] = useState(0);
  const [rolls, setRolls] = useState(0);

  function calcHandler(event) {
    event.preventDefault();

    console.log(chance, rolls);

    calc(`1-((1-${chance})**${rolls})`);
  }

  function chanceHandler(event) {
    setChance(event.target.value);
    setChanceLgth(String(event.target.value).length / 1.8 + 1.8);
  }
  function rollHandler(event) {
    setRolls(event.target.value);

    setRollLgth(String(event.target.value).length / 1.8 + 1.8);
  }

  useEffect(() => {
    if (rollLgth === 1.8) {
      setRollLgth(9);
    }
  }, [rollLgth]);

  useEffect(() => {
    if (chanceLgth === 1.8) {
      setChanceLgth(9);
    }
  }, [chanceLgth]);

  return (
    <div>
      <div>
        <input
          required
          type="number"
          min={0.001}
          max={1}
          step={0.001}
          placeholder="Decimal Chance"
          defaultValue=""
          style={{ width: `${chanceLgth}em` }}
          onChange={chanceHandler}
        ></input>
        <input
          required
          type="number"
          min={1}
          max={999}
          placeholder="Number Of Rolls"
          defaultValue=""
          style={{ width: `${rollLgth}em` }}
          onChange={rollHandler}
        ></input>
      </div>
      <div>
        <button onClick={calcHandler}>Calculate</button>
      </div>
    </div>
  );
}

export default ChanceExp;
