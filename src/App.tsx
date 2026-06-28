import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalStateProvider } from './context/GlobalState';
import { LoginPage } from './pages/LoginPage';
import { InternalLayout } from './layouts/InternalLayout';
import { ClientLayout } from './layouts/ClientLayout';
import { InicioPage } from './pages/internal/InicioPage';
import { DecisoesPage } from './pages/internal/DecisoesPage';
import { ProcessosPage } from './pages/internal/ProcessosPage';
import { ProcessoDetailPage } from './pages/internal/ProcessoDetailPage';
import { LiberacaoPage } from './pages/internal/LiberacaoPage';
import { CouriersPage } from './pages/internal/CouriersPage';
import { DemurragePage } from './pages/internal/DemurragePage';
import { GestaoExigemAtencaoPage } from './pages/internal/GestaoExigemAtencaoPage';
import { GestaoEquipePage } from './pages/internal/GestaoEquipePage';
import { GestaoRelatoriosPage } from './pages/internal/GestaoRelatoriosPage';
import { ConfiguracoesPage } from './pages/internal/ConfiguracoesPage';
import { ClienteLiberacaoPage } from './pages/client/ClienteLiberacaoPage';
import { ClienteDemurragePage } from './pages/client/ClienteDemurragePage';
import { ClienteRetiradaPage } from './pages/client/ClienteRetiradaPage';
import { ClienteFeedbackPage } from './pages/client/ClienteFeedbackPage';

function App() {
  return (
    <GlobalStateProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route path="/app" element={<InternalLayout />}>
            <Route index element={<Navigate to="/app/inicio" replace />} />
            <Route path="inicio" element={<InicioPage />} />
            <Route path="decisoes" element={<DecisoesPage />} />
            <Route path="processos" element={<ProcessosPage />} />
            <Route path="processos/:id" element={<ProcessoDetailPage />} />
            <Route path="liberacao" element={<LiberacaoPage />} />
            <Route path="couriers" element={<CouriersPage />} />
            <Route path="demurrage" element={<DemurragePage />} />
            <Route path="gestao" element={<Navigate to="/app/gestao/exigem-atencao" replace />} />
            <Route path="gestao/exigem-atencao" element={<GestaoExigemAtencaoPage />} />
            <Route path="gestao/equipe" element={<GestaoEquipePage />} />
            <Route path="gestao/relatorios" element={<GestaoRelatoriosPage />} />
            <Route path="configuracoes" element={<ConfiguracoesPage />} />
          </Route>

          <Route path="/cliente" element={<ClientLayout />}>
            <Route index element={<Navigate to="/cliente/liberacao" replace />} />
            <Route path="liberacao" element={<ClienteLiberacaoPage />} />
            <Route path="demurrage" element={<ClienteDemurragePage />} />
            <Route path="retirada" element={<ClienteRetiradaPage />} />
            <Route path="feedback" element={<ClienteFeedbackPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </GlobalStateProvider>
  );
}

export default App;
