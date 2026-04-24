'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Users, Search, Download, ChevronLeft, ChevronRight,
  MoreHorizontal, UserCheck, UserX, Mail, Trash2, RefreshCw,
  AlertTriangle, CheckSquare, Square, ArrowUpDown,
} from 'lucide-react';

interface AdminUser {
  id: string;
  username: string;
  email: string | null;
  avatar_url: string | null;
  plan_tier: string;
  status: string;
  is_admin: boolean;
  created_at: string;
  last_seen_at: string | null;
  leads_count: number;
  mrr: number;
}

interface UsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  per_page: number;
}

const PLAN_BADGE: Record<string, string> = {
  free: 'text-white/40 bg-white/[0.04] border-white/[0.08]',
  starter: 'text-blue-300 bg-blue-500/[0.12] border-blue-500/20',
  pro: 'text-[#FF5C1F] bg-[#FF5C1F]/[0.12] border-[#FF5C1F]/20',
  agency: 'text-amber-300 bg-amber-500/[0.12] border-amber-500/20',
};

const STATUS_BADGE: Record<string, string> = {
  active: 'text-emerald-300 bg-emerald-500/[0.1]',
  suspended: 'text-red-300 bg-red-500/[0.1]',
};

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

type ActionMenuState = { userId: string; x: number; y: number } | null;

