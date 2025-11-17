import React, { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nameInput, setNameInput] = useState(currentUser.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');
  const { updateUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Mock usage data (horas por semana) — frontend-only
  const usage = useMemo(() => {
    // ejemplo fijo por semana, podríamos randomizar si prefieres
    return [
      { day: 'Lun', hours: 2 },
      { day: 'Mar', hours: 1.5 },
      { day: 'Mie', hours: 0.5 },
      { day: 'Jue', hours: 3 },
      { day: 'Vie', hours: 2.5 },
      { day: 'Sab', hours: 4 },
      { day: 'Dom', hours: 1 },
    ];
  }, []);

  const totalHours = usage.reduce((s, it) => s + it.hours, 0);

  const handleDelete = async () => {
    const ok = confirm('¿Confirmas que deseas eliminar tu cuenta? Esta acción no se puede deshacer.');
    if (!ok) return;
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('yies_token');
      const res = await fetch(`http://127.0.0.1:5000/api/users/${currentUser.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token || '',
        },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.message || 'Error eliminando la cuenta');
        setLoading(false);
        return;
      }

      // Si se eliminó correctamente, cerrar sesión y redirigir al inicio
      logout();
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error de red');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">Configuración del Perfil</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Información principal */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center text-xl font-semibold">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : (currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U')}
            </div>
            <div>
              <div className="text-lg font-medium">{currentUser.name || currentUser.email}</div>
              <div className="text-xs text-gray-300">{currentUser.email}</div>
            </div>
          </div>

          <p className="mb-2"><strong className="font-bold text-blue-400">Rol:</strong> {currentUser.role}</p>
          <p className="mb-4"><strong className="font-bold text-blue-400">Miembro desde:</strong> {currentUser.creation_date ? new Date(currentUser.creation_date).toLocaleDateString() : '—'}</p>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="mt-2 px-4 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            {loading ? 'Eliminando...' : 'Eliminar cuenta'}
          </button>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Editar perfil</h3>
            <label className="block text-sm text-gray-300">Nombre</label>
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md"
            />

            <button
              onClick={async () => {
                setError('');
                setSuccess('');
                setLoading(true);
                try {
                  const token = localStorage.getItem('yies_token');
                  const res = await fetch(`http://127.0.0.1:5000/api/users/${currentUser.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', 'x-access-token': token || '' },
                    body: JSON.stringify({ name: nameInput }),
                  });
                  const body = await res.json().catch(() => ({}));
                  if (!res.ok) {
                    setError(body.message || 'Error actualizando');
                    setLoading(false);
                    return;
                  }
                  // actualizar contexto
                  if (body.user) {
                    updateUser(body.user);
                    setSuccess('Nombre actualizado.');
                  }
                } catch (err) {
                  setError(err.message || 'Error de red');
                } finally {
                  setLoading(false);
                }
              }}
              className="mt-3 px-3 py-2 bg-indigo-600 rounded text-white"
            >
              Guardar nombre
            </button>
          </div>

          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        </div>

        {/* Uso semanal (mock) */}
        <div className="md:col-span-2 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Tiempo de uso (esta semana)</h2>
          <div className="mb-4">
            <div className="flex items-end h-36 gap-3 mb-2">
              {(() => {
                const max = Math.max(...usage.map((u) => u.hours), 1);
                return usage.map((u) => {
                  const heightPct = (u.hours / max) * 100;
                  return (
                    <div key={u.day} className="flex flex-col items-center h-full" style={{ width: 40 }}>
                      <div className="flex-1 flex items-end w-full">
                        <div
                          className="w-full rounded-md"
                          style={{
                            height: `${heightPct}%`,
                            background: 'linear-gradient(to top, #06b6d4, #34d399)',
                          }}
                          title={`${u.hours} horas`}
                        />
                      </div>
                      <div className="text-sm text-gray-300 mt-2">{u.day}</div>
                    </div>
                  );
                });
              })()}
            </div>
            <p className="text-sm text-gray-300">Total: <span className="text-white font-medium">{totalHours} horas</span></p>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Opciones</h3>
            <p className="text-sm text-gray-300">Puedes eliminar tu cuenta permanentemente usando el botón rojo. Esta acción borrará tus datos del sistema.</p>
            <div className="mt-4">
              <h4 className="font-semibold">Restablecer contraseña</h4>
              <input
                type="password"
                placeholder="Contraseña actual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 mt-2 text-white bg-gray-700 border border-gray-600 rounded-md"
              />
              <input
                type="password"
                placeholder="Nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 mt-2 text-white bg-gray-700 border border-gray-600 rounded-md"
              />
              <input
                type="password"
                placeholder="Confirmar nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 mt-2 text-white bg-gray-700 border border-gray-600 rounded-md"
              />
              <button
                onClick={async () => {
                  setError('');
                  setSuccess('');
                  if (!currentPassword || !newPassword) {
                    setError('Introduce la contraseña actual y la nueva.');
                    return;
                  }
                  if (newPassword !== confirmPassword) {
                    setError('La nueva contraseña y la confirmación no coinciden.');
                    return;
                  }
                  setLoading(true);
                  try {
                    const token = localStorage.getItem('yies_token');
                    const res = await fetch(`http://127.0.0.1:5000/api/users/${currentUser.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json', 'x-access-token': token || '' },
                      body: JSON.stringify({ current_password: currentPassword, password: newPassword }),
                    });
                    const body = await res.json().catch(() => ({}));
                    if (!res.ok) {
                      setError(body.message || 'Error cambiando contraseña');
                      setLoading(false);
                      return;
                    }
                    setSuccess('Contraseña actualizada correctamente.');
                    // Limpiar campos
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  } catch (err) {
                    setError(err.message || 'Error de red');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="mt-3 px-3 py-2 bg-indigo-600 rounded text-white"
              >
                Cambiar contraseña
              </button>
              {success && <p className="mt-2 text-sm text-green-400">{success}</p>}
              {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
