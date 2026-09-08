# Despliegue en Dokploy

Este proyecto es una app Next.js 15 + Payload CMS 3 con base de datos SQLite.
Se despliega en Dokploy como una aplicacion tipo **Dockerfile**.

## 1. Crear la aplicacion en Dokploy

1. En tu proyecto de Dokploy, crea una nueva **Application**.
2. Origen: **Git provider**, apuntando al repo `deandrenn2/my-portafolio`
   (rama `main`).
3. Build type: **Dockerfile** (usa el `Dockerfile` que ya esta en la raiz
   del repo, no hace falta indicar ruta distinta).
4. Puerto expuesto por el contenedor: **3000**.

## 2. Variables de entorno

En la pestana **Environment** de la aplicacion, agrega:

```
DATABASE_URI=file:./data/portafolio.db
PAYLOAD_SECRET=<genera una cadena aleatoria larga, p. ej. openssl rand -base64 32>
GMAIL_USER=<correo gmail usado para el formulario de contacto>
GMAIL_PASS=<contrasena de aplicacion de gmail>
```

`PAYLOAD_SECRET` debe ser un valor secreto unico de produccion, no
reutilices el que usas en local.

## 3. Almacenamiento persistente (volumenes)

La app usa SQLite (un archivo, no un servidor de base de datos) y guarda los
archivos subidos (Media) en el sistema de archivos local. Como el contenedor
se reconstruye en cada despliegue, **sin volumenes montados perderias la
base de datos y las imagenes subidas en cada deploy**.

En la pestana **Advanced -> Volumes** de la aplicacion, agrega dos montajes:

| Volumen (nombre)      | Ruta dentro del contenedor |
|------------------------|-----------------------------|
| `portafolio-data`      | `/app/data`                 |
| `portafolio-media`     | `/app/media`                |

El Dockerfile ya crea ambas carpetas con los permisos correctos para el
usuario `nextjs` que ejecuta la app.

Asegurate de que `DATABASE_URI` apunte dentro de `/app/data`, tal como se
indico arriba (`file:./data/portafolio.db`).

## 4. Migraciones de base de datos

El proyecto usa el sistema de migraciones de Payload en vez del modo
`push` (que solo es para desarrollo local). Esto ya esta configurado en
`src/payload.config.ts`:

```ts
db: sqliteAdapter({
  client: { url: process.env.DATABASE_URI || '' },
  prodMigrations: migrations, // ejecuta migraciones pendientes al iniciar, solo en produccion
}),
```

Con `prodMigrations`, cada vez que el contenedor arranca con
`NODE_ENV=production` (como en el Dockerfile), Payload revisa la tabla
`payload_migrations` dentro de tu base de datos persistida en
`/app/data` y aplica cualquier migracion que falte, automaticamente y
antes de que la app quede lista para recibir trafico. No necesitas correr
ningun comando manual en Dokploy para esto.

Ya existe una migracion inicial (`src/migrations/20260908_..._init.ts`)
que crea todo el esquema actual (Users, Media, Projects, Experience,
Services, Apps, Blog, Contacts, Profile) desde cero. Es la que se
ejecutara la primera vez que despliegues con una base de datos vacia.

### Flujo de trabajo para cambios futuros

Cada vez que agregues o modifiques un campo/coleccion en Payload:

1. En local, con la app corriendo en modo dev (`pnpm dev`), Payload
   sincroniza el esquema automaticamente (modo `push`) para que puedas
   iterar rapido.
2. Cuando el cambio este listo, genera la migracion correspondiente:

   ```bash
   pnpm run migrate:create nombre-descriptivo
   ```

   Esto compara tu configuracion actual contra el ultimo snapshot y
   escribe un nuevo archivo en `src/migrations/`, actualizando tambien
   `src/migrations/index.ts`.
3. Revisa el SQL generado (arriba `up`, abajo `down`) antes de continuar.
4. Haz commit de los nuevos archivos de migracion junto con el cambio de
   codigo, y push a `main`.
5. Al desplegar en Dokploy, el contenedor arrancara, aplicara la(s)
   migracion(es) nueva(s) automaticamente gracias a `prodMigrations`, y
   luego servira la app.

Otros comandos utiles (ya agregados a `package.json`):

```bash
pnpm run migrate:status   # ver que migraciones se han aplicado
pnpm run migrate          # aplicar migraciones pendientes manualmente
pnpm run migrate:down     # revertir el ultimo batch de migraciones
```

## 5. Dominio y HTTPS

En la pestana **Domains**, agrega tu dominio (o subdominio) y activa
**Let's Encrypt** para HTTPS automatico. Dokploy hace el proxy hacia el
puerto 3000 del contenedor.

## 6. Deploy

Con todo configurado, dispara el **Deploy**. Dokploy clonara el repo,
construira la imagen con el `Dockerfile` y levantara el contenedor. Al
iniciar, se aplicara automaticamente la migracion inicial sobre la base
de datos vacia del volumen `/app/data`.

La primera vez que entres a `/admin` en tu dominio, Payload te pedira crear
el primer usuario administrador.

## 7. Redeploys posteriores

Con los volumenes configurados, cada nuevo `git push` a `main` (o
redeploy manual desde Dokploy) reconstruye la imagen pero conserva la base
de datos y los archivos de `/app/media`, ya que viven fuera del contenedor.
Cualquier migracion nueva que hayas agregado se aplica automaticamente al
arrancar.

## Notas

- El `docker-compose.yml` del repo es solo para desarrollo local con
  MongoDB y **no se usa** en este despliegue (la app en produccion usa
  SQLite via Dockerfile, no ese compose).
- Si en algun momento cambias a Postgres/MySQL/Mongo en produccion,
  necesitaras generar migraciones nuevas para ese adaptador y desplegar
  ese motor de base de datos como servicio aparte en Dokploy, ademas de
  actualizar `DATABASE_URI`.
- Nunca corras `migrate:fresh` o `migrate:reset` contra la base de datos
  de produccion: borran todas las tablas.
