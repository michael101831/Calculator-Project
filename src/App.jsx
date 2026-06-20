import SimpleExp from "./components/SimpleExp";
import CompExp from "./components/CustomExp";
import ChanceExp from "./components/ChanceExp";
import ExpPicker from "./components/ExpPicker";
import Graph from "./components/Graph";

import { useState } from "react";

import "./App.css";

function App() {
  const [solution, setSolution] = useState(0);
  const [expNum, setExpNum] = useState(0);

  let loadedExp = "";

  function calc(string) {
    if (expNum === 0) {
      setSolution(Function(`'use strict'; return (${string})`)());
    }

    if (expNum === 1) {
      setSolution(Function(`'use strict'; return (${string})`)());
    }

    if (expNum === 2) {
      setSolution(
        Number(Function(`'use strict'; return (${string})`)()).toFixed(3)
      );
    }

    return solution;
  }

  function setNum(num) {
    setSolution(0);
    setExpNum(num);
  }

  if (expNum === 0) {
    loadedExp = <SimpleExp calc={calc} />;
  }

  if (expNum === 1) {
    loadedExp = <CompExp calc={calc} />;
  }

  if (expNum === 2) {
    loadedExp = <ChanceExp calc={calc} />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h3>Calculator</h3>
      </header>
      <div className="App-body">
        {loadedExp}
        <p>{solution}</p>
      </div>
      <div>
        <ExpPicker setNum={setNum} />
      </div>
      <div>
        <Graph solution={solution} />
      </div>
    </div>
  );
}

export default App;
