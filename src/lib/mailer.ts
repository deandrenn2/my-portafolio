import nodemailer, { type Transporter } from 'nodemailer'

/**
 * Transporter de nodemailer para el formulario de contacto.
 *
 * Usa Gmail SMTP con una contraseña de aplicación (no la contraseña normal
 * de la cuenta). Se guarda en caché a nivel de módulo para no reconectar en
 * cada envío.
 *
 * Variables de entorno esperadas (ver .env.example):
 *   GMAIL_USER        correo desde el que se envían las notificaciones
 *   GMAIL_PASS        contraseña de aplicación de Gmail (16 caracteres)
 *   CONTACT_TO_EMAIL  (opcional) a quién llega el aviso; por defecto GMAIL_USER
 */

let transporter: Transporter | null = null

function getTransporter(): Transporter {
    const user = process.env.GMAIL_USER
    const pass = process.env.GMAIL_PASS

    if (!user || !pass) {
        throw new Error(
            'Nodemailer no está configurado: faltan GMAIL_USER y/o GMAIL_PASS en las variables de entorno.',
        )
    }

    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user, pass },
            pool: true,
            maxConnections: 1,
            maxMessages: 50,
        })
    }

    return transporter
}

/** Verifica la conexión SMTP (útil para diagnosticar credenciales). */
export async function verifyMailer(): Promise<{ ok: true } | { ok: false; error: string }> {
    try {
        await getTransporter().verify()
        return { ok: true }
    } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : String(error) }
    }
}

export interface ContactNotificationData {
    name: string
    email: string
    phone?: string | null
    city?: string | null
    message: string
}

/** Envía el aviso por correo de un nuevo mensaje de contacto. */
export async function sendContactNotification(doc: ContactNotificationData): Promise<void> {
    const user = process.env.GMAIL_USER
    const to = process.env.CONTACT_TO_EMAIL || user

    await getTransporter().sendMail({
        from: `"Formulario Web" <${user}>`,
        to,
        replyTo: doc.email,
        subject: '📩 Nuevo mensaje de contacto',
        html: `
            <h3>Nuevo mensaje</h3>
            <p><b>Nombre:</b> ${doc.name}</p>
            <p><b>Email:</b> ${doc.email}</p>
            <p><b>Teléfono:</b> ${doc.phone || '-'}</p>
            <p><b>Ciudad:</b> ${doc.city || '-'}</p>
            <p><b>Mensaje:</b></p>
            <p>${doc.message}</p>
          `,
    })
}
