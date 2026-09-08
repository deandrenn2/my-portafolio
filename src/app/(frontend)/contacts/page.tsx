'use client'
import Image from 'next/image'
import '../contacts/contacts.css'
import { useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import Foto from '@/Img/30e94844-a5b5-4ac5-a00d-c4dea890015d-1.png'
import { ContactSetting } from '@/payload-types'

interface Captcha {
    question: string
    token: string
}

const ContactsPage = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        message: '',
    })

    const [errors, setErrors] = useState<string[]>([])
    const [contactPhotoUrl, setContactPhotoUrl] = useState<string | null>(null)

    // Captcha matemático propio (sin servicios externos): el servidor genera
    // la pregunta y firma la respuesta dentro del token.
    const [captcha, setCaptcha] = useState<Captcha | null>(null)
    const [captchaAnswer, setCaptchaAnswer] = useState('')
    const [captchaError, setCaptchaError] = useState(false)

    // Campo señuelo (honeypot): debe quedar siempre vacío para humanos.
    const [website, setWebsite] = useState('')

    // Marca de tiempo de cuando se mostró el formulario, para detectar envíos
    // sospechosamente rápidos (bots).
    const startedAtRef = useRef(Date.now())

    const loadCaptcha = async () => {
        try {
            const res = await fetch('/api/captcha')
            const data = (await res.json()) as Captcha
            setCaptcha(data)
            setCaptchaAnswer('')
            startedAtRef.current = Date.now()
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        const getContactSettings = async () => {
            try {
                const res = await fetch('/api/globals/contact-settings')
                const data = await res.json() as ContactSetting
                if (data.photo && typeof data.photo === 'object' && data.photo.url) {
                    setContactPhotoUrl(data.photo.url)
                }
            } catch (error) {
                console.error(error)
            }
        }
        getContactSettings()
        loadCaptcha()
    }, [])

    const handleChange = (e: any) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })

        if (errors.includes(e.target.name)) {
            setErrors(errors.filter(error => error !== e.target.name))
        }
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        const camposAValidar = ['name', 'email', 'phone', 'city']
        const nuevosErrores = camposAValidar.filter(campo => !form[campo as keyof typeof form])

        if (nuevosErrores.length > 0) {
            setErrors(nuevosErrores)
            Swal.fire({
                title: "Campos incompletos",
                text: "Por favor, llena los campos resaltados",
                icon: "warning",
                timer: 3000,
                timerProgressBar: true,
                confirmButtonColor: '#a730d6'
            })
            return
        }

        if (!captcha || !captchaAnswer.trim()) {
            setCaptchaError(true)
            Swal.fire({
                title: "Verificación pendiente",
                text: "Resuelve la operación para confirmar que no eres un robot",
                icon: "warning",
                timer: 3000,
                timerProgressBar: true,
                confirmButtonColor: '#a730d6'
            })
            return
        }

        try {
            const res = await fetch('/api/contact-submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    website, // honeypot, debe llegar vacío
                    captchaToken: captcha.token,
                    captchaAnswer,
                    startedAt: startedAtRef.current,
                }),
            })

            const data = await res.json().catch(() => null)

            if (!res.ok || !data?.success) {
                if (data?.error === 'Captcha incorrecto') {
                    setCaptchaError(true)
                    await loadCaptcha()
                    Swal.fire({
                        title: "Captcha incorrecto",
                        text: "Resuelve nuevamente la operación matemática",
                        icon: "error",
                        timer: 3000,
                        timerProgressBar: true
                    })
                    return
                }
                throw new Error(data?.error || 'Error desconocido')
            }

            Swal.fire({
                title: "¡Enviado!",
                text: "Tu mensaje ha sido enviado correctamente",
                icon: "success",
                timer: 3500,
                timerProgressBar: true,
                showConfirmButton: false,
                draggable: true
            })

            setForm({ name: '', email: '', phone: '', city: '', message: '' })
            setErrors([])
            setCaptchaError(false)
            await loadCaptcha()

        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "No se pudo enviar el mensaje",
                icon: "error",
                timer: 3000,
                timerProgressBar: true
            })
        }
    }

    const inputStyle = (name: string) => ({
        border: errors.includes(name) ? '2px solid #ff4d4d' : '1px solid #ddd',
        outline: 'none'
    })

    return (
        <div className="contacts-container">
            <div className="contacts-content">
                <div className="contacts-header">
                    <h1 className="contacts-title">Contacto</h1>

                    <form className='contacts-inputs' onSubmit={handleSubmit}>
                        <input
                            name="name"
                            placeholder="Nombre Completo"
                            value={form.name}
                            onChange={handleChange}
                            style={inputStyle('name')}
                        />
                        <input
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            style={inputStyle('email')}
                        />
                        <input
                            name="phone"
                            placeholder="Teléfono"
                            value={form.phone}
                            onChange={handleChange}
                            style={inputStyle('phone')}
                        />
                        <input
                            name="city"
                            placeholder="Ciudad"
                            value={form.city}
                            onChange={handleChange}
                            style={inputStyle('city')}
                        />
                        <textarea
                            name="message"
                            placeholder="Mensaje"
                            value={form.message}
                            onChange={handleChange}
                        />

                        {/* Honeypot: oculto para personas, visible para bots que
                            rellenan todos los campos del formulario. */}
                        <input
                            type="text"
                            name="website"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            className="contacts-honeypot"
                            tabIndex={-1}
                            autoComplete="off"
                            aria-hidden="true"
                        />

                        <div className="contacts-captcha">
                            <label htmlFor="captchaAnswer" className="contacts-captcha-label">
                                {captcha ? captcha.question : 'Cargando verificación...'}
                            </label>
                            <input
                                id="captchaAnswer"
                                name="captchaAnswer"
                                type="text"
                                inputMode="numeric"
                                placeholder="Tu respuesta"
                                value={captchaAnswer}
                                onChange={(e) => {
                                    setCaptchaAnswer(e.target.value)
                                    setCaptchaError(false)
                                }}
                                style={{
                                    border: captchaError ? '2px solid #ff4d4d' : '1px solid #ddd',
                                    outline: 'none',
                                    maxWidth: '160px',
                                }}
                            />
                        </div>

                        <div className="contacts-btn">
                            <button type="submit" className='contacts-button'>
                                Enviar Mensaje
                            </button>
                        </div>
                    </form>
                </div>
                <div className="contacts-foto-box">
                    <Image
                        src={contactPhotoUrl || Foto}
                        alt="Foto"
                        className='contacts-foto'
                        width={340}
                        height={480}
                        unoptimized={!!contactPhotoUrl}
                    />
                </div>
            </div>
        </div>
    )
}

export default ContactsPage
