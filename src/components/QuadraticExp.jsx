function QuadraticExp({ setSolution }) {
  function calcHandler(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());

    const a = Number(formObject.a);
    const b = Number(formObject.b);
    const c = Number(formObject.c);

    const discriminant = b * b - 4 * a * c;

    let result;
    if (discriminant > 0) {
      const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      result = `x = ${round(root1)} or x = ${round(root2)}`;
    } else if (discriminant === 0) {
      const root = -b / (2 * a);
      result = `x = ${round(root)}`;
    } else {
      const realPart = -b / (2 * a);
      const imaginaryPart = Math.sqrt(-discriminant) / (2 * a);
      result = `x = ${round(realPart)} ± ${round(imaginaryPart)}i`;
    }

    setSolution(result);
  }

  function round(num) {
    return Math.round(num * 1e6) / 1e6;
  }

  return (
    <form className="calc-form" onSubmit={calcHandler}>
      <div className="calc-row">
        <label className="field">
          <span>a</span>
          <input
            required
            type="number"
            name="a"
            min={-999}
            max={999}
            defaultValue={1}
          />
        </label>
        <label className="field">
          <span>b</span>
          <input
            required
            type="number"
            name="b"
            min={-999}
            max={999}
            defaultValue={0}
          />
        </label>
        <label className="field">
          <span>c</span>
          <input
            required
            type="number"
            name="c"
            min={-999}
            max={999}
            defaultValue={0}
          />
        </label>
      </div>
      <button type="submit">Calculate</button>
    </form>
  );
}

export default QuadraticExp;
