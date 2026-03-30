import { useCallback, useEffect, useState } from 'react';
import Card from '../components/Card';
import { organizationService } from '../services/organizations';
import type { Organization } from '../types';
import { Building2, Loader2, UserPlus, Plus } from 'lucide-react';

export default function Organizations() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [inviteOrgId, setInviteOrgId] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member');
  const [inviting, setInviting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await organizationService.getUserOrganizations();
    if (err) setError(err);
    const list = data ?? [];
    setOrgs(list);
    setInviteOrgId((prev) => prev || (list[0]?.id ?? ''));
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    setCreating(true);
    setMessage(null);
    const { data, error: err } = await organizationService.createOrganization(name);
    setCreating(false);
    if (err) {
      setError(err);
      return;
    }
    setNewName('');
    setMessage(`Organización "${data?.name}" creada.`);
    await refresh();
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = inviteEmail.trim();
    if (!email || !inviteOrgId) return;
    setInviting(true);
    setMessage(null);
    const { error: err } = await organizationService.inviteUser(inviteOrgId, email, inviteRole);
    setInviting(false);
    if (err) {
      setError(err);
      return;
    }
    setInviteEmail('');
    setMessage('Invitación enviada (revisa la función Edge y el correo del invitado).');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-surface-900">Organizaciones</h2>
        <p className="mt-1 text-sm text-surface-500">
          Crea un espacio compartido (familia, pareja) e invita miembros. Los datos financieros por usuario siguen
          siendo personales hasta que el modelo compartido esté extendido en base de datos.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-danger-50 border border-danger-200 p-3.5 text-sm text-danger-700">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-lg bg-success-50 border border-success-200 p-3.5 text-sm text-success-800">
          {message}
        </div>
      )}

      <Card title="Mis organizaciones">
        {orgs.length === 0 ? (
          <p className="text-sm text-surface-500">Aún no perteneces a ninguna organización.</p>
        ) : (
          <ul className="space-y-2">
            {orgs.map((o) => (
              <li
                key={o.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-surface-200"
              >
                <Building2 className="w-5 h-5 text-primary-600 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-surface-900">{o.name}</p>
                  <p className="text-xs text-surface-400 font-mono">{o.id}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Crear organización">
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nombre (ej. Familia García)"
            className="flex-1 h-11 px-3.5 rounded-lg border border-surface-300 text-sm"
            required
          />
          <button
            type="submit"
            disabled={creating}
            className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-primary-600 text-white text-sm font-semibold disabled:opacity-50 cursor-pointer"
          >
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Crear
          </button>
        </form>
      </Card>

      <Card title="Invitar miembro" subtitle="Requiere rol admin en la organización">
        {orgs.length === 0 ? (
          <p className="text-sm text-surface-500">Crea una organización primero.</p>
        ) : (
          <form onSubmit={handleInvite} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-surface-600 mb-1">Organización</label>
              <select
                value={inviteOrgId}
                onChange={(e) => setInviteOrgId(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-surface-300 text-sm"
              >
                {orgs.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-600 mb-1">Correo</label>
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-surface-300 text-sm"
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-600 mb-1">Rol</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as 'admin' | 'member')}
                className="w-full h-11 px-3 rounded-lg border border-surface-300 text-sm"
              >
                <option value="member">Miembro</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={inviting}
              className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg border-2 border-primary-600 text-primary-700 text-sm font-semibold disabled:opacity-50 cursor-pointer"
            >
              {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              Enviar invitación
            </button>
          </form>
        )}
      </Card>
    </div>
  );
}
