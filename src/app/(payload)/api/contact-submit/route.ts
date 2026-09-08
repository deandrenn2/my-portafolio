import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { verifyCaptcha } from '@/lib/captcha'

export const dynamic = 'force-dynamic'

// Tiempo mínimo (ms) entre que se cargó el formulario y se envió.
// Los bots suelen enviar en milisegundos; un humano tarda más.
const MIN_FILL_TIME_MS = 1500

export const POST = async (request: Request) => {
    let body: Record<string, unknown>
    try {
        body = await request.json()
    } catch {
        return Response.json({ success: false, error: 'Solicitud inválida' }, { status: 400 })
    }

    const {
        name,
        email,
        phone,
        city,
        message,
        // Campo señuelo: invisible para personas, atractivo para bots.
        // Si viene relleno, el envío es de un bot.
        website,
        captchaToken,
        captchaAnswer,
        startedAt,
    } = body as Record<string, string | number | undefined>

    // Honeypot: si el bot llenó este campo, respondemos "éxito" sin hacer nada
    // para no delatar que fue detectado.
    if (typeof website === 'string' && website.trim() !== '') {
        return Response.json({ success: true })
    }

    // Chequeo de velocidad: envíos casi instantáneos suelen ser bots.
    if (typeof startedAt === 'number' && Date.now() - startedAt < MIN_FILL_TIME_MS) {
        return Response.json({ success: false, error: 'Captcha incorrecto' }, { status: 400 })
    }

    if (!verifyCaptcha(captchaToken as string, captchaAnswer as string)) {
        return Response.json({ success: false, error: 'Captcha incorrecto' }, { status: 400 })
    }

    if (!name || !email || !message) {
        return Response.json({ success: false, error: 'Faltan campos requeridos' }, { status: 400 })
    }

    try {
        const payload = await getPayload({ config: configPromise })

        await payload.create({
            collection: 'contacts',
            data: {
                name: String(name),
                email: String(email),
                phone: phone ? String(phone) : undefined,
                city: city ? String(city) : undefined,
                message: String(message),
            },
        })

        return Response.json({ success: true })
    } catch (error) {
        console.error('Error creando contacto:', error)
        return Response.json({ success: false, error: 'No se pudo enviar el mensaje' }, { status: 500 })
    }
}
