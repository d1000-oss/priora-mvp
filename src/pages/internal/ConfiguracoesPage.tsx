import { Settings, Bell, Shield, Database, Users, ArrowRight } from 'lucide-react';

export function ConfiguracoesPage() {
  const sections = [
    { icon: Users, label: 'Usuários e Permissões', desc: 'Gerenciar acesso da equipe' },
    { icon: Bell, label: 'Notificações', desc: 'Configurar alertas e canais' },
    { icon: Shield, label: 'Segurança', desc: 'Autenticação e auditoria' },
    { icon: Database, label: 'Integrações', desc: 'HeadCargo, Outlook, Siscarga' },
    { icon: Settings, label: 'Preferências', desc: 'Idioma, fuso horário, tema' },
  ];

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="w-6 h-6 text-text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Configurações</h1>
            <p className="text-sm text-text-secondary mt-0.5">
              Gerenciar configurações da plataforma
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {sections.map((s) => (
            <div key={s.label} className="card-hover">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                    <s.icon className="w-5 h-5 text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{s.label}</p>
                    <p className="text-xs text-text-tertiary">{s.desc}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-text-tertiary" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
