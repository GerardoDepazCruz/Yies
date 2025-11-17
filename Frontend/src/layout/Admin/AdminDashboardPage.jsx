import React, { useState } from 'react';

const AdminDashboardPage = () => {
  // Películas (estado local)
  const [movies, setMovies] = useState([
    // ejemplo inicial
  ]);
  const [movieForm, setMovieForm] = useState({ image: '', title: '', description: '' });

  // Usuarios (estado local)
  const [users, setUsers] = useState([]);
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', status: 'active' });

  const handleAddMovie = (e) => {
    e.preventDefault();
    const { image, title, description } = movieForm;
    if (!title || !description) return;
    const newMovie = { id: Date.now(), image, title, description };
    setMovies((s) => [newMovie, ...s]);
    setMovieForm({ image: '', title: '', description: '' });
  };

  const handleDeleteMovie = (id) => {
    setMovies((s) => s.filter((m) => m.id !== id));
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const { name, email, password, status } = userForm;
    if (!name || !email || !password) return;
    const newUser = { id: Date.now(), name, email, password, status };
    setUsers((s) => [newUser, ...s]);
    setUserForm({ name: '', email: '', password: '', status: 'active' });
  };

  const handleDeleteUser = (id) => {
    setUsers((s) => s.filter((u) => u.id !== id));
  };

  const toggleUserStatus = (id) => {
    setUsers((s) => s.map((u) => (u.id === id ? { ...u, status: u.status === 'active' ? 'cancelled' : 'active' } : u)));
  };

  const counts = {
    total: users.length,
    active: users.filter((u) => u.status === 'active').length,
    cancelled: users.filter((u) => u.status === 'cancelled').length,
  };

  return (
    <div className="min-h-screen bg-[#071428] py-8">
      <div className="container mx-auto px-4">
      <h1 className="text-5xl font-bold mb-6 text-center text-blue-500">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gestión de Multimedia */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-3xl font-semibold mb-4 text-yellow-400">Gestión de Contenido</h2>

          <form onSubmit={handleAddMovie} className="space-y-3 mb-6">
            <input
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              placeholder="URL imagen (opcional)"
              value={movieForm.image}
              onChange={(e) => setMovieForm((s) => ({ ...s, image: e.target.value }))}
            />
            <input
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              placeholder="Título"
              value={movieForm.title}
              onChange={(e) => setMovieForm((s) => ({ ...s, title: e.target.value }))}
              required
            />
            <textarea
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              placeholder="Descripción"
              value={movieForm.description}
              onChange={(e) => setMovieForm((s) => ({ ...s, description: e.target.value }))}
              required
            />
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-yellow-500 text-black rounded" type="submit">Agregar película</button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-600 text-white rounded"
                onClick={() => setMovieForm({ image: '', title: '', description: '' })}
              >
                Limpiar
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {movies.length === 0 && <div className="text-gray-300">No hay películas agregadas aún.</div>}
            {movies.map((m) => (
              <div key={m.id} className="flex gap-4 bg-gray-900 p-3 rounded">
                {m.image ? (
                  <img src={m.image} alt={m.title} className="w-28 h-16 object-cover rounded" />
                ) : (
                  <div className="w-28 h-16 bg-gray-700 rounded flex items-center justify-center text-gray-300">No image</div>
                )}
                <div className="flex-1">
                  <div className="text-white font-semibold">{m.title}</div>
                  <div className="text-sm text-gray-300">{m.description}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleDeleteMovie(m.id)} className="px-3 py-1 bg-red-600 text-white rounded">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gestión de Usuarios */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-3xl font-semibold mb-4 text-green-400">Gestión de Usuarios</h2>

          <form onSubmit={handleAddUser} className="space-y-3 mb-4">
            <input
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              placeholder="Nombre"
              value={userForm.name}
              onChange={(e) => setUserForm((s) => ({ ...s, name: e.target.value }))}
              required
            />
            <input
              type="email"
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              placeholder="Correo"
              value={userForm.email}
              onChange={(e) => setUserForm((s) => ({ ...s, email: e.target.value }))}
              required
            />
            <input
              type="password"
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              placeholder="Contraseña"
              value={userForm.password}
              onChange={(e) => setUserForm((s) => ({ ...s, password: e.target.value }))}
              required
            />
            <select
              value={userForm.status}
              onChange={(e) => setUserForm((s) => ({ ...s, status: e.target.value }))}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
            >
              <option value="active">Activo</option>
              <option value="cancelled">Cancelado</option>
            </select>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-yellow-500 text-black rounded">Agregar usuario</button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-600 text-white rounded"
                onClick={() => setUserForm({ name: '', email: '', password: '', status: 'active' })}
              >
                Limpiar
              </button>
            </div>
          </form>

          <div className="mb-4 text-gray-300">
            <div>Total usuarios: <span className="font-semibold text-white">{counts.total}</span></div>
            <div>Activos: <span className="font-semibold text-white">{counts.active}</span></div>
            <div>Cancelados: <span className="font-semibold text-white">{counts.cancelled}</span></div>
          </div>

          <div className="space-y-3">
            {users.length === 0 && <div className="text-gray-300">No hay usuarios creados.</div>}
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between bg-gray-900 p-3 rounded">
                <div>
                  <div className="text-white font-semibold">{u.name}</div>
                  <div className="text-sm text-gray-300">{u.email}</div>
                  <div className="text-xs text-gray-400">Estado: {u.status}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => toggleUserStatus(u.id)} className="px-3 py-1 bg-blue-600 text-white rounded">Toggle Estado</button>
                  <button onClick={() => handleDeleteUser(u.id)} className="px-3 py-1 bg-red-600 text-white rounded">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;