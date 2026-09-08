import crypto from 'crypto'

/**
 * Captcha matemático "práctico": no depende de servicios externos (reCAPTCHA,
 * hCaptcha, etc.) ni de sesión/base de datos. El reto (dos números y su
 * resultado) viaja firmado con HMAC dentro de un token que el cliente debe
 * devolver junto con la respuesta. Así el servidor puede verificarlo sin
 * guardar nada.
 */

const TTL_MS = 5 * 60 * 1000 // el reto expira a los 5 minutos

function getSecret(): string {
    const secret = process.env.PAYLOAD_SECRET
    if (!secret) {
        throw new Error('PAYLOAD_SECRET no está configurado')
    }
    return secret
}

function sign(payload: string): string {
    return crypto.createHmac('sha256', getSecret()).update(payload).digest('hex')
}

export interface CaptchaChallenge {
    question: string
    token: string
}

/** Genera un reto simple (suma de dos números de un dígito). */
export function generateCaptcha(): CaptchaChallenge {
    const a = crypto.randomInt(1, 10)
    const b = crypto.randomInt(1, 10)
    const answer = a + b
    const exp = Date.now() + TTL_MS

    const payload = `${answer}.${exp}`
    const signature = sign(payload)
    const token = Buffer.from(`${payload}.${signature}`).toString('base64url')

    return {
        question: `¿Cuánto es ${a} + ${b}?`,
        token,
    }
}

/** Verifica la respuesta del usuario contra el token firmado. */
export function verifyCaptcha(token: string | undefined | null, answer: string | undefined | null): boolean {
    if (!token || answer === undefined || answer === null || answer === '') return false

    let decoded: string
    try {
        decoded = Buffer.from(token, 'base64url').toString('utf8')
    } catch {
        return false
    }

    const parts = decoded.split('.')
    if (parts.length !== 3) return false
    const [answerStr, expStr, signature] = parts

    const expectedSignature = sign(`${answerStr}.${expStr}`)
    const signatureBuffer = Buffer.from(signature)
    const expectedBuffer = Buffer.from(expectedSignature)
    if (
        signatureBuffer.length !== expectedBuffer.length ||
        !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
        return false
    }

    const exp = Number(expStr)
    if (!Number.isFinite(exp) || Date.now() > exp) return false

    const expectedAnswer = Number(answerStr)
    const givenAnswer = Number(answer)
    if (!Number.isFinite(givenAnswer)) return false

    return expectedAnswer === givenAnswer
}