export default function AdminUsersPage() {
  const [data, setData] = useState<UsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [plan, setPlan] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [actionMenu, setActionMenu] = useState<ActionMenuState>(null);
  const [bulkLoading, setBulkLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), per_page: '50' });
      if (search) params.set('search', search);
      if (plan) params.set('plan', plan);
      if (status) params.set('status', status);
      const res = await fetch(`/api/admin/users?${params}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed');
      const json = await res.json() as UsersResponse;
      setData(json);
    } catch {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, search, plan, status]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Close action menu on outside click
  useEffect(() => {
    const handler = () => setActionMenu(null);
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  const toggleAll = () => {
    if (!data) return;
    if (selected.size === data.users.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(data.users.map((u) => u.id)));
    }
  };

  const exportCSV = () => {
    if (!data) return;
    const rows = data.users.filter((u) => selected.size === 0 || selected.has(u.id));
    const csv = [
      ['Username', 'Email', 'Plan', 'Status', 'Joined', 'Last Seen', 'Leads', 'MRR'].join(','),
      ...rows.map((u) =>
        [u.username, u.email ?? '', u.plan_tier, u.status, u.created_at, u.last_seen_at ?? '', u.leads_count, u.mrr].join(',')
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
  };

  const bulkAction = async (action: string) => {
    if (selected.size === 0) return;
    setBulkLoading(true);
    try {
      await fetch('/api/admin/users/bulk', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userIds: Array.from(selected) }),
      });
      setSelected(new Set());
      fetchUsers();
    } finally {
      setBulkLoading(false);
    }
  };

  const userAction = async (userId: string, action: string) => {
    setActionMenu(null);
    if (action === 'impersonate') {
      const res = await fetch(`/api/admin/users/${userId}/impersonate`, { method: 'POST', credentials: 'include' });
      if (res.ok) window.location.href = '/dashboard';
      return;
    }
    await fetch(`/api/admin/users/${userId}/${action}`, { method: 'POST', credentials: 'include' });
    fetchUsers();
  };

  const totalPages = data ? Math.ceil(data.total / 50) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-[#FF5C1F]" />
            Users
            {data && (
              <span className="text-sm font-normal text-white/30 ml-1">({data.total.toLocaleString()} total)</span>
            )}
          </h1>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/50 hover:bg-white/[0.08] transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#FF5C1F]/40"
          />
        </div>
        <select
          value={plan}
          onChange={(e) => { setPlan(e.target.value); setPage(1); }}
          className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white/60 focus:outline-none focus:border-[#FF5C1F]/40"
        >
          <option value="">All plans</option>
          <option value="free">Free</option>
          <option value="starter">Starter</option>
          <option value="pro">Pro</option>
          <option value="agency">Agency</option>
        </select>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white/60 focus:outline-none focus:border-[#FF5C1F]/40"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
        <button
          onClick={() => fetchUsers()}
          className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white/50 hover:text-white transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Bulk actions bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-[#FF5C1F]/20 bg-[#FF5C1F]/5 px-4 py-2.5">
          <span className="text-sm font-semibold text-[#FF5C1F]">{selected.size} selected</span>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => bulkAction('suspend')}
              disabled={bulkLoading}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/60 hover:text-white transition-colors disabled:opacity-50"
            >
              Suspend
            </button>
            <button
              onClick={() => bulkAction('export')}
              disabled={bulkLoading}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/60 hover:text-white transition-colors disabled:opacity-50"
            >
              Export
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-white/30 hover:text-white transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {error ? (
        <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
          <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      ) : loading ? (
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 text-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#FF5C1F] border-t-transparent mx-auto mb-2" />
          <p className="text-xs text-white/30">Loading users…</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-4 py-3 text-left">
                    <button onClick={toggleAll} className="text-white/30 hover:text-white">
                      {data && selected.size === data.users.length ? (
                        <CheckSquare className="h-4 w-4 text-[#FF5C1F]" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-white/30">
                    <div className="flex items-center gap-1">User <ArrowUpDown className="h-3 w-3" /></div>
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-white/30">Plan</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-white/30">Joined</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-white/30">Last seen</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-white/30">Leads</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-white/30">MRR</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-white/30">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {!data || data.users.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-sm text-white/25">
                      No users found.{' '}
                      <Link href="/" className="text-[#FF5C1F] hover:underline">View landing page</Link>
                    </td>
                  </tr>
                ) : (
                  data.users.map((user) => (
                    <tr key={user.id} className={`group transition-colors hover:bg-white/[0.02] ${selected.has(user.id) ? 'bg-[#FF5C1F]/[0.03]' : ''}`}>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleSelect(user.id)} className="text-white/30 hover:text-white">
                          {selected.has(user.id) ? (
                            <CheckSquare className="h-4 w-4 text-[#FF5C1F]" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/users/${user.id}`} className="flex items-center gap-2.5 hover:opacity-80">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt="" className="h-7 w-7 rounded-full border border-white/10" />
                          ) : (
                            <div className="h-7 w-7 rounded-full border border-white/10 bg-white/[0.06] flex items-center justify-center text-xs text-white/40 font-bold">
                              {user.username[0]?.toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-white text-sm">@{user.username}</p>
                            {user.email && <p className="text-xs text-white/30">{user.email}</p>}
                          </div>
                          {user.is_admin && (
                            <span className="text-[10px] font-bold uppercase tracking-wide text-[#FF5C1F] bg-[#FF5C1F]/10 px-1.5 py-0.5 rounded">
                              admin
                            </span>
                          )}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${PLAN_BADGE[user.plan_tier] ?? PLAN_BADGE.free}`}>
                          {user.plan_tier}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-white/40">{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-xs text-white/40">
                        {user.last_seen_at ? relativeTime(user.last_seen_at) : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-white/70">{user.leads_count.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-white/70">
                        {user.mrr > 0 ? `$${user.mrr}` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${STATUS_BADGE[user.status] ?? STATUS_BADGE.active}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const rect = (e.target as HTMLElement).getBoundingClientRect();
                              setActionMenu(actionMenu?.userId === user.id ? null : { userId: user.id, x: rect.left, y: rect.bottom });
                            }}
                            className="rounded-md p-1.5 text-white/20 hover:text-white hover:bg-white/[0.06] transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                          {actionMenu?.userId === user.id && (
                            <div
                              className="fixed z-50 min-w-[160px] rounded-xl border border-white/[0.08] bg-[#0F0D0B] shadow-2xl py-1"
                              style={{ top: actionMenu.y + 4, left: actionMenu.x - 120 }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Link href={`/admin/users/${user.id}`} className="flex items-center gap-2 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/[0.04]">
                                <Users className="h-3.5 w-3.5" /> View profile
                              </Link>
                              <button onClick={() => userAction(user.id, 'impersonate')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/[0.04]">
                                <UserCheck className="h-3.5 w-3.5" /> Impersonate
                              </button>
                              <a href={`mailto:${user.email}`} className="flex items-center gap-2 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/[0.04]">
                                <Mail className="h-3.5 w-3.5" /> Send email
                              </a>
                              <div className="border-t border-white/[0.06] my-1" />
                              {user.status === 'active' ? (
                                <button onClick={() => userAction(user.id, 'suspend')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/[0.06]">
                                  <UserX className="h-3.5 w-3.5" /> Suspend
                                </button>
                              ) : (
                                <button onClick={() => userAction(user.id, 'unsuspend')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-emerald-400 hover:bg-emerald-500/[0.06]">
                                  <UserCheck className="h-3.5 w-3.5" /> Unsuspend
                                </button>
                              )}
                              <button onClick={() => userAction(user.id, 'delete')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/[0.06]">
                                <Trash2 className="h-3.5 w-3.5" /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && totalPages > 1 && (
            <div className="border-t border-white/[0.06] flex items-center justify-between px-5 py-3">
              <p className="text-xs text-white/30">
                Page {data.page} of {totalPages} · {data.total.toLocaleString()} users
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-white/[0.08] px-2.5 py-1.5 text-xs text-white/40 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-white/[0.08] px-2.5 py-1.5 text-xs text-white/40 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
