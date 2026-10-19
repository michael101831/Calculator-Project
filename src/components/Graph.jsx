import { useEffect, useMemo, useRef, useState } from "react";
import classes from "./Graph.module.css";

const WIDTH = 640;
const HEIGHT = 320;
const PAD = { top: 18, right: 18, bottom: 46, left: 58 };
const MIN_SPAN = 1e-4;
const MAX_SPAN = 1e6;

function numericSolution(solution) {
  if (typeof solution === "number") {
    return Number.isFinite(solution) ? solution : null;
  }
  if (typeof solution === "string" && solution.trim() !== "") {
    const value = Number(solution);
    return Number.isFinite(value) ? value : null;
  }
  return null;
}

function niceStep(span, count) {
  const rough = span / Math.max(count, 1);
  if (!Number.isFinite(rough) || rough <= 0) return 1;
  const power = 10 ** Math.floor(Math.log10(rough));
  const error = rough / power;
  const nice = error >= 7.5 ? 10 : error >= 3.5 ? 5 : error >= 1.5 ? 2 : 1;
  return nice * power;
}

function axisBounds(values, fallbackMin, fallbackMax) {
  if (values.length === 0) {
    return { min: fallbackMin, max: fallbackMax };
  }

  let min = Math.min(...values);
  let max = Math.max(...values);
  if (min === max) {
    const pad = Math.abs(min) > 0 ? Math.abs(min) * 0.5 : 1;
    min -= pad;
    max += pad;
  } else {
    const pad = (max - min) * 0.12;
    min -= pad;
    max += pad;
  }

  return { min, max };
}

function ticksInRange(min, max) {
  const span = max - min;
  const step = niceStep(span, 4);
  if (!(step > 0) || !Number.isFinite(step)) return { step: 1, ticks: [] };

  const start = Math.ceil(min / step - 1e-8);
  const end = Math.floor(max / step + 1e-8);
  const ticks = [];
  for (let index = start; index <= end && ticks.length < 8; index += 1) {
    ticks.push(index * step);
  }
  return { step, ticks };
}

function formatTick(value, step) {
  if (!Number.isFinite(value)) return "";
  const decimals = step >= 1 ? 0 : Math.min(8, Math.max(0, Math.ceil(-Math.log10(step))));
  const factor = 10 ** decimals;
  return String(Math.round(value * factor) / factor);
}

function formatNumber(value) {
  return String(Math.round(value * 1e6) / 1e6);
}

function clampSpan(span) {
  return Math.min(MAX_SPAN, Math.max(MIN_SPAN, span));
}

function zoomView(base, factor, anchorX, anchorY) {
  const xSpan = base.xMax - base.xMin;
  const ySpan = base.yMax - base.yMin;
  const nextXSpan = clampSpan(xSpan / factor);
  const nextYSpan = clampSpan(ySpan / factor);
  const xRatio = xSpan === 0 ? 0.5 : (anchorX - base.xMin) / xSpan;
  const yRatio = ySpan === 0 ? 0.5 : (anchorY - base.yMin) / ySpan;
  const xMin = anchorX - xRatio * nextXSpan;
  const yMin = anchorY - yRatio * nextYSpan;

  return {
    xMin,
    xMax: xMin + nextXSpan,
    yMin,
    yMax: yMin + nextYSpan,
  };
}

function wheelScale(event) {
  if (event.deltaMode === 1) return 16;
  if (event.deltaMode === 2) return 400;
  return 1;
}

