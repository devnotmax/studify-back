# Sistema de Sesiones con Timer - Documentación de Implementación

## 📋 **Descripción General**

El sistema de sesiones permite a los usuarios iniciar, pausar, reanudar y finalizar sesiones de estudio con diferentes tipos (focus, break, long_break). Cada sesión tiene un timer que se sincroniza entre el frontend y backend.

---

## 🏗️ **Arquitectura del Sistema**

### **Backend (API REST)**
- **Base URL**: `https://tu-backend.onrender.com/api/sessions`
- **Autenticación**: JWT Token requerido en header `Authorization: Bearer <token>`

### **Frontend (Cliente)**
- **Responsabilidades**: Timer visual, controles de sesión, sincronización con backend
- **Estado**: Sesión activa, tiempo restante, estado (activa/pausada/completada)

---

## 🔌 **Endpoints Disponibles**

### **1. Iniciar Sesión**
```http
POST /api/sessions
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "sessionType": "focus" | "short_break" | "long_break",
  "duration": 1500  // duración en segundos (25 minutos = 1500s)
}
```

**Respuesta Exitosa (201):**
```json
{
  "message": "Sesión iniciada correctamente",
  "session": {
    "id": "uuid-session-id",
    "sessionType": "focus",
    "duration": 1500,
    "startTime": "2024-01-01T10:00:00.000Z",
    "completedTime": 0,
    "isCompleted": false,
    "isCancelled": false,
    "userId": "user-uuid"
  }
}
```

### **2. Obtener Sesión Activa**
```http
GET /api/sessions/active
Authorization: Bearer <jwt_token>
```

**Respuesta (200):**
```json
{
  "session": {
    "id": "uuid-session-id",
    "sessionType": "focus",
    "duration": 1500,
    "startTime": "2024-01-01T10:00:00.000Z",
    "completedTime": 300,  // tiempo completado en segundos
    "isCompleted": false,
    "isCancelled": false,
    "isPaused": false
  }
}
```

### **3. Finalizar Sesión**
```http
PUT /api/sessions/{sessionId}/end
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "completedTime": 1500  // tiempo total completado en segundos
}
```

**Respuesta Exitosa (200):**
```json
{
  "message": "Sesión finalizada correctamente",
  "session": { /* datos de la sesión */ },
  "streak": {
    "currentStreak": 5,
    "longestStreak": 10,
    "lastActivityDate": "2024-01-01"
  },
  "newAchievements": [ /* logros desbloqueados */ ]
}
```

### **4. Cancelar Sesión**
```http
PUT /api/sessions/{sessionId}/cancel
Authorization: Bearer <jwt_token>
```

### **5. Historial de Sesiones**
```http
GET /api/sessions/history?page=1&limit=10
Authorization: Bearer <jwt_token>
```

### **6. Información de Racha**
```http
GET /api/sessions/streak
Authorization: Bearer <jwt_token>
```

---

## ⏱️ **Implementación del Timer**

### **Flujo de Trabajo Recomendado**

#### **1. Iniciar Sesión**
```javascript
// 1. Usuario hace clic en "Start Session"
const startSession = async (sessionType, duration) => {
  try {
    const response = await fetch('/api/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sessionType, duration })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // 2. Iniciar timer local
      startLocalTimer(data.session);
      // 3. Actualizar UI
      updateSessionUI(data.session);
    }
  } catch (error) {
    console.error('Error starting session:', error);
  }
};
```

#### **2. Timer Local**
```javascript
let sessionTimer = null;
let sessionStartTime = null;
let sessionDuration = 0;

const startLocalTimer = (session) => {
  sessionStartTime = new Date(session.startTime);
  sessionDuration = session.duration;
  
  sessionTimer = setInterval(() => {
    const elapsed = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
    const remaining = sessionDuration - elapsed;
    
    if (remaining <= 0) {
      // Sesión completada automáticamente
      completeSession(session.id, sessionDuration);
      clearInterval(sessionTimer);
    } else {
      // Actualizar UI con tiempo restante
      updateTimerUI(remaining);
    }
  }, 1000);
};
```

#### **3. Pausar/Reanudar**
```javascript
const pauseSession = () => {
  if (sessionTimer) {
    clearInterval(sessionTimer);
    sessionTimer = null;
    // Marcar como pausada en UI
  }
};

const resumeSession = () => {
  if (!sessionTimer) {
    startLocalTimer(currentSession);
    // Marcar como activa en UI
  }
};
```

#### **4. Finalizar Sesión**
```javascript
const completeSession = async (sessionId, completedTime) => {
  try {
    const response = await fetch(`/api/sessions/${sessionId}/end`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ completedTime })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Mostrar resultados
      showSessionResults(data);
      // Limpiar timer
      clearInterval(sessionTimer);
      sessionTimer = null;
    }
  } catch (error) {
    console.error('Error completing session:', error);
  }
};
```

---

## 🎯 **Estados de Sesión**

### **Estados Posibles:**
- **`isCompleted: false, isCancelled: false`** → Sesión activa
- **`isCompleted: true`** → Sesión completada exitosamente
- **`isCancelled: true`** → Sesión cancelada por el usuario
- **`isPaused: true`** → Sesión pausada (manejado en frontend)

### **Transiciones de Estado:**
1. **Iniciar** → `isCompleted: false, isCancelled: false`
2. **Completar** → `isCompleted: true`
3. **Cancelar** → `isCancelled: true`

---

## 📊 **Tipos de Sesión**

### **Configuración Recomendada:**
```javascript
const SESSION_TYPES = {
  focus: {
    duration: 1500,        // 25 minutos
    label: "Focus Session"
  },
  short_break: {
    duration: 300,         // 5 minutos
    label: "Short Break"
  },
  long_break: {
    duration: 900,         // 15 minutos
    label: "Long Break"
  }
};
```

