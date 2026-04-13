import { Outlet } from 'react-router-dom';
import BarreLaterale from './BarreLaterale';
import EntetePrive from './EntetePrive';

export default function MiseEnPagePrivee() {
  return (
    <div className="coquille-privee">
      <BarreLaterale />
      <div className="zone-privee">
        <EntetePrive />
        <main className="contenu-prive">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
