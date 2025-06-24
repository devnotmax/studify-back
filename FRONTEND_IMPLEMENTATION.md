# Implementación Frontend - Endpoints de Autenticación

## Endpoints Disponibles

### Base URL
```
# Desarrollo
http://localhost:3000/api

# Producción (ejemplo)
https://tu-backend.onrender.com/api
```

### 1. Registro de Usuario
**POST** `/auth/register`

### 2. Login de Usuario
**POST** `/auth/login`

### 3. Endpoint de Prueba
**GET** `/api/test` - Para verificar que la API esté funcionando

## 🌍 Configuración para Diferentes Entornos

### Configuración Dinámica de URL

```javascript
// config/api.js
const getApiUrl = () => {
    if (process.env.NODE_ENV === 'production') {
        return process.env.REACT_APP_API_URL || 'https://tu-backend.onrender.com/api';
    }
    return 'http://localhost:3000/api';
};

export const API_BASE_URL = getApiUrl();
```

### Variables de Entorno por Framework

#### React (Create React App)
```env
# .env.development
REACT_APP_API_URL=http://localhost:3000/api

# .env.production
REACT_APP_API_URL=https://tu-backend.onrender.com/api
```

#### Vite
```env
# .env.development
VITE_API_URL=http://localhost:3000/api

# .env.production
VITE_API_URL=https://tu-backend.onrender.com/api
```

#### Next.js
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# .env.production
NEXT_PUBLIC_API_URL=https://tu-backend.onrender.com/api
```

### Configuración Axios con Entornos

```javascript
import axios from 'axios';

const getApiUrl = () => {
    // React
    if (process.env.REACT_APP_API_URL) {
        return process.env.REACT_APP_API_URL;
    }
    
    // Vite
    if (process.env.VITE_API_URL) {
        return process.env.VITE_API_URL;
    }
    
    // Next.js
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }
    
    // Fallback
    return process.env.NODE_ENV === 'production' 
        ? 'https://tu-backend.onrender.com/api'
        : 'http://localhost:3000/api';
};

const API_BASE_URL = getApiUrl();

// Crear instancia de axios con configuración CORS
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    // Configuración importante para CORS
    withCredentials: true,
    timeout: 10000,
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log para debugging (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
        console.log('Request:', config.method?.toUpperCase(), config.url);
        console.log('Headers:', config.headers);
    }
    
    return config;
}, (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
});

