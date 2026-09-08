# Despliegue en Dokploy

Este proyecto es una app Next.js 15 + Payload CMS 3 con base de datos SQLite.
Se despliega en Dokploy como una aplicación tipo **Dockerfile**.

## 1. Crear la aplicación en Dokploy

1. En tu proyecto de Dokploy, crea una nueva **Application**.
2. Origen: **Git provider**, apuntando al repo `deandrenn2/my-portafolio`
   (rama `main`).
3. Build type: **Dockerfile** (usa el `Dockerfile` que ya está en la raýz
   del repo, no hace falta indicar ruta distinta).
4. Puerto expuesto por el contenedor: **3000**.

## 2. Variables de entorno

En la pestaña **Environment** de la aplicación, agrega:

```
DATABASE_URI=file:./data/portafolio.db
PAYLOAD_SECRET=<genera una cadena aleatoria larga, p. ej. openssl rand -base64 32>
GMAIL_USER=<correo gmail usado para el formulario de contacto>
GMAIL_PASS=<contraseña de aplicación de gmail>
```

`PAYLOAD_SECRET` debe ser un valor secreto único de producción — no
reutilices el que usas en local.

## 3. Almacenamiento persistente (volúmenes)

La app usa SQLite (un archivo, no un servidor de base de datos) y guarda los
archivos subidos (Media) en el sistema de archivos local. Como el contenedor
se reconstruye en cada despliegue, **sin volúmenes montados perderías la
base de datos y las imágenes subidas en cada deploy**.

En la pestaña **Advanced → Volumes** de la aplicación, agrega dos montajes:

| Volumen (nombre)      | Ruta dentro del contenedor |
|------------------------|-----------------------------|
| `portafolio-data`      | `/app/data`                 |
| `portafolio-media`     | `/app/media`                |

El Dockerfile ya crea ambas carpetas con los permisos correctos para el
usuario `nextjs` que ejecuta la app.

Asegúrate de que `DATABASE_URI` apunte dentro de `/app/data`, tal como se
indicó arriba (`file:./data/portafolio.db`).

## 4. Dominio y HTTPS

En la pestaña **Domains**, agrega tu dominio (o subdominio) y activa
**Let's Encrypt** para HTTPS automático. Dokploy hace el proxy hacia el
puerto 3000 del contenedor.

## 5. Deploy

Con todo configurado, dispara el **Deploy**. Dokploy clonará el repo,
construirá la imagen con el `Dockerfile` y levantará el contenedor.

La primera vez que entres a `/admin` en tu dominio, Payload te pedirá crear
el primer usuario administrador.

## 6. Redeploys posteriores

Con los volúmenes configurados, cada nuevo `git push` a `main` (o
redeploy manual desde Dokploy) reconstruye la imagen pero conserva la base
de datos y los archivos de `/app/media`, ya que viven fuera del contenedor.

## Notas

- El `docker-compose.yml` del repo es solo para desarrollo local con
  MongoDB y **no se usa** en este despliegue (la app en producción usa
  SQLite vía Dockerfile, no ese compose).
- Si en algún momento cambias a Postgres/MySQL/Mongo en producción, deberás
  además desplegar ese motor de base de datos como servicio aparte en
  Dokploy y actualizar `DATABASE_URI`.
