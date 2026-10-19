function SimpleExp({ setSolution }) {
  function calcHandler(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());

    const firstNum = formObject.firstNum;
    const finalFirstNum = firstNum.slice(
      firstNum.search(/[1-9-]/),
      firstNum.length,
    );

    const modifier = formObject.modifier;

    const secondNum = formObject.secondNum;
    const finalSecondNum = secondNum.slice(
      secondNum.search(/[1-9-]/),
      secondNum.length
    );

    setSolution(Function(`'use strict'; return ((${finalFirstNum}) ${modifier} (${finalSecondNum}))`)());
  }

  return (
    <form className="calc-form" onSubmit={calcHandler}>
      <div className="calc-row">
        <label className="field">
          <span>First number</span>
          <input
            required
            type="number"
            name="firstNum"
            min={-999}
            max={999}
            defaultValue={0}
          />
        </label>
        <label className="field field-compact">
          <span>Operator</span>
          <select required name="modifier" defaultValue="+">
            <option value="+">+</option>
            <option value="-">−</option>
            <option value="*">×</option>
            <option value="/">÷</option>
            <option value="**">xⁿ</option>
          </select>
        </label>
        <label className="field">
          <span>Second number</span>
          <input
            required
            type="number"
            name="secondNum"
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

export default SimpleExp;
