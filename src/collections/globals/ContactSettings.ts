import { GlobalConfig } from 'payload';

export const ContactSettings: GlobalConfig = {
  slug: 'contact-settings',
  label: 'Página de Contacto',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen de contacto',
      admin: {
        description: 'Imagen mostrada junto al formulario de contacto.',
      },
    },
  ],
};
