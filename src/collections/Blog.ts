import type { CollectionConfig } from "payload";
export const Blog: CollectionConfig = {
    slug: 'blog',
    access: {
        read: () => true,

    },
    fields: [
        {
            name: 'title',
            type: 'text',
        },

        {
            name: 'description',
            type: 'textarea',
        },

        {
            name: 'publishedAt',
            type: 'date',
            label: 'Fecha de Publicacion',

        },

        {
            name: 'author',
            type: 'text',
        }
    ]
}