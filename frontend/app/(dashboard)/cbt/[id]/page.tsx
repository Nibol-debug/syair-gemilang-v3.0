'use client';

import React, { useEffect, useState, use } from 'react';
import { apiRequest } from '@/lib/api';
import { 
  Plus, 
  Trash2, 
  ChevronLeft, 
  Save, 
  CheckSquare, 
  Type, 
  Loader2,
  AlertCircle,
  GripVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function ExamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [exam, setExam] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Question Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    type: 'mcq',
    question_text: '',
    difficulty: 'medium',
    options: [
      { option_text: '', is_correct: false },
      { option_text: '', is_correct: false },
      { option_text: '', is_correct: false },
      { option_text: '', is_correct: false },
    ]
  });

  const fetchExam = async () => {
    try {
      const response = await apiRequest(`/exams/${id}`);
      setExam(response);
    } catch (err) {
      console.error('Failed to fetch exam', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && id) {
      fetchExam();
    }
  }, [id]);

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiRequest(`/exams/${id}/questions`, {
        method: 'POST',
        body: JSON.stringify(newQuestion)
      });
      fetchExam();
      setShowAddForm(false);
      setNewQuestion({
        type: 'mcq',
        question_text: '',
        difficulty: 'medium',
        options: [
          { option_text: '', is_correct: false },
          { option_text: '', is_correct: false },
          { option_text: '', is_correct: false },
          { option_text: '', is_correct: false },
        ]
      });
    } catch (err: any) {
      alert('Gagal menambah soal: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Hapus soal ini?')) return;
    try {
      await apiRequest(`/exams/questions/${questionId}`, {
        method: 'DELETE'
      });
      fetchExam();
    } catch (err: any) {
      alert('Gagal menghapus soal: ' + err.message);
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-on-surface-variant font-medium">Memuat Detail Ujian...</p>
    </div>
  );

  if (!exam) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <AlertCircle className="w-10 h-10 text-error" />
      <p className="text-on-surface-variant font-medium">Ujian tidak ditemukan.</p>
      <Link href="/cbt" className="text-primary hover:underline font-bold mt-2">Kembali ke Daftar</Link>
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4">
        <Link href="/cbt" className="p-2 hover:bg-surface-container rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6 text-on-surface" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">{exam.title}</h2>
          <p className="text-on-surface-variant font-medium mt-1 uppercase tracking-wider text-xs">
            {exam.subject?.name} • {exam.major?.name} • {exam.duration} Menit
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-on-surface">Daftar Soal ({exam.questions?.length || 0})</h3>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-bold hover:opacity-90 transition-opacity active:scale-95 shadow-md"
            >
              {showAddForm ? <Trash2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{showAddForm ? 'Batal Tambah' : 'Tambah Soal'}</span>
            </button>
          </div>

          {showAddForm && (
            <div className="bg-surface-container-lowest border-2 border-primary/20 rounded-2xl p-8 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
              <form onSubmit={handleAddQuestion} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tipe Soal</label>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => setNewQuestion({...newQuestion, type: 'mcq'})}
                        className={cn(
                          "flex-1 py-2.5 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all",
                          newQuestion.type === 'mcq' ? "bg-primary text-on-primary border-primary" : "bg-surface text-on-surface-variant border-outline-variant hover:bg-surface-container"
                        )}
                      >
                        <CheckSquare className="w-4 h-4" />
                        Pilihan Ganda
                      </button>
                      <button 
                        type="button"
                        onClick={() => setNewQuestion({...newQuestion, type: 'essay'})}
                        className={cn(
                          "flex-1 py-2.5 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all",
                          newQuestion.type === 'essay' ? "bg-primary text-on-primary border-primary" : "bg-surface text-on-surface-variant border-outline-variant hover:bg-surface-container"
                        )}
                      >
                        <Type className="w-4 h-4" />
                        Essay
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tingkat Kesulitan</label>
                    <select 
                      value={newQuestion.difficulty}
                      onChange={e => setNewQuestion({...newQuestion, difficulty: e.target.value})}
                      className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    >
                      <option value="easy">Mudah</option>
                      <option value="medium">Sedang</option>
                      <option value="hard">Sulit</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Teks Pertanyaan</label>
                  <textarea 
                    required
                    value={newQuestion.question_text}
                    onChange={e => setNewQuestion({...newQuestion, question_text: e.target.value})}
                    placeholder="Masukkan pertanyaan di sini..."
                    rows={4}
                    className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  />
                </div>

                {newQuestion.type === 'mcq' && (
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Opsi Jawaban (Centang yang Benar)</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {newQuestion.options.map((opt, idx) => (
                        <div key={idx} className="flex gap-3">
                          <input 
                            type="checkbox"
                            checked={opt.is_correct}
                            onChange={e => {
                              const newOpts = [...newQuestion.options];
                              newOpts[idx].is_correct = e.target.checked;
                              setNewQuestion({...newQuestion, options: newOpts});
                            }}
                            className="w-5 h-5 mt-2 rounded border-outline-variant text-primary focus:ring-primary"
                          />
                          <input 
                            type="text"
                            required={newQuestion.type === 'mcq'}
                            value={opt.option_text}
                            onChange={e => {
                              const newOpts = [...newQuestion.options];
                              newOpts[idx].option_text = e.target.value;
                              setNewQuestion({...newQuestion, options: newOpts});
                            }}
                            placeholder={`Opsi ${String.fromCharCode(65 + idx)}`}
                            className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-4">
                   <button 
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-on-primary font-bold hover:opacity-95 transition-all active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    <span>Simpan Soal</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-4">
            {exam.questions?.length === 0 ? (
              <div className="bg-surface-container-low/30 border-2 border-dashed border-outline-variant rounded-2xl p-12 text-center">
                <p className="text-on-surface-variant font-medium">Belum ada soal dalam ujian ini.</p>
                <button onClick={() => setShowAddForm(true)} className="text-primary font-bold mt-2 hover:underline">Tambah soal pertama Anda</button>
              </div>
            ) : (
              exam.questions.map((q: any, idx: number) => (
                <div key={q.id} className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden group hover:border-primary/30 transition-all">
                  <div className="p-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex gap-4">
                         <div className="text-xs font-black text-outline uppercase tracking-widest mt-1">
                           #{idx + 1}
                         </div>
                         <div>
                            <div className="flex items-center gap-3 mb-2">
                               <span className={cn(
                                 "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border",
                                 q.type === 'mcq' ? "bg-secondary-container/20 text-secondary border-secondary/10" : "bg-tertiary-container/20 text-tertiary border-tertiary/10"
                               )}>
                                 {q.type === 'mcq' ? 'Pilihan Ganda' : 'Essay'}
                               </span>
                               <span className={cn(
                                 "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border",
                                 q.difficulty === 'easy' ? "bg-success-container/30 text-success border-success/10" :
                                 q.difficulty === 'hard' ? "bg-error-container/20 text-error border-error/10" :
                                 "bg-primary-container/20 text-primary border-primary/10"
                               )}>
                                 {q.difficulty}
                               </span>
                            </div>
                            <p className="text-on-surface font-semibold leading-relaxed whitespace-pre-wrap">{q.question_text}</p>
                         </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/30 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                        <div className="p-2 text-outline cursor-grab active:cursor-grabbing">
                          <GripVertical className="w-4.5 h-4.5" />
                        </div>
                      </div>
                    </div>

                    {q.type === 'mcq' && q.options && (
                      <div className="mt-6 ml-8 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {q.options.map((opt: any, oIdx: number) => (
                          <div 
                            key={opt.id} 
                            className={cn(
                              "p-3 rounded-xl border flex items-center gap-3 text-sm font-medium transition-all",
                              opt.is_correct ? "bg-success-container/20 border-success/30 text-success" : "bg-surface border-outline-variant/50 text-on-surface-variant"
                            )}
                          >
                            <span className={cn(
                              "w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black uppercase",
                              opt.is_correct ? "bg-success text-on-success" : "bg-outline-variant/30 text-outline"
                            )}>
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            {opt.option_text}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-on-surface mb-6">Informasi Ujian</h3>
            <div className="space-y-5">
              <InfoItem label="Mata Pelajaran" value={exam.subject?.name} />
              <InfoItem label="Jurusan" value={exam.major?.name} />
              <InfoItem label="Durasi" value={`${exam.duration} Menit`} />
              <InfoItem label="Token Ujian" value={exam.token} isCode />
              <InfoItem label="Waktu Mulai" value={new Date(exam.start_time).toLocaleString()} />
              <InfoItem label="Waktu Selesai" value={new Date(exam.end_time).toLocaleString()} />
            </div>
          </div>
          
          <div className="bg-secondary-container/20 border border-secondary/10 rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-on-secondary-container mb-2">Tips Bank Soal</h3>
            <p className="text-sm text-on-secondary-container/70 leading-relaxed font-medium">
              Gunakan tipe soal bervariasi untuk menguji pemahaman siswa. Anda juga bisa mengatur tingkat kesulitan soal untuk analisis distribusi nilai yang lebih baik.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, isCode }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-black text-outline uppercase tracking-[0.2em]">{label}</span>
      <span className={cn(
        "text-sm font-bold text-on-surface",
        isCode && "font-mono text-primary text-base"
      )}>{value}</span>
    </div>
  );
}
