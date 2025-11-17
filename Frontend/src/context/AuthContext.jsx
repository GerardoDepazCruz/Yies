import React, { createContext, useState, useContext, useEffect } from 'react';

// Datos simulados de usuarios
const mockUsers = {
  'admin@yies.com': {
    id: 1,
    name: 'Admin User',
    email: 'admin@yies.com',
    role: 'admin',
    subscription: {
      plan: 'Premium',
      status: 'active',
      nextPayment: '2025-12-15',
    },
    history: [
      { id: 'tt0111161', title: 'The Shawshank Redemption', rating: 5 },
      { id: 'tt0068646', title: 'The Godfather', rating: 5 },
    ],
  },
  'user@yies.com': {
    id: 2,
    name: 'Regular User',
    email: 'user@yies.com',
    role: 'user',
    subscription: {
      plan: 'Basic',
      status: 'active',
      nextPayment: '2025-11-30',
    },
    history: [{ id: 'tt0468569', title: 'The Dark Knight', rating: 4 }],
  },
};

// 1. Crear el Contexto
const AuthContext = createContext();

// 2. Crear el Proveedor del Contexto
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  
  // Al iniciar, si existe token en localStorage, decodificarlo y establecer usuario
  useEffect(() => {
    const token = localStorage.getItem('yies_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        setCurrentUser({ id: payload.user_id, email: payload.email || null, role: payload.role });
      } catch (e) {
        // token inválido, limpiar
        localStorage.removeItem('yies_token');
      }
    }
  }, []);
  // Login local (simulado) - mantiene compatibilidad
  const login = (email) => {
    if (mockUsers[email]) {
      setCurrentUser(mockUsers[email]);
      return true;
    }
    return false;
  };

  // Login real usando el backend
  const loginApi = async (email, password) => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        return { success: false, message: body.message || 'Login failed' };
      }

      const data = await res.json();
      const token = data.token;
      localStorage.setItem('yies_token', token);
      // Si el backend devolvió información de usuario, usarla; si no, decodificar token
      let role = null;
      if (data.user) {
        setCurrentUser(data.user);
        role = data.user.role;
      } else {
        const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        setCurrentUser({ id: payload.user_id, email: payload.email || email, role: payload.role });
        role = payload.role;
      }
      return { success: true, role };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('yies_token');
  };

  const register = (name, email) => {
    if (mockUsers[email]) {
      return { success: false, message: 'El correo ya está registrado.' };
    }

    const newUser = {
      id: Date.now(), // ID simple para la simulación
      name,
      email,
      role: 'user',
      subscription: {
        plan: 'Basic',
        status: 'active',
        nextPayment: '2025-12-16', // Fecha de ejemplo
      },
      history: [],
    };

    mockUsers[email] = newUser;
    setCurrentUser(newUser);
    return { success: true };
  };

  // Registro real usando backend
  const registerApi = async (name, email, password) => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.status === 201) {
        // opcional: iniciar sesión automáticamente
        const loginResult = await loginApi(email, password);
        return { success: true, autoLogin: loginResult.success };
      }

      const body = await res.json().catch(() => ({}));
      return { success: false, message: body.message || 'Registration failed' };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const updateUser = (updatedData) => {
    if (currentUser) {
      setCurrentUser((prev) => ({ ...prev, ...updatedData }));
      // Actualizar también los datos simulados para persistencia en la sesión
      mockUsers[currentUser.email] = { ...mockUsers[currentUser.email], ...updatedData };
    }
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    login,
    loginApi,
    logout,
    register,
    registerApi,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
