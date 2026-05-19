'use client'
import './app.css'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
const Apps = () => {
    const [apps, setApps] = useState<any[]>([])

    useEffect(() => {
        fetch('/api/Apps/?depth=2')
            .then(res => res.json())
            .then(data => {
                setApps(data.docs ?? []);
            })
            .catch(err => console.error(err))
    }, [])

    return (
        <div className="container-apps">
            <h1 className='title-app'> Apps</h1>
            <div className="header-apps">
                {apps.map((app) => (
                    <div key={app.id} className='card-apps'>
                        <div className='card-img'>
                            <Image
                                src={app.photo?.url}
                                alt={app.photo?.alt || 'imagen de la aplicacion'}
                                width={399}
                                height={300}
                            />
                        </div>
                        <div className='logo-apps'>
                            <FontAwesomeIcon icon={faLink} className='apps-fagithub' />
                            <div className='title-apps'>
                                <span className='title-ui'>{app.title}</span>
                                <span className='title-offli'> {app.subtitle}</span>
                            </div>
                        </div>
                        <p className='description-apps'>
                            {app.descrption}
                        </p>
                        <div className='apps-list'>
                            {app.tags?.flatMap((item: any) => (
                                item.tag
                                    .split(',')
                                    .map((tag: string) => tag.trim())
                            )).map((tag: string, index: number) => (

                                <span key={index} className="apps-item">{tag}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Apps