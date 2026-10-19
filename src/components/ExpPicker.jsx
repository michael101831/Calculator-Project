import classes from "./ExpPicker.module.css";

function ExpPicker({ expressionGroups, selected, activeLabel, onSelect }) {
  const expressions = expressionGroups[selected] || [];

  return (
    <div className={classes.row} role="group" aria-label="Expressions">
      {expressions.map((exp) => {
        const isActive = exp.label === activeLabel;
        return (
          <button
            key={exp.label}
            type="button"
            className={isActive ? `${classes.btn} ${classes.active}` : classes.btn}
            aria-pressed={isActive}
            onClick={() => onSelect(exp)}
          >
            {exp.label}
          </button>
        );
      })}
    </div>
  );
}

export default ExpPicker;