---

## 🔄 **Sincronización**

### **Al Cargar la Aplicación:**
```javascript
// Verificar si hay sesión activa
const checkActiveSession = async () => {
  try {
    const response = await fetch('/api/sessions/active', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    
    if (data.session) {
      // Reanudar timer con sesión existente
      startLocalTimer(data.session);
      updateSessionUI(data.session);
    }
  } catch (error) {
    console.error('Error checking active session:', error);
  }
};
```

### **Manejo de Errores de Red:**
```javascript
// Si se pierde conexión, continuar con timer local
// Al recuperar conexión, sincronizar estado
const syncSessionState = async () => {
  const activeSession = await checkActiveSession();
  if (activeSession) {
    // Comparar tiempo local vs servidor
    // Ajustar si hay diferencias significativas
  }
};
```

---

## 🎨 **UI/UX Recomendaciones**

### **Componentes Necesarios:**
1. **Timer Display** - Mostrar tiempo restante en formato MM:SS
2. **Session Controls** - Start, Pause, Resume, Cancel, Complete
3. **Session Type Selector** - Focus, Short Break, Long Break
4. **Progress Bar** - Mostrar progreso de la sesión
5. **Session Status** - Activa, Pausada, Completada

### **Estados Visuales:**
- **🟢 Activa** - Timer corriendo, controles disponibles
- **🟡 Pausada** - Timer detenido, botón resume disponible
- **🔴 Completada** - Mostrar resultados, botón nueva sesión

---

## 🚀 **Implementación Paso a Paso**

### **1. Configuración Inicial**
```javascript
// Configurar token de autenticación
const token = localStorage.getItem('authToken');

// Configurar tipos de sesión
const SESSION_CONFIG = {
  focus: { duration: 1500, label: "Focus" },
  short_break: { duration: 300, label: "Short Break" },
  long_break: { duration: 900, label: "Long Break" }
};
```

### **2. Componente Timer**
```javascript
class SessionTimer {
  constructor() {
    this.timer = null;
    this.currentSession = null;
    this.onTick = null;
    this.onComplete = null;
  }
  
  start(session) {
    this.currentSession = session;
    this.startTime = new Date(session.startTime);
    this.duration = session.duration;
    
    this.timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTime.getTime()) / 1000);
      const remaining = this.duration - elapsed;
      
      if (this.onTick) this.onTick(remaining);
      
      if (remaining <= 0) {
        this.stop();
        if (this.onComplete) this.onComplete();
      }
    }, 1000);
  }
  
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  
  pause() {
    this.stop();
  }
  
  resume() {
    if (this.currentSession) {
      this.start(this.currentSession);
    }
  }
}
```

### **3. Integración con API**
```javascript
class SessionManager {
  constructor() {
    this.timer = new SessionTimer();
    this.setupTimerCallbacks();
  }
  
  setupTimerCallbacks() {
    this.timer.onTick = (remaining) => {
      this.updateTimerDisplay(remaining);
    };
    
    this.timer.onComplete = () => {
      this.completeCurrentSession();
    };
  }
  
  async startSession(type) {
    const config = SESSION_CONFIG[type];
    
    try {
      const response = await this.apiCall('/api/sessions', {
        method: 'POST',
        body: { sessionType: type, duration: config.duration }
      });
      
      if (response.session) {
        this.timer.start(response.session);
        this.updateSessionUI(response.session);
      }
    } catch (error) {
      console.error('Error starting session:', error);
    }
  }
  
  async completeSession(sessionId, completedTime) {
    try {
      const response = await this.apiCall(`/api/sessions/${sessionId}/end`, {
        method: 'PUT',
        body: { completedTime }
      });
      
      this.showSessionResults(response);
      this.timer.stop();
    } catch (error) {
      console.error('Error completing session:', error);
    }
  }
  
  apiCall(endpoint, options = {}) {
    return fetch(`https://tu-backend.onrender.com${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }).then(res => res.json());
  }
}
```

---

## 📱 **Ejemplo de Uso Completo**

```javascript
// Inicializar
const sessionManager = new SessionManager();

// Al hacer clic en "Start Focus Session"
document.getElementById('start-focus').addEventListener('click', () => {
  sessionManager.startSession('focus');
});

// Al hacer clic en "Pause"
document.getElementById('pause').addEventListener('click', () => {
  sessionManager.timer.pause();
});

// Al hacer clic en "Resume"
document.getElementById('resume').addEventListener('click', () => {
  sessionManager.timer.resume();
});

// Al hacer clic en "Complete"
document.getElementById('complete').addEventListener('click', () => {
  sessionManager.completeCurrentSession();
});
```

---

## 🔧 **Troubleshooting**

### **Problemas Comunes:**

1. **Timer no sincroniza con servidor**
   - Verificar que `startTime` del servidor se use como referencia
   - Implementar sincronización periódica

2. **Sesión duplicada**
   - Verificar sesión activa antes de iniciar nueva
   - Usar endpoint `/api/sessions/active`

3. **Token expirado**
   - Implementar refresh token
   - Redirigir a login si es necesario

4. **Pérdida de conexión**
   - Continuar con timer local
   - Sincronizar al recuperar conexión

---

## 📝 **Notas Importantes**

- **Siempre usar el `startTime` del servidor** como referencia para el timer
- **Implementar manejo de errores** para todas las llamadas API
- **Validar datos** antes de enviar al servidor
- **Mantener UI sincronizada** con el estado del servidor
- **Implementar feedback visual** para todas las acciones

---

**¿Necesitas ayuda con alguna implementación específica o tienes preguntas sobre algún endpoint?** 