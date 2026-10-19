import { useState } from "react";

import ExpCategories from "./components/ExpCategories";
import ExpPicker from "./components/ExpPicker";
import SimpleExp from "./components/SimpleExp";
import CompExp from "./components/CustomExp";
import ChanceExp from "./components/ChanceExp";
import SinExp from "./components/SinExp";
import CosExp from "./components/CosExp";
import TanExp from "./components/TanExp";
import AnyTriangleExp from "./components/AnyTriangleExp";
import RightTriangleExp from "./components/RightTriangleExp";
import RootExp from "./components/RootExp";
import PowerExp from "./components/PowerExp";
import QuadraticExp from "./components/QuadraticExp";
import Graph from "./components/Graph";

import "./App.css";

const CATEGORIES = ["Misc", "Trigonometry", "Algebra"];

export const EXP_GROUPS = {
  Misc: [
    {
      label: "Simple",
      blurb: "Combine two numbers with an operator.",
      Expression: SimpleExp,
    },
    {
      label: "Custom",
      blurb: "Evaluate an expression. Use x to multiply and ^ for powers.",
      Expression: CompExp,
    },
    {
      label: "Chance",
      blurb: "Probability of at least one success across repeated trials.",
      Expression: ChanceExp,
    },
  ],
  Trigonometry: [
    {
      label: "Sin",
      blurb: "Sine of an angle, in degrees or radians.",
      Expression: SinExp,
    },
    {
      label: "Cos",
      blurb: "Cosine of an angle, in degrees or radians.",
      Expression: CosExp,
    },
    {
      label: "Tan",
      blurb: "Tangent of an angle, in degrees or radians.",
      Expression: TanExp,
    },
    {
      label: "Any Triangle",
      blurb: "Side opposite the included angle, using the law of cosines.",
      Expression: AnyTriangleExp,
    },
    {
      label: "Right Triangle",
      blurb: "Find a side from one known side and an acute angle.",
      Expression: RightTriangleExp,
    },
  ],
  Algebra: [
    {
      label: "Root",
      blurb: "The n-th root of a number.",
      Expression: RootExp,
    },
    {
      label: "Power",
      blurb: "Raise a base to an exponent.",
      Expression: PowerExp,
    },
    {
      label: "Quadratic",
      blurb: "Roots of ax² + bx + c = 0.",
      Expression: QuadraticExp,
    },
  ],
};

function App() {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [activeExp, setActiveExp] = useState(EXP_GROUPS.Misc[0]);
  const [solution, setSolution] = useState(0);
  const [points, setPoints] = useState([]);

  function handleCategory(next) {
    setCategory(next);
    setActiveExp(EXP_GROUPS[next][0]);
    setSolution(0);
  }

  function handleExp(exp) {
    setActiveExp(exp);
    setSolution(0);
  }

  function nextPointId(current) {
    return current.reduce((max, point) => Math.max(max, point.id), 0) + 1;
  }

  function addPoint() {
    const y = Number(solution);
    if (!Number.isFinite(y)) return;

    setPoints((current) => {
      const x = current.reduce((max, point) => Math.max(max, point.x), 0) + 1;
      return [...current, { id: nextPointId(current), x, y }];
    });
  }

  function addManualPoint(x, y) {
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    setPoints((current) => [...current, { id: nextPointId(current), x, y }]);
  }

  function removePoint(id) {
    setPoints((current) => current.filter((point) => point.id !== id));
  }

  const ActiveExpression = activeExp.Expression;

  return (
    <div className="App">
      <div className="page">
        <main className="shell">
        <header className="masthead">
          <div>
            <h1>Calculator</h1>
            <p className="lede">Arithmetic, algebra, and trigonometry.</p>
          </div>
          <p className="category-mark">{category}</p>
        </header>

        <section className="display" aria-live="polite">
          <span className="display-label">Result</span>
          <p className="solution-display">{solution}</p>
        </section>

        <section className="panel">
          <ExpCategories
            categories={CATEGORIES}
            selected={category}
            onChange={handleCategory}
          />
          <ExpPicker
            expressionGroups={EXP_GROUPS}
            selected={category}
            activeLabel={activeExp.label}
            onSelect={handleExp}
          />
          <div className="workspace">
            <h2>{activeExp.label}</h2>
            <p className="blurb">{activeExp.blurb}</p>
            <div className="expression-fields">
              <ActiveExpression
                key={`${category}-${activeExp.label}`}
                setSolution={setSolution}
              />
            </div>
          </div>
        </section>
        </main>
        <Graph
          solution={solution}
          points={points}
          onAddPoint={addPoint}
          onAddManualPoint={addManualPoint}
          onRemovePoint={removePoint}
          onClear={() => setPoints([])}
        />
      </div>
    </div>
  );
}

export default App;
