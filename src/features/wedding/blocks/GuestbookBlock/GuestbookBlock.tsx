'use client';

import { useState, useEffect, useCallback } from 'react';
import { Block } from '@/shared/types/block';
import { GuestbookEntry } from '@/shared/types/guestbook';

interface GuestbookBlockProps {
  block: Block;
  projectId: string;
}

type LoadResponse = { entries: GuestbookEntry[] };
type CreateResponse = { entry: GuestbookEntry };
type UpdateResponse = { entry: GuestbookEntry };

export default function GuestbookBlock({ block, projectId }: GuestbookBlockProps) {
  const apiBase = `/api/projects/${projectId}/guestbook`;
  const { variant = 'simple', color } = block.styles || {};

  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [authorName, setAuthorName] = useState('');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [editId, setEditId] = useState<string | null>(null);
  const [editMessage, setEditMessage] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Variant Config
  const getVariantStyles = () => {
    switch (variant) {
      case 'card':
        return {
          container: 'space-y-4',
          entry: 'rounded-xl bg-white p-5 shadow-sm border border-stone-100',
          header: 'flex items-center justify-between mb-3 border-b border-stone-100 pb-2',
          author: 'font-semibold text-stone-800',
          date: 'text-xs text-stone-400',
          message: 'text-stone-600 leading-relaxed',
          actions: 'text-xs text-stone-400 hover:text-stone-600 transition-colors'
        };
      case 'classic':
        return {
          container: 'divide-y divide-stone-200',
          entry: 'py-8 first:pt-0',
          header: 'flex flex-col items-center justify-center mb-4 gap-1',
          author: 'font-serif text-lg text-stone-900 border-b border-stone-800 pb-1 px-4',
          date: 'font-serif text-xs text-stone-500 italic',
          message: 'text-center font-serif text-stone-700 leading-loose px-8',
          actions: 'text-center mt-4 text-xs text-stone-400 underline decoration-stone-300'
        };
      case 'minimal':
        return {
          container: 'space-y-8',
          entry: '',
          header: 'flex items-baseline gap-3 mb-2',
          author: 'font-bold text-black text-sm uppercase tracking-wide',
          date: 'text-[10px] text-gray-400',
          message: 'text-sm text-gray-800 font-light',
          actions: 'text-[10px] text-gray-300 hover:text-black ml-2'
        };
      case 'simple':
      default:
        return {
          container: 'space-y-4',
          entry: 'rounded-lg border border-black/10 p-4 bg-stone-50/30',
          header: 'flex items-start justify-between gap-3 mb-2',
          author: 'text-sm font-medium text-gray-900',
          date: 'text-xs text-gray-500',
          message: 'text-sm text-gray-700 whitespace-pre-wrap',
          actions: 'text-xs underline text-gray-500 hover:text-gray-800'
        };
    }
  };

  const styles = getVariantStyles();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(apiBase, { cache: 'no-store' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || '방명록 조회에 실패했습니다.');
      }
      const data = (await res.json()) as LoadResponse;
      setEntries(data.entries || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : '방명록 조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => {
    load();
  }, [load]);

  async function onCreate() {
    if (!authorName.trim() || !message.trim() || !password.trim()) {
      alert('이름, 메시지, 비밀번호를 모두 입력해주세요.');
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(apiBase, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_name: authorName,
          message,
          password,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || '방명록 작성에 실패했습니다.');
      }

      const data = (await res.json()) as CreateResponse;
      setEntries((prev) => [data.entry, ...prev]);
      setAuthorName('');
      setMessage('');
      setPassword('');
    } catch (e) {
      setError(e instanceof Error ? e.message : '방명록 작성 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(entry: GuestbookEntry) {
    setEditId(entry.id);
    setEditMessage(entry.message);
    setEditPassword('');
  }

  function cancelEdit() {
    setEditId(null);
    setEditMessage('');
    setEditPassword('');
  }

  async function onUpdate(entryId: string) {
    if (!editMessage.trim() || !editPassword.trim()) {
      alert('수정할 내용과 비밀번호를 입력해주세요.');
      return;
    }
    setEditSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${apiBase}/${entryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: editMessage, password: editPassword }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || '방명록 수정에 실패했습니다.');
      }

      const data = (await res.json()) as UpdateResponse;
      setEntries((prev) => prev.map((e) => (e.id === entryId ? data.entry : e)));
      cancelEdit();
    } catch (e) {
      setError(e instanceof Error ? e.message : '방명록 수정 중 오류가 발생했습니다.');
    } finally {
      setEditSubmitting(false);
    }
  }

  async function onDelete(entryId: string) {
    const input = window.prompt('삭제 비밀번호를 입력하세요');
    if (!input) return;

    setError(null);

    try {
      const res = await fetch(`${apiBase}/${entryId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: input }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || '방명록 삭제에 실패했습니다.');
      }

      setEntries((prev) => prev.filter((e) => e.id !== entryId));
      if (editId === entryId) cancelEdit();
    } catch (e) {
      setError(e instanceof Error ? e.message : '방명록 삭제 중 오류가 발생했습니다.');
    }
  }

  return (
    <section className="w-full px-6 py-12" style={{ color }}>
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-8 text-center opacity-80">Guestbook</h2>

        <div className="mb-10 space-y-3 bg-white/50 p-6 rounded-xl border border-stone-100 shadow-sm">
          <div className="flex flex-col gap-2">
            <input
              className="flex-1 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-stone-400 transition-colors"
              placeholder="이름"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              maxLength={30}
            />
            <input
              className="flex-1 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-stone-400 transition-colors"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              maxLength={64}
            />
          </div>
          <textarea
            className="w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm min-h-[100px] resize-none focus:outline-none focus:border-stone-400 transition-colors"
            placeholder="축하의 한마디를 남겨주세요"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
          />
          <button
            className="w-full rounded-md bg-stone-800 text-white px-3 py-3 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 shadow-sm"
            onClick={onCreate}
            disabled={submitting}
            style={{ backgroundColor: color }}
          >
            {submitting ? '등록 중...' : '남기기'}
          </button>

          {error ? <p className="text-sm text-red-600 text-center mt-2">{error}</p> : null}
        </div>

        <div className="mt-8">
          {loading ? (
            <p className="text-sm text-center opacity-50 py-10">불러오는 중...</p>
          ) : entries.length === 0 ? (
            <div className="text-center py-10 opacity-50 text-sm">
              <p>아직 작성된 방명록이 없습니다.</p>
              <p>첫 번째 축하글을 남겨주세요!</p>
            </div>
          ) : (
            <div className={styles.container}>
              {entries.map((entry) => {
                const isEditing = editId === entry.id;
                return (
                  <article key={entry.id} className={styles.entry}>
                    {isEditing ? (
                      <div className="space-y-3 bg-stone-50 p-4 rounded-lg">
                        <textarea
                          className="w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm min-h-[80px]"
                          value={editMessage}
                          onChange={(e) => setEditMessage(e.target.value)}
                          maxLength={500}
                        />
                        <input
                          className="w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm"
                          placeholder="비밀번호 확인"
                          value={editPassword}
                          onChange={(e) => setEditPassword(e.target.value)}
                          type="password"
                          maxLength={64}
                        />
                        <div className="flex gap-2">
                          <button
                            className="flex-1 rounded-md bg-stone-800 text-white px-3 py-2 text-xs"
                            onClick={() => onUpdate(entry.id)}
                            disabled={editSubmitting}
                          >
                            저장
                          </button>
                          <button
                            className="flex-1 rounded-md border border-stone-200 bg-white px-3 py-2 text-xs"
                            onClick={cancelEdit}
                            disabled={editSubmitting}
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className={styles.header}>
                          <div className={variant === 'minimal' ? 'flex items-baseline gap-2' : ''}>
                            <span className={styles.author}>{entry.author_name}</span>
                            <span className={styles.date}>
                              {new Date(entry.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              className={styles.actions}
                              onClick={() => startEdit(entry)}
                            >
                              수정
                            </button>
                            <button
                              className={styles.actions}
                              onClick={() => onDelete(entry.id)}
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                        <p className={styles.message}>{entry.message}</p>
                        
                        {/* Minimal이나 Classic은 하단에 액션 버튼 배치 */}
                        {(variant === 'minimal' || variant === 'classic') && (
                          <div className="flex justify-center gap-3 mt-2">
                             <button
                              className={styles.actions}
                              onClick={() => startEdit(entry)}
                            >
                              수정
                            </button>
                            <span className="text-stone-300 text-[10px]">|</span>
                            <button
                              className={styles.actions}
                              onClick={() => onDelete(entry.id)}
                            >
                              삭제
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="text-center mt-8">
          <button
            className="text-xs text-stone-400 hover:text-stone-600 underline transition-colors"
            onClick={load}
            disabled={loading}
          >
            새로고침
          </button>
        </div>
      </div>
    </section>
  );
}
