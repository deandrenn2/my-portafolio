'use client'
import Image from 'next/image'
import '../contacts/contacts.css'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import Foto from '@/Img/30e94844-a5b5-4ac5-a00d-c4dea890015d-1.png'
import { ContactSetting } from '@/payload-types'

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

        try {
            const res = await fetch('/api/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })

            if (!res.ok) throw new Error()

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