function Graph({ solution, points, onAddPoint, onAddManualPoint, onRemovePoint, onClear }) {
  const yValue = numericSolution(solution);
  const canAdd = yValue !== null;
  const svgRef = useRef(null);
  const dragRef = useRef(null);
  const fittedRef = useRef(null);
  const [view, setView] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [manualX, setManualX] = useState("");
  const [manualY, setManualY] = useState("");

  const fitted = useMemo(() => {
    const x = axisBounds(points.map((point) => point.x), 0, 4);
    const y = axisBounds(points.map((point) => point.y), 0, 4);
    return { xMin: x.min, xMax: x.max, yMin: y.min, yMax: y.max };
  }, [points]);
  fittedRef.current = fitted;

  const active = view ?? fitted;
  const xScale = ticksInRange(active.xMin, active.xMax);
  const yScale = ticksInRange(active.yMin, active.yMax);
  const plotWidth = WIDTH - PAD.left - PAD.right;
  const plotHeight = HEIGHT - PAD.top - PAD.bottom;

  function xPos(value) {
    return PAD.left + ((value - active.xMin) / (active.xMax - active.xMin)) * plotWidth;
  }

  function yPos(value) {
    return PAD.top + (1 - (value - active.yMin) / (active.yMax - active.yMin)) * plotHeight;
  }

  function changeView(updater) {
    setView((current) => updater(current ?? fittedRef.current));
  }

  function zoomBy(factor) {
    changeView((base) => {
      const anchorX = (base.xMin + base.xMax) / 2;
      const anchorY = (base.yMin + base.yMax) / 2;
      return zoomView(base, factor, anchorX, anchorY);
    });
  }

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return undefined;

    function onWheel(event) {
      event.preventDefault();
      const rect = svg.getBoundingClientRect();
      const scale = wheelScale(event);
      let deltaX = event.deltaX * scale;
      let deltaY = event.deltaY * scale;
      if (event.shiftKey && deltaX === 0) {
        deltaX = deltaY;
        deltaY = 0;
      }

      if (event.ctrlKey || event.metaKey) {
        const svgX = ((event.clientX - rect.left) / rect.width) * WIDTH;
        const svgY = ((event.clientY - rect.top) / rect.height) * HEIGHT;
        const factor = Math.min(1.5, Math.max(1 / 1.5, Math.exp(-deltaY * 0.0016)));
        changeView((base) => {
          const xSpan = base.xMax - base.xMin;
          const ySpan = base.yMax - base.yMin;
          const anchorX = base.xMin + ((svgX - PAD.left) / plotWidth) * xSpan;
          const anchorY = base.yMin + (1 - (svgY - PAD.top) / plotHeight) * ySpan;
          return zoomView(base, factor, anchorX, anchorY);
        });
        return;
      }

      changeView((base) => {
        const plotPxW = rect.width * (plotWidth / WIDTH);
        const plotPxH = rect.height * (plotHeight / HEIGHT);
        const xSpan = base.xMax - base.xMin;
        const ySpan = base.yMax - base.yMin;
        const dx = (deltaX / plotPxW) * xSpan;
        const dy = -(deltaY / plotPxH) * ySpan;
        return {
          xMin: base.xMin + dx,
          xMax: base.xMax + dx,
          yMin: base.yMin + dy,
          yMax: base.yMax + dy,
        };
      });
    }

    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [plotHeight, plotWidth]);

  function onPointerDown(event) {
    if (event.button !== 0) return;
    const base = view ?? fittedRef.current;
    dragRef.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      view: base,
    };
    setDragging(true);
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Synthetic events cannot always capture the pointer.
    }
  }

  function onPointerMove(event) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const plotPxW = rect.width * (plotWidth / WIDTH);
    const plotPxH = rect.height * (plotHeight / HEIGHT);
    const xSpan = drag.view.xMax - drag.view.xMin;
    const ySpan = drag.view.yMax - drag.view.yMin;
    const dx = -((event.clientX - drag.startClientX) / plotPxW) * xSpan;
    const dy = ((event.clientY - drag.startClientY) / plotPxH) * ySpan;
    setView({
      xMin: drag.view.xMin + dx,
      xMax: drag.view.xMax + dx,
      yMin: drag.view.yMin + dy,
      yMax: drag.view.yMax + dy,
    });
  }

  function endDrag(event) {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
  }

  function handleManual(event) {
    event.preventDefault();
    const x = Number(manualX);
    const y = Number(manualY);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    onAddManualPoint(x, y);
    setManualX("");
    setManualY("");
  }

  const ordered = [...points].sort((a, b) => a.x - b.x || a.id - b.id);
  const line = ordered.map((point) => `${xPos(point.x)},${yPos(point.y)}`).join(" ");
  const nextX = points.reduce((max, point) => Math.max(max, point.x), 0) + 1;

  return (
    <section className={classes.section} aria-labelledby="graph-heading">
      <header className={classes.header}>
        <div>
          <h2 id="graph-heading">Graph</h2>
          <p>Add the current result, or enter an x and y yourself.</p>
        </div>
      </header>

      <div className={classes.body}>
        <div className={classes.plotWrap}>
          <svg
            ref={svgRef}
            className={dragging ? `${classes.plot} ${classes.grabbing}` : classes.plot}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            aria-label="Graph. Drag or scroll to move. Control and scroll to zoom."
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <defs>
              <clipPath id="graph-plot-area">
                <rect x={PAD.left} y={PAD.top} width={plotWidth} height={plotHeight} />
              </clipPath>
            </defs>

            <g clipPath="url(#graph-plot-area)">
              {yScale.ticks.map((tick) => (
                <line
                  key={`y-${tick}`}
                  x1={PAD.left}
                  x2={WIDTH - PAD.right}
                  y1={yPos(tick)}
                  y2={yPos(tick)}
                  className={classes.grid}
                />
              ))}
              {xScale.ticks.map((tick) => (
                <line
                  key={`x-${tick}`}
                  x1={xPos(tick)}
                  x2={xPos(tick)}
                  y1={PAD.top}
                  y2={HEIGHT - PAD.bottom}
                  className={classes.grid}
                />
              ))}
              {ordered.length > 1 && <polyline points={line} className={classes.line} />}
              {ordered.map((point) => (
                <circle
                  key={point.id}
                  cx={xPos(point.x)}
                  cy={yPos(point.y)}
                  r="5.5"
                  className={classes.dot}
                >
                  <title>{`x ${formatNumber(point.x)}, y ${formatNumber(point.y)}`}</title>
                </circle>
              ))}
            </g>

            <line
              x1={PAD.left}
              x2={WIDTH - PAD.right}
              y1={HEIGHT - PAD.bottom}
              y2={HEIGHT - PAD.bottom}
              className={classes.axis}
            />
            <line
              x1={PAD.left}
              x2={PAD.left}
              y1={PAD.top}
              y2={HEIGHT - PAD.bottom}
              className={classes.axis}
            />
            {yScale.ticks.map((tick) => (
              <text
                key={`y-label-${tick}`}
                x={PAD.left - 8}
                y={yPos(tick) + 4}
                className={classes.tick}
                textAnchor="end"
              >
                {formatTick(tick, yScale.step)}
              </text>
            ))}
            {xScale.ticks.map((tick) => (
              <text
                key={`x-label-${tick}`}
                x={xPos(tick)}
                y={HEIGHT - PAD.bottom + 18}
                className={classes.tick}
                textAnchor="middle"
              >
                {formatTick(tick, xScale.step)}
              </text>
            ))}
            <text
              x={PAD.left + plotWidth / 2}
              y={HEIGHT - 8}
              className={classes.axisLabel}
              textAnchor="middle"
            >
              X
            </text>
            <text
              x={-(PAD.top + plotHeight / 2)}
              y={16}
              className={classes.axisLabel}
              textAnchor="middle"
              transform="rotate(-90)"
            >
              Y
            </text>
            {points.length === 0 && (
              <text
                x={PAD.left + plotWidth / 2}
                y={PAD.top + plotHeight / 2}
                className={classes.empty}
                textAnchor="middle"
              >
                No points yet
              </text>
            )}
          </svg>
        </div>
        <div className={classes.plotTools}>
          <p className={classes.hint}>Drag or scroll to move. Ctrl + scroll to zoom.</p>
          <div className={classes.zoomBar}>
            <button type="button" aria-label="Zoom in" onClick={() => zoomBy(1.3)}>
              +
            </button>
            <button type="button" aria-label="Zoom out" onClick={() => zoomBy(1 / 1.3)}>
              −
            </button>
            <button type="button" onClick={() => setView(null)} disabled={view === null}>
              Reset
            </button>
          </div>
        </div>

        <div className={classes.controls}>
          <div>
            <span className={classes.kicker}>Current result</span>
            <p className={classes.readout}>{solution}</p>
            <p className={classes.note}>
              {canAdd
                ? `Adds x = ${formatNumber(nextX)}, y = ${formatNumber(yValue)}.`
                : "This result isn’t a single number, so it can’t be plotted."}
            </p>
          </div>
          <div className={classes.actions}>
            <button type="button" className={classes.primary} onClick={onAddPoint} disabled={!canAdd}>
              Add result
            </button>
            <button type="button" className={classes.secondary} onClick={onClear} disabled={points.length === 0}>
              Clear
            </button>
          </div>
        </div>

        <div className={classes.manualBlock}>
          <span className={classes.kicker}>Manual point</span>
          <form className={classes.manual} onSubmit={handleManual}>
            <label className="field">
              <span>X</span>
              <input
                required
                type="number"
                step="any"
                name="x"
                value={manualX}
                placeholder="0"
                onChange={(event) => setManualX(event.target.value)}
              />
            </label>
            <label className="field">
              <span>Y</span>
              <input
                required
                type="number"
                step="any"
                name="y"
                value={manualY}
                placeholder="0"
                onChange={(event) => setManualY(event.target.value)}
              />
            </label>
            <button type="submit" className={classes.primary}>
              Add point
            </button>
          </form>
        </div>

        {points.length > 0 && (
          <>
            <div className={classes.listHead} aria-hidden="true">
              <span>X</span>
              <span>Y</span>
              <span />
            </div>
            <ul className={classes.list}>
            {ordered.map((point) => (
              <li key={point.id}>
                <span className={classes.value}>{formatNumber(point.x)}</span>
                <span className={classes.value}>{formatNumber(point.y)}</span>
                <button type="button" onClick={() => onRemovePoint(point.id)}>
                  Remove
                </button>
              </li>
            ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}

export default Graph;
