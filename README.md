# HelpDesk Smart Priority

HelpDesk Smart Priority es una aplicación web para gestionar tickets de soporte técnico en una institución educativa. Permite crear, listar, ver detalles, actualizar y eliminar tickets desde una interfaz web con un backend Node.js + Express.

## Tecnologías utilizadas

- Node.js
- Express
- HTML, CSS, JavaScript
- Fetch API
- JSON para persistencia de datos

## Instalación

1. Instala dependencias:

```bash
npm install
```

2. Inicia la aplicación:

```bash
npm start
```

3. Abre en el navegador:

```
http://localhost:3000
```

## Endpoints

- `POST /login` - Inicio de sesión con usuario y contraseña.
- `GET /tickets` - Listar todos los tickets.
- `GET /tickets/:id` - Obtener ticket por ID.
- `POST /tickets` - Crear un ticket (requiere autenticación).
- `PUT /tickets/:id` - Actualizar ticket por ID (requiere autenticación).
- `PATCH /tickets/:id` - Actualizar ticket por ID (requiere autenticación).
- `DELETE /tickets/:id` - Eliminar ticket por ID (requiere autenticación).

## Ejemplos de uso

### Login

```bash
curl -X POST http://localhost:3000/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"admin123"}'
```

### Crear ticket

```bash
curl -X POST http://localhost:3000/tickets \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <TOKEN>' \
  -d '{"nombreSolicitante":"Ana","correo":"ana@ejemplo.com","categoria":"red","descripcion":"No hay conexión","impacto":"alto","urgencia":"alta","tiempoEstimado":2}'
```

### Listar tickets

```bash
curl http://localhost:3000/tickets
```

## Seguridad y HTTPS

HTTPS es el protocolo seguro para transferir datos entre el navegador y el servidor. Cifra la información, protege credenciales y evita que terceros intercepten o modifiquen las solicitudes.

Con HTTPS se mitigan riesgos como:

- Robo de credenciales
- Ataques "man-in-the-middle"
- Interceptación de datos sensibles

Es importante en aplicaciones web porque protege los datos de usuarios y asegura que la comunicación sea confiable.

## Usuario de prueba

- Usuario: `admin`
- Contraseña: `admin123`

## Evidencias

Incluye capturas de:

- Estructura del proyecto
- Servidor ejecutándose
- Pruebas de endpoints
- Formulario funcionando
- Repositorio GitHub
# HelpDesk-Smart-Priority
