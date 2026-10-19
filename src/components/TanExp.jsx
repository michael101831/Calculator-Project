function TanExp({ setSolution }) {
  function calcHandler(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());

    const angle = Number(formObject.angle);
    const unit = formObject.unit;

    const angleInRadians = unit === "degrees" ? (angle * Math.PI) / 180 : angle;
    const result = Math.tan(angleInRadians);

    setSolution(Math.round(result * 1e10) / 1e10);
  }

  return (
    <form className="calc-form" onSubmit={calcHandler}>
      <div className="calc-row">
        <label className="field">
          <span>Angle</span>
          <input
            required
            type="number"
            name="angle"
            min={-360}
            max={360}
            placeholder="45"
          />
        </label>
        <label className="field field-compact">
          <span>Unit</span>
          <select required name="unit" defaultValue="degrees">
            <option value="degrees">Degrees</option>
            <option value="radians">Radians</option>
          </select>
        </label>
      </div>
      <button type="submit">Calculate</button>
    </form>
  );
}

export default TanExp;
