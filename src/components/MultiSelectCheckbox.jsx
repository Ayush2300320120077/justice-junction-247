export default function MultiSelectCheckbox({ options, selected, onChange, columns = 3 }) {
  const toggle = (val) => {
    if (selected.includes(val)) {
      onChange(selected.filter(s => s !== val))
    } else {
      onChange([...selected, val])
    }
  }

  return (
    <div className="multi-select-group" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          className={`multi-select-pill ${selected.includes(opt) ? 'selected' : ''}`}
          onClick={() => toggle(opt)}
        >
          <span className="multi-select-check">{selected.includes(opt) ? '✓' : ''}</span>
          {opt}
        </button>
      ))}
    </div>
  )
}
