# Barrio Blindado

Sistema de gestión integral para barrios privados. Controla accesos, propietarios, viviendas, vehículos y reclamos desde un único lugar.

## Funcionalidades principales

- **Control de accesos** — Registro de ingresos y egresos con credenciales de identificación de personas.
- **Propietarios y viviendas** — Gestión de propietarios asociados a sus respectivas casas dentro del barrio.
- **Vehículos** — Registro de vehículos que ingresan y egresan del barrio.
- **Reclamos** — Sistema de registro y seguimiento de reclamos de los residentes.

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Backend | Laravel 13 (PHP 8.3) |
| Frontend | React 19 + Inertia.js v3 |
| Estilos | Tailwind CSS v4 |
| Componentes UI | shadcn/ui |
| Autenticación | Laravel Fortify |
| Rutas tipadas | Laravel Wayfinder |
| Tests | Pest v4 |

## Requisitos previos

- PHP 8.3+
- Composer 2+
- Node.js 20+ y npm
- MySQL o MariaDB

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Imaginar-Company/barrio-blindado.git
cd barrio-blindado
```

### 2. Instalar dependencias PHP

```bash
composer install
```

### 3. Configurar el entorno

```bash
cp .env.example .env
php artisan key:generate
```

Editá el archivo `.env` con tus credenciales de base de datos:

```env
DB_CONNECTION=sqlite
# O para MySQL/PostgreSQL:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=barrio_blindado
# DB_USERNAME=tu_usuario
# DB_PASSWORD=tu_contraseña
```

### 4. Ejecutar migraciones

```bash
php artisan migrate
```

Opcionalmente, poblar la base de datos con datos de prueba:

```bash
php artisan db:seed
```

### 5. Instalar dependencias frontend y compilar assets

```bash
npm install
npm run build
```

## Levantar el entorno de desarrollo

El siguiente comando levanta el servidor PHP, la cola de jobs, los logs en tiempo real y Vite en paralelo:

```bash
composer run dev
```

O de forma simplificada (sin cola ni logs):

```bash
composer run dev:lite
```

La aplicación estará disponible en `http://localhost:8000`.

## Ejecutar los tests

```bash
php artisan test --compact
```

## Comandos útiles

```bash
# Limpiar caché de configuración
php artisan config:clear

# Ver rutas registradas
php artisan route:list --except-vendor

# Regenerar rutas tipadas para el frontend (Wayfinder)
php artisan wayfinder:generate

# Formatear código PHP con Pint
vendor/bin/pint
```

## Licencia

MIT

