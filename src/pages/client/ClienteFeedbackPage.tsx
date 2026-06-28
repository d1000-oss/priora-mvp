import { useState } from 'react';
import { Toast } from '../../components/Toast';
import { useGlobalState } from '../../context/GlobalState';
import {
  Star,
  Send,
  Ship,
  Shield,
  Smile,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  Paperclip,
  X,
  Clock,
} from 'lucide-react';

type FeedbackCategory = 'elogio' | 'sugestao' | 'reclamacao' | 'duvida';

const categories: { id: FeedbackCategory; label: string; icon: typeof Smile }[] = [
  { id: 'elogio', label: 'Elogio', icon: Smile },
  { id: 'sugestao', label: 'Sugestão', icon: Lightbulb },
  { id: 'reclamacao', label: 'Reclamação', icon: AlertTriangle },
  { id: 'duvida', label: 'Dúvida', icon: HelpCircle },
];

export function ClienteFeedbackPage() {
  const { addEvent } = useGlobalState();
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [category, setCategory] = useState<FeedbackCategory | null>(null);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<{ name: string; size: string } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const handleSubmit = () => {
    if (rating === 0 && !category) return;

    const categoryLabel = category
      ? categories.find((c) => c.id === category)?.label
      : '';

    addEvent({
      type: 'feedback_enviado',
      processoCodigo: 'IM2591',
      cliente: 'BRA TRADE',
      descricao: `Novo feedback recebido — ${rating} estrela${rating !== 1 ? 's' : ''}${categoryLabel ? ` — ${categoryLabel}` : ''}`,
    });

    setToast({ visible: true, message: 'Feedback enviado com sucesso.' });
    setTimeout(() => setSubmitted(true), 300);
  };

  const handleFileSelect = () => {
    setFile({ name: 'feedback_anexo.pdf', size: '245 KB' });
  };

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Journey Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-priora-500" />
                <span className="text-base font-bold text-text-primary">Shanghai</span>
              </div>
              <p className="text-xs text-text-tertiary">ETD: 06/05</p>
            </div>

            <div className="flex-1 flex items-center mx-6 relative">
              <div className="w-full border-t-2 border-dashed border-priora-200" />
              <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2">
                <div className="w-12 h-12 rounded-full bg-priora-50 border-2 border-priora-200 flex items-center justify-center">
                  <Ship className="w-5 h-5 text-priora-600" />
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base font-bold text-text-primary">Navegantes</span>
                <span className="w-2.5 h-2.5 rounded-full bg-priora-500" />
              </div>
              <p className="text-xs text-text-tertiary">ETA: 29/07</p>
            </div>
          </div>
          <p className="text-center text-sm text-text-tertiary mt-4">
            Navio: CMA CGM KRYPTON
          </p>
        </div>

        {!submitted ? (
          <>
            {/* Priora Assistant + Form Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              {/* Priora greeting */}
              <div className="flex items-start gap-5 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-priora-100 to-priora-50 flex items-center justify-center flex-shrink-0 border border-priora-100">
                  <div className="w-10 h-10 rounded-xl bg-priora-600 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-text-primary mb-2">Priora</h2>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Olá, equipe <span className="font-bold text-priora-700">BRA TRADE</span>.
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed mt-1">
                    Gostaríamos de saber como foi sua experiência.
                  </p>
                </div>
              </div>

              {/* Section 1 - Rating */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-text-primary mb-4">
                  <span className="text-text-tertiary mr-1.5">1.</span>
                  Como você avalia sua experiência?
                </h3>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="p-0.5 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-10 h-10 transition-all duration-150 ${
                          star <= (hoveredStar || rating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 2 - Category */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-text-primary mb-4">
                  <span className="text-text-tertiary mr-1.5">2.</span>
                  O que melhor descreve seu feedback?
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categories.map((cat) => {
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setCategory(isSelected ? null : cat.id)}
                        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                          isSelected
                            ? 'border-priora-500 bg-priora-50/50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <cat.icon className={`w-4 h-4 flex-shrink-0 ${
                          isSelected ? 'text-priora-600' : 'text-text-tertiary'
                        }`} />
                        <span className="text-sm font-medium text-text-primary">{cat.label}</span>
                        <div className={`ml-auto w-4 h-4 rounded border-2 flex items-center justify-center ${
                          isSelected ? 'border-priora-500 bg-priora-500' : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 3 - Message */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-text-primary mb-4">
                  <span className="text-text-tertiary mr-1.5">3.</span>
                  Conte-nos mais <span className="font-normal text-text-tertiary">(opcional)</span>
                </h3>
                <div className="relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                    placeholder="Compartilhe mais detalhes sobre sua experiência..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-priora-100 focus:border-priora-400 resize-none h-32 transition-all"
                  />
                  <span className="absolute bottom-3 right-3 text-xs text-text-tertiary">
                    {message.length}/500
                  </span>
                </div>
              </div>

              {/* Section 4 - File Attachment */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-text-primary mb-4">
                  <span className="text-text-tertiary mr-1.5">4.</span>
                  Anexar arquivo <span className="font-normal text-text-tertiary">(opcional)</span>
                </h3>
                {!file ? (
                  <button
                    onClick={handleFileSelect}
                    className="w-full border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-priora-300 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <Paperclip className="w-5 h-5 text-text-tertiary group-hover:text-priora-500 transition-colors" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-text-primary">
                          Clique para anexar ou arraste o arquivo aqui
                        </p>
                        <p className="text-xs text-text-tertiary">PDF, JPG, PNG (máx. 10MB)</p>
                      </div>
                    </div>
                  </button>
                ) : (
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <Paperclip className="w-4 h-4 text-priora-600" />
                      <div>
                        <p className="text-sm font-medium text-text-primary">{file.name}</p>
                        <p className="text-xs text-text-tertiary">{file.size}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="w-7 h-7 rounded-lg hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4 text-text-tertiary" />
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={rating === 0 && !category}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-priora-600 text-white text-base font-semibold rounded-xl hover:bg-priora-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-priora-600/20"
              >
                <Send className="w-4 h-4" />
                Enviar Feedback
              </button>
            </div>

            {/* Footer message */}
            <div className="flex items-center justify-center gap-2 py-2">
              <Clock className="w-4 h-4 text-text-tertiary" />
              <p className="text-sm text-text-tertiary">
                Todas as mensagens são analisadas pela nossa equipe.
              </p>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-5">
              <Star className="w-8 h-8 text-success-500 fill-success-500" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Obrigado pelo seu feedback.</h3>
            <p className="text-sm text-text-secondary mb-6">
              Sua mensagem foi encaminhada para nossa equipe.
            </p>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-success-50 text-success-700 text-sm font-semibold rounded-xl border border-success-200">
              <Star className="w-4 h-4 fill-success-500" />
              Feedback registrado
            </span>
          </div>
        )}
      </div>

      <Toast message={toast.message} visible={toast.visible} onClose={() => setToast({ visible: false, message: '' })} />
    </div>
  );
}
