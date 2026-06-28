import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  ClipboardList,
  Package,
  FileCheck,
  Mail,
  Truck,
  BarChart3,
  Settings,
  Bell,
  HelpCircle,
  User,
  ChevronDown,
  AlertTriangle,
  Users,
  FileText,
} from 'lucide-react';

const navItems = [
  { to: '/app/inicio', label: 'Início', icon: Home },
  { to: '/app/decisoes', label: 'Fila de Decisões', icon: ClipboardList },
  { to: '/app/processos', label: 'Processos', icon: Package },
  { to: '/app/liberacao', label: 'Liberação', icon: FileCheck },
  { to: '/app/couriers', label: 'Couriers', icon: Mail },
  { to: '/app/demurrage', label: 'Demurrage', icon: Truck },
];

const gestaoSubItems = [
  { to: '/app/gestao/exigem-atencao', label: 'Exigem Atenção', icon: AlertTriangle },
  { to: '/app/gestao/equipe', label: 'Equipe & Desempenho', icon: Users },
  { to: '/app/gestao/relatorios', label: 'Relatórios', icon: FileText },
];

export function InternalLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isGestaoActive = location.pathname.startsWith('/app/gestao');
  const [gestaoOpen, setGestaoOpen] = useState(isGestaoActive);

  const handleGestaoClick = () => {
    if (!gestaoOpen) {
      setGestaoOpen(true);
      if (!isGestaoActive) {
        navigate('/app/gestao/exigem-atencao');
      }
    } else {
      setGestaoOpen(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[220px] bg-sidebar-bg flex flex-col flex-shrink-0 overflow-x-hidden">
        {/* Logo */}
        <div className="px-5 pt-7 pb-7">
          <img
            src="/assets/images/image copy copy copy.png"
            alt="Priora"
            className="w-full h-auto object-contain object-left"
            style={{ maxWidth: '132px' }}
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-1 space-y-0.5 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'}`
              }
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}

          {/* Gestão with expandable submenu */}
          <button
            onClick={handleGestaoClick}
            className={`sidebar-item w-full ${
              isGestaoActive ? 'sidebar-item-active' : 'sidebar-item-inactive'
            }`}
          >
            <BarChart3 className="w-[18px] h-[18px] flex-shrink-0" />
            <span className="flex-1 text-left">Gestão</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                gestaoOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Submenu */}
          <div
            className={`overflow-hidden transition-all duration-200 ease-in-out ${
              gestaoOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="ml-4 pl-3 border-l border-gray-700/50 space-y-0.5 py-1">
              {gestaoSubItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-medium transition-all duration-150 ${
                      isActive
                        ? 'text-white bg-priora-600/60'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-sidebar-hover'
                    }`}
                  >
                    <item.icon className="w-[14px] h-[14px] flex-shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>

          <NavLink
            to="/app/configuracoes"
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'}`
            }
          >
            <Settings className="w-[18px] h-[18px] flex-shrink-0" />
            <span>Configurações</span>
          </NavLink>
        </nav>

        {/* User section */}
        <div className="px-4 pb-5 pt-3 border-t border-sidebar-border">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 w-full px-2 py-2 rounded-xl hover:bg-sidebar-hover transition-colors group"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <img src="/assets/images/image copy copy copy copy copy copy.png" alt="Carlos Vinycio Grammeliski" className="w-full h-full object-cover object-top" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-white leading-tight">Carlos Vinycio Grammeliski</p>
              <p className="text-[10px] text-gray-500">Analista Operacional</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-300" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-end px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors">
              <Bell className="w-[18px] h-[18px] text-text-secondary" />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-danger-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                3
              </span>
            </button>
            <button className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors">
              <HelpCircle className="w-[18px] h-[18px] text-text-secondary" />
            </button>
            <button className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors">
              <User className="w-[18px] h-[18px] text-text-secondary" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-surface-secondary">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
