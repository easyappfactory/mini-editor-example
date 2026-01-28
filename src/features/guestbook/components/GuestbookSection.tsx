'use client';

import { useEffect, useMemo, useState } from 'react';
import type { GuestbookEntry } from '@/shared/types/guestbook';

type LoadResponse = { entries: GuestbookEntry[] };

type CreateResponse = { entry: GuestbookEntry };

type UpdateResponse = { entry: GuestbookEntry };

export default function GuestbookSection({ projectId }: { projectId: string }) {
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

  const apiBase = useMemo(() => `/api/projects/${projectId}/guestbook`, [projectId]);

  async function load() {
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
  }

  useEffect(() => {
    load();
  }, [apiBase]);

  async function onCreate() {
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
    <section className="px-5 py-10 border-t border-black/10">
      <h2 className="text-xl font-semibold">방명록</h2>

      <div className="mt-4 space-y-3">
        <input
          className="w-full rounded-md border border-black/15 px-3 py-2 text-sm"
          placeholder="작성자 이름"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          maxLength={30}
        />
        <textarea
          className="w-full rounded-md border border-black/15 px-3 py-2 text-sm min-h-24"
          placeholder="축하 메시지를 남겨주세요"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={500}
        />
        <input
          className="w-full rounded-md border border-black/15 px-3 py-2 text-sm"
          placeholder="비밀번호 (수정/삭제용)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          maxLength={64}
        />
        <button
          className="w-full rounded-md bg-black text-white px-3 py-2 text-sm disabled:opacity-50"
          onClick={onCreate}
          disabled={submitting}
        >
          {submitting ? '등록 중...' : '방명록 남기기'}
        </button>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="text-sm text-black/60">불러오는 중...</p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-black/60">첫 방명록을 남겨보세요.</p>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => {
              const isEditing = editId === entry.id;
              return (
                <article key={entry.id} className="rounded-lg border border-black/10 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{entry.author_name}</p>
                      <p className="text-xs text-black/50">{new Date(entry.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="text-xs underline text-black/70"
                        onClick={() => startEdit(entry)}
                        disabled={isEditing}
                      >
                        수정
                      </button>
                      <button
                        className="text-xs underline text-red-700"
                        onClick={() => onDelete(entry.id)}
                      >
                        삭제
                      </button>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="mt-3 space-y-2">
                      <textarea
                        className="w-full rounded-md border border-black/15 px-3 py-2 text-sm min-h-24"
                        value={editMessage}
                        onChange={(e) => setEditMessage(e.target.value)}
                        maxLength={500}
                      />
                      <input
                        className="w-full rounded-md border border-black/15 px-3 py-2 text-sm"
                        placeholder="비밀번호"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        type="password"
                        maxLength={64}
                      />
                      <div className="flex gap-2">
                        <button
                          className="flex-1 rounded-md bg-black text-white px-3 py-2 text-sm disabled:opacity-50"
                          onClick={() => onUpdate(entry.id)}
                          disabled={editSubmitting}
                        >
                          {editSubmitting ? '저장 중...' : '저장'}
                        </button>
                        <button
                          className="flex-1 rounded-md border border-black/15 px-3 py-2 text-sm"
                          onClick={cancelEdit}
                          disabled={editSubmitting}
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm whitespace-pre-wrap">{entry.message}</p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>

      <button
        className="mt-6 text-xs underline text-black/60"
        onClick={load}
        disabled={loading}
      >
        새로고침
      </button>
    </section>
  );
}
