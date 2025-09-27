# ADA Hair Salon API

API REST para el sistema de reservas del salón de belleza ADA Hair Salon, desarrollada con Node.js, Express, TypeScript y MongoDB.

## ��� Características

- **Autenticación JWT**: Sistema seguro de login y registro
- **Gestión de usuarios**: Registro, login, perfil y actualización
- **Sistema de reservas**: CRUD completo con verificación de disponibilidad
- **Roles de usuario**: Usuario normal y administrador
- **Base de datos MongoDB**: Con Mongoose ODM
- **Validación de datos**: Validación robusta con mensajes de error
- **API RESTful**: Endpoints bien estructurados

## ��� Requisitos

- Node.js (v16 o superior)
- MongoDB (local o MongoDB Atlas)
- npm o yarn

## ���️ Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd ADA_Hair_Salon_API
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar las variables según tu configuración
```

4. **Configurar MongoDB**

### Opción A: MongoDB Local
- Instalar MongoDB en tu sistema
- Asegurarse de que esté corriendo en el puerto 27017

### Opción B: MongoDB Atlas (Recomendado para deploy)
- Crear una cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
- Crear un cluster gratuito
- Obtener la cadena de conexión
- Actualizar `MONGODB_URI` en el archivo `.env`

5. **Ejecutar la aplicación**
```bash
# Modo desarrollo
npm run dev

# O compilar y ejecutar
npm run build
npm start
```

## ��� Datos de prueba

Para insertar datos de prueba (usuarios y reservas):

```bash
npm run seed
```

**Credenciales de prueba:**
- **Admin**: usuario: `admin`, contraseña: `admin123`
- **Usuario**: usuario: `valeria`, contraseña: `user123`

## ��� Endpoints de la API

### Autenticación
- `POST /api/users/register` - Registro de usuario
- `POST /api/users/login` - Login de usuario
- `GET /api/users/profile` - Obtener perfil (requiere autenticación)
- `PUT /api/users/profile` - Actualizar perfil (requiere autenticación)

### Reservas
- `GET /api/reservations` - Obtener mis reservas (requiere autenticación)
- `GET /api/reservations/:id` - Obtener reserva por ID (requiere autenticación)
- `POST /api/reservations` - Crear nueva reserva (requiere autenticación)
- `PUT /api/reservations/:id` - Actualizar reserva (requiere autenticación)
- `DELETE /api/reservations/:id` - Eliminar reserva (requiere autenticación)

### Administración
- `GET /api/reservations/admin/all` - Obtener todas las reservas (solo admin)
- `GET /api/reservations/admin/date/:date` - Obtener reservas por fecha (solo admin)

## ��� Estructura del proyecto

```
ADA_Hair_Salon_API/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts          # Configuración de MongoDB
│   │   ├── controllers/
│   │   │   ├── users-controller.ts  # Controladores de usuarios
│   │   │   └── reservations-controller.ts # Controladores de reservas
│   │   ├── middleware/
│   │   │   ├── auth-middleware.ts   # Middleware de autenticación
│   │   │   ├── error-handler.ts     # Manejo de errores
│   │   │   └── validate-middleware.ts # Validación de datos
│   │   ├── models/
│   │   │   ├── User.ts              # Modelo de usuario (Mongoose)
│   │   │   └── Reservation.ts       # Modelo de reserva (Mongoose)
│   │   ├── routes/
│   │   │   ├── users-routes.ts      # Rutas de usuarios
│   │   │   └── reservations-routes.ts # Rutas de reservas
│   │   └── index.ts                 # Punto de entrada de la aplicación
│   └── tsconfig.json               # Configuración de TypeScript
├── scripts/
│   └── seed-data.js                # Script para datos de prueba
├── public/                         # Archivos estáticos (frontend)
├── .env                           # Variables de entorno
└── package.json                   # Dependencias y scripts
```

## ���️ Base de datos

### Colecciones MongoDB:

#### Users
```javascript
{
  _id: ObjectId,
  username: String (único),
  password: String (hasheada),
  email: String (único),
  name: String,
  phone: String,
  role: String (enum: ['user', 'admin']),
  createdAt: Date,
  updatedAt: Date
}
```

#### Reservations
```javascript
{
  _id: ObjectId,
  date: String (YYYY-MM-DD),
  time: String (HH:MM),
  service: String,
  notes: String,
  status: String (enum: ['confirmado', 'cancelado', 'completado', 'pendiente']),
  price: Number,
  userId: ObjectId (referencia a User),
  createdAt: Date,
  updatedAt: Date
}
```

## ��� Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación. Incluye el token en el header:

```
Authorization: Bearer <tu-token>
```

## ��� Deploy

### Heroku + MongoDB Atlas
1. Crear cuenta en [Heroku](https://heroku.com)
2. Crear cuenta en [MongoDB Atlas](https://mongodb.com/atlas)
3. Configurar variables de entorno en Heroku
4. Conectar repositorio y hacer deploy

### Variables de entorno para producción:
```
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/ada_hair_salon
JWT_SECRET=secreto_super_seguro_para_produccion
PORT=3000
```

## ��� Ejemplos de uso

### Registro de usuario
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "nuevo_usuario",
    "password": "password123",
    "email": "usuario@example.com",
    "name": "Usuario Nuevo",
    "phone": "1234567890"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "nuevo_usuario",
    "password": "password123"
  }'
```

### Crear reserva
```bash
curl -X POST http://localhost:3000/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu-token>" \
  -d '{
    "date": "2024-12-25",
    "time": "10:30",
    "service": "Corte de cabello",
    "notes": "Corte moderno",
    "price": 25.00
  }'
```

## ��� Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## ��� Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## ��� Autores

- **Tu Nombre** - *Desarrollo inicial* - [TuGitHub](https://github.com/tuusuario)

## ��� Agradecimientos

- ADA School por la oportunidad de aprendizaje
- Comunidad de desarrolladores de Node.js
- Documentación de MongoDB y Mongoose
