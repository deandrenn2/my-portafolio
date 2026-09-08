import { generateCaptcha } from '@/lib/captcha'

export const dynamic = 'force-dynamic'

export const GET = async () => {
    const challenge = generateCaptcha()
    return Response.json(challenge)
}
