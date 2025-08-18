# Editor de Texto Cloud con Firebase

Un editor de texto en la nube construido con Next.js, Firebase Auth y Firestore.

## 🚀 Características

- ✅ Autenticación con email/contraseña usando Firebase Auth
- ✅ Guardado automático en Firestore
- ✅ Gestión de múltiples documentos por usuario
- ✅ Interfaz responsive y fácil de usar
- ✅ Edición y actualización de textos en tiempo real

## 📋 Prerrequisitos

1. Node.js (versión 18 o superior)
2. Una cuenta de Firebase
3. Proyecto configurado en Firebase Console

## 🔧 Configuración de Firebase

### 1. Crear proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita Authentication y Firestore

### 2. Configurar Authentication

1. Ve a **Authentication** > **Sign-in method**
2. Habilita **Email/Password**
3. Guarda los cambios

### 3. Configurar Firestore Database

1. Ve a **Firestore Database**
2. Crea la base de datos en modo **test** (por ahora)
3. Configura las reglas de seguridad:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo usuarios autenticados pueden leer/escribir textos
    match /texts/{document} {
      allow read, write: if request.auth != null && 
        request.auth.uid == get(/databases/$(database)/documents/texts/$(document)).data.authorId;
    }
    
    // Permitir crear nuevos documentos a usuarios autenticados
    match /texts/{document} {
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.authorId;
    }
  }
}
```

### 4. Obtener configuración del proyecto

1. Ve a **Configuración del proyecto** (⚙️)
2. En la sección **Tus apps**, selecciona la app web
3. Copia las credenciales de configuración

## 🛠️ Instalación y configuración local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

### 3. Ejecutar el proyecto

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── layout.js          # Layout principal
│   ├── page.js           # Página principal
│   └── globals.css       # Estilos globales
├── components/
│   ├── Login.jsx         # Componente de autenticación
│   └── text_editor.jsx   # Editor de texto principal
├── contexts/
│   └── AuthContext.js    # Contexto de autenticación
└── util/
    └── firebase.js       # Configuración de Firebase
```

## 🎯 Uso de la aplicación

### 1. Registro/Login
- Al abrir la aplicación, verás un formulario de login
- Puedes alternar entre "Iniciar Sesión" y "Registrarse"
- Usa un email válido y una contraseña de al menos 6 caracteres

### 2. Editor de texto
- Una vez autenticado, verás el editor con:
  - Panel izquierdo: lista de tus textos guardados
  - Panel derecho: editor de texto activo
- Haz clic en "Nuevo Texto" para crear un documento nuevo
- Escribe en el campo de título y contenido
- Haz clic en "Guardar" para guardar en Firestore

### 3. Gestión de documentos
- Todos tus textos aparecen en el panel izquierdo
- Haz clic en cualquier texto para cargarlo en el editor
- Los cambios se guardan automáticamente al hacer clic en "Actualizar"

## 🔒 Seguridad

- Solo usuarios autenticados pueden acceder al editor
- Cada usuario solo puede ver y editar sus propios documentos
- Las reglas de Firestore garantizan la seguridad a nivel de base de datos
- Los tokens de autenticación se manejan automáticamente por Firebase Auth

## 🚀 Próximos pasos y mejoras

1. **Autoguardado**: Implementar guardado automático mientras escribes
2. **Compartir documentos**: Permitir compartir textos con otros usuarios
3. **Exportar**: Añadir opciones para exportar a PDF, Word, etc.
4. **Temas**: Implementar modo oscuro/claro
5. **Colaboración en tiempo real**: Permitir edición colaborativa
6. **Historial de versiones**: Guardar versiones anteriores de los documentos

## 🐛 Solución de problemas

### Error de autenticación
- Verifica que las variables de entorno estén configuradas correctamente
- Asegúrate de que Authentication esté habilitado en Firebase Console

### Error de Firestore
- Verifica que Firestore esté habilitado en tu proyecto
- Revisa las reglas de seguridad de Firestore
- Asegúrate de que el PROJECT_ID sea correcto

### Error de CORS
- Añade tu dominio a la lista de dominios autorizados en Firebase Console
- Para desarrollo local, `localhost` debería estar permitido por defecto

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.