// Interceptor para manejar respuestas
api.interceptors.response.use(
    (response) => {
        if (process.env.NODE_ENV === 'development') {
            console.log('Response:', response.status, response.data);
        }
        return response;
    },
    (error) => {
        console.error('Response Error:', error.response?.status, error.response?.data);
        
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Funciones de autenticación
export const authAPI = {
    // Función de prueba para verificar conexión
    testConnection: async () => {
        try {
            const response = await api.get('/test');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            const { token, user } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            return response.data;
        } catch (error) {
            console.error('Register Error:', error.response?.data || error.message);
            throw error;
        }
    },

    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            const { token, user } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            return response.data;
        } catch (error) {
            console.error('Login Error:', error.response?.data || error.message);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};
```

## 🚀 Configuración para Despliegue

### 1. Configurar Variables de Entorno

#### En tu plataforma de despliegue (Render, Railway, etc.):
```env
NODE_ENV=production
ORIGIN=https://tu-frontend.vercel.app,https://www.tu-frontend.vercel.app
```

#### En tu frontend:
```env
# .env.production
REACT_APP_API_URL=https://tu-backend.onrender.com/api
```

### 2. Actualizar URLs en el Código

```javascript
// Antes (hardcodeado)
const API_BASE_URL = 'http://localhost:3000/api';

// Después (dinámico)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
```

### 3. Verificar CORS

Asegúrate de que el backend permita tu dominio:
```env
# En el backend
ORIGIN=https://tu-frontend.vercel.app,https://www.tu-frontend.vercel.app
```

## 🔧 Configuración Axios con CORS

### Configuración Recomendada para Axios

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Crear instancia de axios con configuración CORS
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    // Configuración importante para CORS
    withCredentials: true,
    timeout: 10000,
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log para debugging
    console.log('Request:', config.method?.toUpperCase(), config.url);
    console.log('Headers:', config.headers);
    
    return config;
}, (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
});

// Interceptor para manejar respuestas
api.interceptors.response.use(
    (response) => {
        console.log('Response:', response.status, response.data);
        return response;
    },
    (error) => {
        console.error('Response Error:', error.response?.status, error.response?.data);
        
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Funciones de autenticación
export const authAPI = {
    // Función de prueba para verificar conexión
    testConnection: async () => {
        try {
            const response = await api.get('/test');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            const { token, user } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            return response.data;
        } catch (error) {
            console.error('Register Error:', error.response?.data || error.message);
            throw error;
        }
    },

    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            const { token, user } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            return response.data;
        } catch (error) {
            console.error('Login Error:', error.response?.data || error.message);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};
```

### Ejemplo de Uso con Manejo de Errores

```javascript
// Función para probar la conexión
async function testAPI() {
    try {
        const result = await authAPI.testConnection();
        console.log('✅ API funcionando:', result);
        return true;
    } catch (error) {
        console.error('❌ Error de conexión:', error);
        return false;
    }
}

// Función para registrar usuario con manejo de errores
async function registerUser(userData) {
    try {
        const result = await authAPI.register(userData);
        console.log('✅ Usuario registrado:', result);
        return { success: true, data: result };
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error('❌ Error en registro:', errorMessage);
        return { success: false, error: errorMessage };
    }
}

// Función para login con manejo de errores
async function loginUser(credentials) {
    try {
        const result = await authAPI.login(credentials);
        console.log('✅ Login exitoso:', result);
        return { success: true, data: result };
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error('❌ Error en login:', errorMessage);
        return { success: false, error: errorMessage };
    }
}
```

## 🚨 Troubleshooting - Problemas Comunes

### 1. Error de CORS
**Síntomas**: Error en consola del navegador sobre CORS
**Solución**: 
- Verifica que el backend esté corriendo en `http://localhost:3000`
- Asegúrate de usar `withCredentials: true` en Axios
- Revisa que el frontend esté en un puerto permitido (3001, 5173, 8080, etc.)

### 2. Error de Conexión
**Síntomas**: "Network Error" o "ERR_CONNECTION_REFUSED"
**Solución**:
- Verifica que el servidor esté corriendo: `npm start` o `npm run dev`
- Prueba el endpoint de test: `http://localhost:3000/api/test`
- Verifica que no haya otro proceso usando el puerto 3000

### 3. Error 404 en Rutas
**Síntomas**: "Not Found" en las rutas de autenticación
**Solución**:
- Verifica que las rutas estén correctamente configuradas
- Asegúrate de usar la URL correcta: `/api/auth/login` y `/api/auth/register`
- Revisa los logs del servidor para ver las rutas que se están llamando

### 4. Error de Validación
**Síntomas**: Error 400 con mensaje de validación
**Solución**:
- Verifica que todos los campos requeridos estén presentes
- Asegúrate de que la contraseña tenga al menos 6 caracteres
- Verifica el formato de la fecha: `YYYY-MM-DD`

### 5. Error de Autenticación
**Síntomas**: Error 401 "Invalid credentials"
**Solución**:
- Verifica que el email y contraseña sean correctos
- Asegúrate de que el usuario esté registrado
- Revisa que el formato del email sea válido

## 🔍 Pasos de Debugging

### 1. Probar Conexión Básica
```javascript
// En la consola del navegador
fetch('http://localhost:3000/api/test')
    .then(res => res.json())
    .then(data => console.log('✅ API OK:', data))
    .catch(err => console.error('❌ API Error:', err));
```

### 2. Probar con Axios
```javascript
// En la consola del navegador
import axios from 'axios';
axios.get('http://localhost:3000/api/test')
    .then(res => console.log('✅ Axios OK:', res.data))
    .catch(err => console.error('❌ Axios Error:', err));
```

### 3. Verificar Logs del Servidor
Revisa la consola del servidor para ver:
- Las peticiones que llegan
- Los errores de CORS
- Las rutas que se están llamando

## 📋 Checklist de Verificación

- [ ] Servidor corriendo en puerto 3000
- [ ] Endpoint de test responde: `http://localhost:3000/api/test`
- [ ] CORS configurado correctamente
- [ ] Rutas de autenticación funcionando
- [ ] Frontend en puerto permitido
- [ ] Axios configurado con `withCredentials: true`
- [ ] Headers correctos en las peticiones

## Ejemplos de Implementación

### JavaScript/Fetch API

```javascript
// Configuración base
const API_BASE_URL = 'http://localhost:3000/api';

// Función para registrar usuario
async function registerUser(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: userData.email,
                password: userData.password,
                firstName: userData.firstName,
                lastName: userData.lastName,
                birthDate: userData.birthDate // formato: "YYYY-MM-DD"
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            // Guardar token en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return { success: true, data };
        } else {
            return { success: false, error: data.message };
        }
    } catch (error) {
        return { success: false, error: 'Error de conexión' };
    }
}

// Función para hacer login
async function loginUser(credentials) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: credentials.email,
                password: credentials.password
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            // Guardar token en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return { success: true, data };
        } else {
            return { success: false, error: data.message };
        }
    } catch (error) {
        return { success: false, error: 'Error de conexión' };
    }
}

// Función para obtener el token de autorización
function getAuthToken() {
    return localStorage.getItem('token');
}

// Función para hacer requests autenticados
async function authenticatedRequest(url, options = {}) {
    const token = getAuthToken();
    
    if (!token) {
        throw new Error('No hay token de autenticación');
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });

    return response;
}
```

### React con Hooks

```jsx
import { useState } from 'react';

const API_BASE_URL = 'http://localhost:3000/api';

export const useAuth = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const register = async (userData) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
                return { success: true };
            } else {
                setError(data.message);
                return { success: false, error: data.message };
            }
        } catch (error) {
            setError('Error de conexión');
            return { success: false, error: 'Error de conexión' };
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
                return { success: true };
            } else {
                setError(data.message);
                return { success: false, error: data.message };
            }
        } catch (error) {
            setError('Error de conexión');
            return { success: false, error: 'Error de conexión' };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return {
        user,
        loading,
        error,
        register,
        login,
        logout,
        isAuthenticated: !!user
    };
};
```

### Ejemplo de Componente React

```jsx
import React, { useState } from 'react';
import { useAuth } from './useAuth';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    
    const { login, loading, error } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(formData);
        
        if (result.success) {
            // Redirigir al dashboard
            window.location.href = '/dashboard';
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Iniciar Sesión</h2>
            
            {error && <div className="error">{error}</div>}
            
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            
            <div>
                <label>Contraseña:</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>
            
            <button type="submit" disabled={loading}>
                {loading ? 'Cargando...' : 'Iniciar Sesión'}
            </button>
        </form>
    );
};

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        birthDate: ''
    });
    
    const { register, loading, error } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register(formData);
        
        if (result.success) {
            // Redirigir al dashboard
            window.location.href = '/dashboard';
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Registrarse</h2>
            
            {error && <div className="error">{error}</div>}
            
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            
            <div>
                <label>Contraseña:</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={6}
                    required
                />
            </div>
            
            <div>
                <label>Nombre:</label>
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />
            </div>
            
            <div>
                <label>Apellido:</label>
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />
            </div>
            
            <div>
                <label>Fecha de Nacimiento:</label>
                <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                />
            </div>
            
            <button type="submit" disabled={loading}>
                {loading ? 'Cargando...' : 'Registrarse'}
            </button>
        </form>
    );
};
```

### Axios

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Crear instancia de axios
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Funciones de autenticación
export const authAPI = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        const { token, user } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        const { token, user } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};
```

## Estructura de Datos

### Request de Registro
```json
{
    "email": "usuario@ejemplo.com",
    "password": "123456",
    "firstName": "Juan",
    "lastName": "Pérez",
    "birthDate": "1990-01-01"
}
```

### Request de Login
```json
{
    "email": "usuario@ejemplo.com",
    "password": "123456"
}
```

### Response de Autenticación
```json
{
    "message": "Login successful",
    "user": {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "email": "usuario@ejemplo.com",
        "firstName": "Juan",
        "lastName": "Pérez",
        "birthDate": "1990-01-01",
        "role": "user",
        "createdAt": "2024-01-01T12:00:00Z",
        "updatedAt": "2024-01-01T12:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Códigos de Estado HTTP

- **201**: Usuario registrado correctamente
- **200**: Login exitoso
- **400**: Error en los datos de entrada (email ya registrado, datos inválidos)
- **401**: Credenciales inválidas

## Notas Importantes

1. **Token JWT**: Después de un login/registro exitoso, el token debe guardarse y enviarse en el header `Authorization: Bearer <token>` para requests autenticados.

2. **Validación**: La contraseña debe tener al menos 6 caracteres.

3. **Formato de Fecha**: La fecha de nacimiento debe enviarse en formato `YYYY-MM-DD`.

4. **Manejo de Errores**: Siempre verificar el código de estado HTTP y manejar los errores apropiadamente.

5. **Seguridad**: Nunca almacenar la contraseña en el frontend, solo el token JWT. 