const styles = {
  ADMIN: 'pastille-role role-admin',
  BIBLIOTHECAIRE: 'pastille-role role-bibliothecaire',
  MEMBRE: 'pastille-role role-membre',
};

export default function PastilleRole({ role }) {
  return <span className={styles[role] || 'pastille-role'}>{role}</span>;
}
