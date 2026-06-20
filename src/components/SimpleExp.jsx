import { useState } from "react";

function SimpleExp({ calc }) {
  function calcHandler(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());

    const firstNum = formObject.firstNum;
    const finalFirstNum = firstNum.slice(
      firstNum.search(/[1-9-]/),
      firstNum.length
    );

    const modifier = formObject.modifier;

    const secondNum = formObject.secondNum;
    const finalSecondNum = secondNum.slice(
      secondNum.search(/[1-9-]/),
      secondNum.length
    );

    calc(`${finalFirstNum} ${modifier} ${finalSecondNum}`);
  }

  return (
    <form onSubmit={calcHandler}>
      <div>
        <input
          required
          type="number"
          name="firstNum"
          min={-999}
          max={999}
          defaultValue={0}
        ></input>
        <select required name="modifier">
          <option defaultValue="+">+</option>
          <option value="-">-</option>
          <option value="*">x</option>
          <option value="/">/</option>
          <option value="**">^</option>
        </select>
        <input
          required
          type="number"
          name="secondNum"
          min={-999}
          max={999}
          defaultValue={0}
        ></input>
      </div>
      <div>
        <button type="submit">Calculate</button>
      </div>
    </form>
  );
}

export default SimpleExp;
