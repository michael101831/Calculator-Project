function ChanceExp({ setSolution }) {
  function calcHandler(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const chance = formData.get("chance");
    const rolls = formData.get("rolls");

    setSolution(
      Number(Function(`'use strict'; return (1-((1-${chance})**${rolls}))`)()).toFixed(3)
    );
  }

  return (
    <form className="calc-form" onSubmit={calcHandler}>
      <div className="calc-row">
        <label className="field">
          <span>Chance per trial</span>
          <input
            required
            type="number"
            name="chance"
            min={0.001}
            max={1}
            step={0.001}
            placeholder="0.25"
          />
        </label>
        <label className="field">
          <span>Trials</span>
          <input
            required
            type="number"
            name="rolls"
            min={1}
            max={999}
            placeholder="10"
          />
        </label>
      </div>
      <button type="submit">Calculate</button>
    </form>
  );
}

export default ChanceExp;
