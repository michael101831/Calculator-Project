function PowerExp({ setSolution }) {
  function calcHandler(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());

    const base = Number(formObject.base);
    const n = Number(formObject.n);

    const result = Math.pow(base, n);

    setSolution(Math.round(result * 1e10) / 1e10);
  }

  return (
    <form className="calc-form" onSubmit={calcHandler}>
      <div className="calc-row">
        <label className="field">
          <span>Base</span>
          <input
            required
            type="number"
            name="base"
            min={-999}
            max={999}
            defaultValue={0}
          />
        </label>
        <label className="field">
          <span>Exponent</span>
          <input
            required
            type="number"
            name="n"
            min={-99}
            max={99}
            defaultValue={2}
          />
        </label>
      </div>
      <button type="submit">Calculate</button>
    </form>
  );
}

export default PowerExp;
