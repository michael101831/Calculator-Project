import classes from "./ExpCategories.module.css";

function ExpCategories({ categories, selected, onChange }) {
  return (
    <div className={classes.tabs} role="tablist" aria-label="Categories">
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          role="tab"
          aria-selected={cat === selected}
          className={classes.tab}
          onClick={() => onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default ExpCategories;
