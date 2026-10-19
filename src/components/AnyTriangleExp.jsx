function AnyTriangleExp({ setSolution }) {
  function calcHandler(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());

    const sideA = Number(formObject.sideA);
    const sideB = Number(formObject.sideB);
    const includedAngle = Number(formObject.includedAngle);
    const unit = formObject.unit;

    const angleInRadians =
      unit === "degrees" ? (includedAngle * Math.PI) / 180 : includedAngle;

    // Law of Cosines: solves for the side opposite the included angle
    // between sideA and sideB. Works for right triangles too -- if the
    // angle is 90 degrees, cos(90) = 0 and this reduces to a^2 + b^2 = c^2.
    // c^2 = a^2 + b^2 - 2ab*cos(C)
    const result = Math.sqrt(
      sideA * sideA +
        sideB * sideB -
        2 * sideA * sideB * Math.cos(angleInRadians)
    );

    setSolution(Math.round(result * 1e6) / 1e6);
  }

  return (
    <form className="calc-form" onSubmit={calcHandler}>
      <div className="calc-row">
        <label className="field">
          <span>Side A</span>
          <input required type="number" name="sideA" min={0} defaultValue={1} />
        </label>
        <label className="field">
          <span>Side B</span>
          <input required type="number" name="sideB" min={0} defaultValue={1} />
        </label>
      </div>
      <div className="calc-row">
        <label className="field">
          <span>Included angle</span>
          <input
            required
            type="number"
            name="includedAngle"
            min={0}
            max={360}
            defaultValue={90}
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

export default AnyTriangleExp;
