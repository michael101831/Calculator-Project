import { useState, useEffect } from "react";

function CompExp({ calc }) {
  const [equation, setEquation] = useState(0);
  const [length, setLength] = useState(5);

  function calcHandler(event) {
    event.preventDefault();

    let finalEquation = String(equation);
    finalEquation.replace("x", "*").replace("X", "*").replace("^", "**");
    console.log(String(equation));

    calc(`${finalEquation}`);
  }

  function expressionHandler(event) {
    setEquation(event.target.value);
    setLength(String(event.target.value).length / 1.8 + 0.6);
  }

  useEffect(() => {
    if (length === 0.6) {
      setLength(5);
    }
    console.log(length);
  }, [length]);

  return (
    <div>
      <div>
        <input
          required
          name="equation"
          defaultValue=""
          placeholder="Expression"
          style={{ width: `${length}em` }}
          onChange={expressionHandler}
        ></input>
      </div>
      <div>
        <button onClick={calcHandler}>Calculate</button>
      </div>
    </div>
  );
}

export default CompExp;
