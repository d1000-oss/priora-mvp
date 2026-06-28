import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, ArrowRight, Shield, Sparkles } from 'lucide-react';
import { useState } from 'react';

export function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (role: 'operacional' | 'cliente') => {
    if (role === 'operacional') {
      navigate('/app/inicio');
    } else {
      navigate('/cliente/liberacao');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-white flex-col justify-between p-12 overflow-hidden">
        {/* Abstract logistics background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 640 900" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Container silhouettes - bottom area */}
            <rect x="60" y="680" width="90" height="55" rx="3" stroke="#0a1628" strokeWidth="1" opacity="0.04"/>
            <rect x="158" y="680" width="90" height="55" rx="3" stroke="#0a1628" strokeWidth="1" opacity="0.04"/>
            <rect x="256" y="680" width="90" height="55" rx="3" stroke="#0a1628" strokeWidth="1" opacity="0.04"/>
            <rect x="354" y="680" width="90" height="55" rx="3" stroke="#0a1628" strokeWidth="1" opacity="0.04"/>
            <rect x="60" y="624" width="90" height="55" rx="3" stroke="#0a1628" strokeWidth="1" opacity="0.03"/>
            <rect x="158" y="624" width="90" height="55" rx="3" stroke="#0a1628" strokeWidth="1" opacity="0.03"/>
            <rect x="256" y="624" width="90" height="55" rx="3" stroke="#0a1628" strokeWidth="1" opacity="0.03"/>
            <rect x="354" y="624" width="90" height="55" rx="3" stroke="#0a1628" strokeWidth="1" opacity="0.03"/>
            {/* Horizon / sea wave lines */}
            <path d="M0,760 Q160,748 320,755 T640,750" stroke="#0a1628" strokeWidth="1" opacity="0.05"/>
            <path d="M0,775 Q180,763 360,770 T640,765" stroke="#0a1628" strokeWidth="0.8" opacity="0.04"/>
            <path d="M0,790 Q200,780 400,785 T640,782" stroke="#0a1628" strokeWidth="0.6" opacity="0.03"/>
            {/* Ship hull silhouette */}
            <path d="M80,640 L560,640 L580,660 L60,660 Z" stroke="#0a1628" strokeWidth="1" opacity="0.04" fill="none"/>
            {/* Crane arm */}
            <line x1="460" y1="440" x2="460" y2="640" stroke="#0a1628" strokeWidth="1.5" opacity="0.04"/>
            <line x1="360" y1="440" x2="560" y2="440" stroke="#0a1628" strokeWidth="1.5" opacity="0.04"/>
            <line x1="460" y1="440" x2="420" y2="380" stroke="#0a1628" strokeWidth="1" opacity="0.03"/>
            <line x1="460" y1="520" x2="430" y2="570" stroke="#0a1628" strokeWidth="0.8" opacity="0.03" strokeDasharray="3 3"/>
            <line x1="460" y1="520" x2="490" y2="570" stroke="#0a1628" strokeWidth="0.8" opacity="0.03" strokeDasharray="3 3"/>
            {/* Route path dots */}
            <circle cx="160" cy="300" r="3" fill="#7c6ff7" opacity="0.08"/>
            <circle cx="300" cy="240" r="3" fill="#7c6ff7" opacity="0.08"/>
            <circle cx="440" cy="280" r="3" fill="#7c6ff7" opacity="0.08"/>
            <circle cx="520" cy="220" r="2" fill="#7c6ff7" opacity="0.06"/>
            <path d="M160,300 Q230,260 300,240 Q370,220 440,280 Q480,250 520,220" stroke="#7c6ff7" strokeWidth="1" strokeDasharray="4 5" opacity="0.07" fill="none"/>
            {/* Large faint circle — anchor visual */}
            <circle cx="320" cy="500" r="220" stroke="#0a1628" strokeWidth="1" opacity="0.025"/>
            <circle cx="320" cy="500" r="170" stroke="#0a1628" strokeWidth="0.8" opacity="0.02"/>
          </svg>
        </div>

        {/* Logo — 2× larger */}
        <div className="relative z-10">
          <img src="/assets/images/image.png" alt="Priora" className="h-28 w-auto" />
        </div>

        {/* Clara greeting card */}
        <div className="relative z-10 max-w-sm">
          <div className="bg-navy-900/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-priora-400 to-priora-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-white font-semibold text-sm">Clara</span>
                <span className="ml-2 px-1.5 py-0.5 bg-priora-600 text-[10px] font-bold text-white rounded">IA</span>
              </div>
            </div>
            <p className="text-white/90 text-sm leading-relaxed">Olá, Carlos.</p>
            <div className="mt-2 pl-3 border-l-2 border-priora-500">
              <p className="text-white/80 text-sm">Separei o que é importante.</p>
              <p className="text-white/80 text-sm">O resto pode esperar.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-xs text-text-tertiary">&copy; 2025 Priora. Todos os direitos reservados.</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10">
            <img src="/assets/images/image.png" alt="Priora" className="h-14 w-auto" />
          </div>

          <h2 className="text-4xl font-bold text-text-primary mb-2">
            Bem-vindo<span className="text-priora-600">.</span>
          </h2>
          <p className="text-text-secondary text-base mb-10">Entre para continuar.</p>

          {/* Email field */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-text-primary mb-2">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
              <input
                type="email"
                placeholder="seu.email@empresa.com"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-priora-200 focus:border-priora-400 transition-all"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-text-primary mb-2">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha"
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-priora-200 focus:border-priora-400 transition-all"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between mb-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="w-5 h-5 rounded bg-priora-600 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm text-text-primary">Lembrar de mim</span>
            </label>
            <button className="text-sm text-priora-600 font-medium hover:text-priora-700 transition-colors">
              Esqueci minha senha
            </button>
          </div>

          {/* Login buttons - prototype access */}
          <div className="space-y-3">
            <button
              onClick={() => handleLogin('operacional')}
              className="w-full flex items-center justify-center gap-3 py-4 bg-navy-900 text-white text-base font-semibold rounded-2xl hover:bg-navy-800 transition-all duration-200 group"
            >
              <span>Entrar como Operacional</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleLogin('cliente')}
              className="w-full flex items-center justify-center gap-3 py-4 bg-white text-navy-900 text-base font-semibold rounded-2xl border-2 border-gray-200 hover:border-priora-300 hover:bg-priora-50/50 transition-all duration-200 group"
            >
              <span>Entrar como Cliente</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Security badge */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 text-center">
              <p className="text-sm text-text-tertiary">Ambiente seguro e confiável</p>
            </div>
            <div className="flex items-center justify-center gap-2 mt-3">
              <Shield className="w-5 h-5 text-priora-500" />
              <p className="text-xs text-text-secondary">
                Seus dados estão protegidos com segurança de ponta.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
