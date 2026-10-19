function CompExp({ setSolution }) {
  function calcHandler(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const equation = String(formData.get("equation"));
    const fixedFinalEquation = equation.replace("x", "*").replace("X", "*").replace("^", "**");

    setSolution(Function(`'use strict'; return (${fixedFinalEquation})`)());
  }

  return (
    <form className="calc-form" onSubmit={calcHandler}>
      <div className="calc-row">
        <label className="field field-grow">
          <span>Expression</span>
          <input
            required
            name="equation"
            placeholder="12 x 4 ^ 2"
          />
        </label>
      </div>
      <button type="submit">Calculate</button>
    </form>
  );
}

export default CompExp;
