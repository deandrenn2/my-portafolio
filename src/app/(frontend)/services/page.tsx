'use client'
import '../services/services.css'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const ServicesPage = () => {
    const router = useRouter();
    const [services, setServices] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/services/?depth=2')
            .then(resp => resp.json())
            .then(data => {
                setServices(data.docs ?? []);
            })
    }, [])

    return (
        <div className="services-container">
            <h1 className="services-titulo"> Servicios </h1>
            <div className='services-header'>
                {services.map((service) => (
                    <div key={service.id} className='service-card'>
                        <div >
                            <Image src={service.photo?.url} alt={service.title} className='service-img' width={300} height={300} />
                        </div>
                        <h2 className='service-title'>{service.title} </h2>
                    </div>
                ))}
            </div>
            <div className='btn-contacto-container'>
                <button className='btn-contacto' onClick={() => router.push('/contacts')}>Contactar ahora </button>
            </div>
        </div>
    )
}

export default ServicesPage