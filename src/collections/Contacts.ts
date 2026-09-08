import { CollectionConfig } from 'payload'
import { sendContactNotification } from '@/lib/mailer'

export const Contacts: CollectionConfig = {
    slug: 'contacts',
    access: {
        // La creación pública vía REST/GraphQL queda bloqueada: los envíos
        // reales pasan por /api/contact-submit, que valida el captcha y
        // crea el registro usando la API local (que no pasa por `access`).
        create: () => false,
    },


    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'email',
            type: 'email',
            required: true,
        },
        {
            name: 'phone',
            type: 'text',
        },
        {
            name: 'city',
            type: 'text',
        },
        {
            name: 'message',
            type: 'textarea',
            required: true,
        },
    ],

    hooks: {
        afterChange: [
            async ({ doc, operation }) => {
                if (operation !== 'create') return

                try {
                    await sendContactNotification(doc)
                } catch (error) {
                    console.error('Error enviando correo:', error)
                }
            },
        ],
    }
}
