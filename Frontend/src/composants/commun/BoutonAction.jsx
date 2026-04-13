export default function BoutonAction({
  type = 'button',
  variante = 'primaire',
  onClick,
  children,
  disabled = false,
  plein = false,
}) {
  const classes = ['btn', `btn-${variante}`];

  if (plein) classes.push('btn-plein');

  return (
    <button type={type} className={classes.join(' ')} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
