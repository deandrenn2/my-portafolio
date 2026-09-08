// storage-adapter-import-placeholder
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Profile } from './collections/globals/Profile'
import { Projects } from './collections/Projects'
import { Experience } from './collections/Experience'
import { Apps } from './collections/apps'
import { Blog } from './collections/Blog'
import { Services } from './collections/Services'
import { Contacts } from './collections/Contacts'
import { migrations } from './migrations'


const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Projects,
    Experience,
    Services,
    Apps,
    Blog,
    Contacts,
  ],
  globals: [Profile],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || '',
    },
    // In production, run any pending migrations automatically on startup
    // instead of relying on Drizzle's `db push` (dev-only schema sync).
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [
    // storage-adapter-placeholder
  ],
})
