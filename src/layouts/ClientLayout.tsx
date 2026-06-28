import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Package, Truck, FileText, MessageSquare, Lock, Shield } from 'lucide-react';

const navItems = [
  { to: '/cliente/liberacao', label: 'Liberação', icon: Package },
  { to: '/cliente/demurrage', label: 'Demurrage', icon: Truck },
  { to: '/cliente/retirada', label: 'Retirada de Documentos', icon: FileText },
  { to: '/cliente/feedback', label: 'Feedback', icon: MessageSquare },
];

export function ClientLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar — light client theme */}
      <aside className="w-[220px] bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="px-5 pt-6 pb-10 flex items-center gap-3">
          <img src="/image copy copy.png" alt="Priora" className="h-14 w-auto" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-priora-600 text-white shadow-md shadow-priora-600/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-gray-50'
                }`
              }
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Security footer */}
        <div className="px-5 pb-6 pt-4">
          <div className="flex items-center gap-2.5 mb-2">
            <Shield className="w-5 h-5 text-priora-400" />
            <div>
              <p className="text-xs font-medium text-text-primary leading-tight">Ambiente seguro</p>
              <p className="text-xs text-text-primary leading-tight">e confiável</p>
            </div>
          </div>
          <p className="text-[10px] text-text-tertiary leading-relaxed">
            Seus dados estão protegidos com segurança de ponta.
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-end px-6 flex-shrink-0">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-text-secondary hover:bg-gray-50 transition-colors">
            <Lock className="w-3.5 h-3.5" />
            Acesso seguro
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
