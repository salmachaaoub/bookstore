export default function ChampFormulaire({
  label,
  id,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder = '',
  min,
  disabled = false,
  children,
  textarea = false,
  rows = 4,
}) {
  return (
    <label className="champ-formulaire" htmlFor={id}>
      <span>{label}</span>
      {children ? (
        <select
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className="champ"
        >
          {children}
        </select>
      ) : textarea ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className="champ"
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          min={min}
          disabled={disabled}
          className="champ"
        />
      )}
    </label>
  );
}
