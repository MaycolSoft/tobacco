import { useLocation } from 'react-router-dom';
import { Anchor, CreditCard, Eye, FileText, Layout, Navigation, Type } from 'lucide-react';
import { useLayoutStore } from '@/store/useLayoutStore';
import { Section, ToggleRow } from './controls';

export default function LayoutTab() {
  const { pathname } = useLocation();
  const { currentConfig, toggleNavbar, toggleFooter, toggleHeader, toggleNavbarSticky } = useLayoutStore();
  const { showNavbar, showFooter, showHeader, navbarSticky, headerData } = currentConfig;

  return (
    <div className="cc-grid cc-grid-2">
      {/* Cada toggle recibe pathname para guardarse específicamente para esta página */}
      <Section title="Global Layout" icon={Layout} action={<code className="cc-route">{pathname}</code>}>
        <ToggleRow icon={Eye} label="Navbar" checked={showNavbar} onToggle={() => toggleNavbar(pathname)} />
        <ToggleRow icon={CreditCard} label="Footer" checked={showFooter} onToggle={() => toggleFooter(pathname)} />
        <ToggleRow icon={Type} label="Show Header" checked={showHeader} onToggle={() => toggleHeader(pathname)} />
      </Section>

      <div className="cc-stack">
        <Section title="Navbar Settings" icon={Navigation}>
          <ToggleRow icon={Anchor} label="Sticky Mode" checked={navbarSticky} disabled={!showNavbar} onToggle={() => toggleNavbarSticky(pathname)} />
          {!showNavbar && <p className="cc-note">Enable the navbar to change sticky mode.</p>}
        </Section>

        <Section title="Page Data" icon={FileText}>
          <div className="cc-data-row"><span>Header title</span><strong>{headerData?.title || 'No Title Set'}</strong></div>
        </Section>
      </div>
    </div>
  );
}
