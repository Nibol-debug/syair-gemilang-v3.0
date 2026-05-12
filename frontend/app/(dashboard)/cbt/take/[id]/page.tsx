'use client';

import React, { useEffect, useState, use } from 'react';
import { apiRequest } from '@/lib/api';
import { 
  Loader2,
  AlertCircle,
  Clock,
  Send,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ArrowRight,
  Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function TakeExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [exam, setExam] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [warnings, setWarnings] = useState(0);
  const WARNING_LIMIT = 3;

  const fetchExamInfo = async () => {
    try {
      const examData = await apiRequest(`/exams/${id}`);
      setExam(examData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && id) {
      fetchExamInfo();
    }
  }, [id]);

  useEffect(() => {
    if (session && timeLeft > 0) {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          handleViolation('tab_switch', 'Jangan berpindah tab browser saat ujian!');
        }
      };

      const handleBlur = () => {
        handleViolation('window_blur', 'Jangan meninggalkan jendela ujian!');
      };

      const handleFullscreenChange = () => {
        if (!document.fullscreenElement) {
          handleViolation('exit_fullscreen', 'Ujian harus dalam mode Layar Penuh (Fullscreen)!');
        }
      };

      window.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('blur', handleBlur);
      document.addEventListener('fullscreenchange', handleFullscreenChange);

      return () => {
        window.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('blur', handleBlur);
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
      };
    }
  }, [session, timeLeft, warnings]);

  const handleViolation = async (type: string, message: string) => {
    if (!session || isSubmitting) return;
    
    const newWarnings = warnings + 1;
    setWarnings(newWarnings);
    
    // Log to backend
    logViolation(type);

    if (newWarnings >= WARNING_LIMIT) {
      alert(`DISKUALIFIKASI: Anda telah melanggar aturan ujian sebanyak ${WARNING_LIMIT} kali. Ujian akan dikumpulkan otomatis.`);
      forceSubmitExam();
    } else {
      alert(`PERINGATAN (${newWarnings}/${WARNING_LIMIT}): ${message}\n\nJika mencapai ${WARNING_LIMIT} kali, ujian akan dikumpulkan otomatis!`);
      
      // Try to re-enforce fullscreen if they exited
      if (type === 'exit_fullscreen') {
        try {
          await document.documentElement.requestFullscreen();
        } catch (err) {
          console.error('Failed to re-enforce fullscreen');
        }
      }
    }
  };

  const logViolation = async (type: string) => {
    if (!session) return;
    try {
      await apiRequest(`/exams/sessions/${session.id}/log`, {
        method: 'POST',
        body: JSON.stringify({ type })
      });
    } catch (err) {
      console.error('Failed to log violation', err);
    }
  };

  const forceSubmitExam = async () => {
    setIsSubmitting(true);
    try {
      await apiRequest(`/exams/sessions/${session.id}/submit`, {
        method: 'POST'
      });
      router.push('/cbt');
    } catch (err: any) {
      console.error('Failed to auto-submit', err);
      router.push('/cbt');
    }
  };

  const handleStartExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsStarting(true);
    setError('');
    try {
      // Request Fullscreen
      try {
        await document.documentElement.requestFullscreen();
      } catch (err) {
        console.warn('Fullscreen request denied or failed');
      }

      const sessionData = await apiRequest(`/exams/${id}/start`, {
        method: 'POST',
        body: JSON.stringify({ token, device_id: navigator.userAgent })
      });
      setSession(sessionData);
      
      const questionsData = await apiRequest(`/exams/${id}/questions`);
      setQuestions(questionsData);
      
      // Calculate time left
      const duration = exam.duration * 60; // seconds
      const elapsed = (new Date().getTime() - new Date(sessionData.start_time).getTime()) / 1000;
      setTimeLeft(Math.max(0, duration - elapsed));
      
      // Load existing answers if resuming
      if (sessionData.answers) {
        const loadedAnswers: Record<string, string> = {};
        sessionData.answers.forEach((a: any) => {
          loadedAnswers[a.question_id] = a.answer;
        });
        setAnswers(loadedAnswers);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsStarting(false);
    }
  };

  const handleSelectOption = async (questionId: string, optionText: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionText }));
    try {
      await apiRequest(`/exams/sessions/${session.id}/answers`, {
        method: 'POST',
        body: JSON.stringify({ question_id: questionId, answer: optionText })
      });
    } catch (err) {
      console.error('Failed to save answer', err);
    }
  };

  const handleSubmitExam = async () => {
    if (timeLeft > 0 && !confirm('Yakin ingin mengakhiri ujian sekarang?')) return;
    
    setIsSubmitting(true);
    try {
      await apiRequest(`/exams/sessions/${session.id}/submit`, {
        method: 'POST'
      });
      alert('Ujian berhasil dikumpulkan!');
      router.push('/cbt');
    } catch (err: any) {
      alert('Gagal mengumpulkan ujian: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (isLoading) return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <p className="text-on-surface-variant font-bold uppercase tracking-widest text-sm">Menyiapkan Lembar Ujian...</p>
    </div>
  );

  if (!session) return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-10 max-w-md w-full shadow-2xl space-y-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-on-surface tracking-tight">Konfirmasi Token</h2>
          <p className="text-sm font-medium text-on-surface-variant">
            Silakan masukkan token ujian untuk memulai <strong>{exam?.title}</strong>.
          </p>
        </div>

        {error && (
          <div className="bg-error-container/20 border border-error/20 p-4 rounded-xl flex gap-3 text-error text-sm font-bold animate-shake">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleStartExam} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em]">Token Ujian</label>
            <input 
              type="text" 
              required
              value={token}
              onChange={e => setToken(e.target.value.toUpperCase())}
              placeholder="ABCD-123"
              className="w-full px-6 py-4 bg-surface-container border-2 border-outline-variant rounded-2xl text-center text-2xl font-black text-primary tracking-[0.3em] focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
            />
          </div>
          
          <div className="p-4 bg-surface-container-high rounded-2xl flex gap-3">
             <Monitor className="w-5 h-5 text-outline-variant flex-shrink-0" />
             <p className="text-[10px] font-bold text-on-surface-variant uppercase leading-relaxed tracking-wider">
               Perangkat Anda akan dicatat. Pastikan koneksi internet stabil selama ujian berlangsung.
             </p>
          </div>

          <button 
            disabled={isStarting}
            className="w-full bg-primary text-on-primary py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:opacity-95 transition-all active:scale-[0.98] shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
          >
            {isStarting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
            Mulai Ujian Sekarang
          </button>
        </form>
      </div>
    </div>
  );

  const currentQuestion = questions[currentQuestionIdx];

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Exam Header */}
      <header className="bg-surface-container-lowest border-b border-outline-variant px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-6">
           <div>
             <h1 className="text-lg font-black text-on-surface tracking-tight">{exam.title}</h1>
             <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{exam.subject?.name}</p>
           </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-outline uppercase tracking-widest mb-1">Sisa Waktu</span>
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-mono text-xl font-black",
              timeLeft < 300 ? "bg-error-container/20 text-error border-error/20 animate-pulse" : "bg-surface-container-high text-on-surface border-outline-variant"
            )}>
              <Clock className="w-5 h-5" />
              {formatTime(timeLeft)}
            </div>
          </div>
          
          <button 
            onClick={handleSubmitExam}
            disabled={isSubmitting}
            className="bg-primary text-on-primary px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-95 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Kumpulkan
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-8 grid grid-cols-12 gap-10">
        {/* Left: Question Navigation */}
        <aside className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
            <h3 className="text-[10px] font-black text-outline uppercase tracking-[0.2em] mb-4">Navigasi Soal</h3>
            <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-2">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIdx(idx)}
                  className={cn(
                    "w-full aspect-square rounded-lg flex items-center justify-center text-xs font-black transition-all",
                    currentQuestionIdx === idx ? "bg-primary text-on-primary ring-4 ring-primary/20 scale-110" :
                    answers[q.id] ? "bg-secondary text-on-secondary" : "bg-surface-container-high text-on-surface-variant hover:bg-outline-variant/30"
                  )}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30">
             <div className="flex justify-between items-center mb-2">
               <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Progres</span>
               <span className="text-xs font-black text-primary">{Math.round((Object.keys(answers).length / questions.length) * 100)}%</span>
             </div>
             <div className="h-2 bg-surface rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500" 
                  style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
                />
             </div>
          </div>
        </aside>

        {/* Center: Question Content */}
        <section className="col-span-12 lg:col-span-9 space-y-8">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-10 shadow-sm min-h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-8">
               <span className="px-4 py-1.5 rounded-full bg-surface-container-high text-[10px] font-black uppercase tracking-widest text-on-surface-variant border border-outline-variant/30">
                 Pertanyaan {currentQuestionIdx + 1} dari {questions.length}
               </span>
               <span className="text-[10px] font-black uppercase tracking-widest text-outline">
                 Kesulitan: {currentQuestion?.difficulty}
               </span>
            </div>

            <div className="flex-1 space-y-10">
               <h2 className="text-xl font-bold text-on-surface leading-relaxed whitespace-pre-wrap">
                 {currentQuestion?.question_text}
               </h2>

               <div className="grid grid-cols-1 gap-3">
                  {currentQuestion?.options?.map((opt: any, idx: number) => (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(currentQuestion.id, opt.option_text)}
                      className={cn(
                        "w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all group",
                        answers[currentQuestion.id] === opt.option_text 
                          ? "bg-primary/5 border-primary ring-2 ring-primary/10" 
                          : "bg-surface border-outline-variant/50 hover:border-outline-variant hover:bg-surface-container-low"
                      )}
                    >
                      <span className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black transition-all",
                        answers[currentQuestion.id] === opt.option_text 
                          ? "bg-primary text-on-primary shadow-lg shadow-primary/20" 
                          : "bg-surface-container-high text-outline group-hover:text-on-surface-variant"
                      )}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className={cn(
                        "text-base font-semibold",
                        answers[currentQuestion.id] === opt.option_text ? "text-primary" : "text-on-surface-variant group-hover:text-on-surface"
                      )}>
                        {opt.option_text}
                      </span>
                    </button>
                  ))}
               </div>
            </div>

            <div className="flex justify-between items-center mt-12 pt-8 border-t border-outline-variant/30">
               <button
                 disabled={currentQuestionIdx === 0}
                 onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                 className="flex items-center gap-2 px-6 py-3 rounded-xl border border-outline-variant font-bold text-sm text-on-surface-variant hover:bg-surface-container transition-all disabled:opacity-30"
               >
                 <ArrowLeft className="w-4 h-4" />
                 Sebelumnya
               </button>
               
               {currentQuestionIdx < questions.length - 1 ? (
                 <button
                   onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                   className="flex items-center gap-2 px-8 py-3 rounded-xl bg-surface-container-high font-bold text-sm text-on-surface hover:bg-outline-variant/30 transition-all shadow-sm"
                 >
                   Selanjutnya
                   <ArrowRight className="w-4 h-4" />
                 </button>
               ) : (
                 <button
                   onClick={handleSubmitExam}
                   className="flex items-center gap-2 px-8 py-3 rounded-xl bg-success text-on-success font-bold text-sm hover:opacity-95 transition-all shadow-lg shadow-success/20"
                 >
                   <Send className="w-4 h-4" />
                   Selesai & Kumpulkan
                 </button>
               )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
