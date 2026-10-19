import { useState } from "react";

function RightTriangleExp({ setSolution }) {
  const sides = ["hypotenuse", "adjacent", "opposite"];
  const [solveFor, setSolveFor] = useState("hypotenuse");
  const [knownSide, setKnownSide] = useState("opposite");

  function solve(target, known, value, angle) {
    if (target === "hypotenuse") {
      if (known === "opposite") return value / Math.sin(angle);
      if (known === "adjacent") return value / Math.cos(angle);
    }
    if (target === "opposite") {
      if (known === "hypotenuse") return value * Math.sin(angle);
      if (known === "adjacent") return value * Math.tan(angle);
    }
    if (target === "adjacent") {
      if (known === "hypotenuse") return value * Math.cos(angle);
      if (known === "opposite") return value / Math.tan(angle);
    }
  }

  function handleSolveForChange(event) {
    const newSolveFor = event.target.value;
    setSolveFor(newSolveFor);
    if (newSolveFor === knownSide) {
      setKnownSide(sides.find((side) => side !== newSolveFor));
    }
  }

  function calcHandler(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());

    const angle = Number(formObject.angle);
    const unit = formObject.unit;
    const knownValue = Number(formObject.knownValue);
    const angleInRadians = unit === "degrees" ? (angle * Math.PI) / 180 : angle;

    const result = solve(solveFor, knownSide, knownValue, angleInRadians);

    setSolution(Math.round(result * 1e6) / 1e6);
  }

  return (
    <form className="calc-form" onSubmit={calcHandler}>
      <div className="calc-row">
        <label className="field">
          <span>Solve for</span>
          <select value={solveFor} onChange={handleSolveForChange}>
            {sides.map((side) => (
              <option key={side} value={side}>
                {side.charAt(0).toUpperCase() + side.slice(1)}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Known side</span>
          <select
            value={knownSide}
            onChange={(event) => setKnownSide(event.target.value)}
          >
            {sides
              .filter((side) => side !== solveFor)
              .map((side) => (
                <option key={side} value={side}>
                  {side.charAt(0).toUpperCase() + side.slice(1)}
                </option>
              ))}
          </select>
        </label>
        <label className="field">
          <span>Length</span>
          <input
            required
            type="number"
            name="knownValue"
            min={0}
            defaultValue={1}
          />
        </label>
      </div>
      <div className="calc-row">
        <label className="field">
          <span>Angle</span>
          <input
            required
            type="number"
            name="angle"
            min={-360}
            max={360}
            defaultValue={0}
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

export default RightTriangleExp;
