'use client'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Projects.css'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { useEffect, useState } from 'react'

export const Projects = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [projects, setProjects] = useState<any[]>([])

    useEffect(() => {
        fetch('/api/Projects/?depth=2')
            .then(res => res.json())
            .then(data => {
                setProjects(data.docs || [])
            })
            .catch(err => {
                console.error(err)
            })

    }, [])

    return (
        <div className="projects-container">
            {projects.length > 0 && (
                <h3 className='projects-titulo'>Proyectos</h3>
            )}
            <div className='projects-header'>
                {projects.map((project) => (
                    <div key={project.id} className="projects-card">
                        <div className="card-img">
                            <Image src={project.photo?.url}
                                alt={project.photo?.alt || 'imagen del proyecto'}
                                width={300}
                                height={300}
                            />
                        </div>
                        <div className='projects-logos'>
                            <div>
                                <FontAwesomeIcon icon={faGithub} className='logo-fagi' />
                            </div>
                            <div className='projects-titulos'>
                                <span className='titulo-optic'>{project?.title}</span>
                                <span className='titulo-application'>{project?.subtible}</span>
                            </div>
                        </div>
                        <p className="projects-descripcion">
                            {project.description}
                        </p>
                        <div className='projects-list'>
                            {project.tags?.flatMap((item: any) =>
                                item.tag
                                    .split(',')
                                    .map((tag: string) => tag.trim())
                            ).map((tag: string, index: number) => (

                                <span key={index} className="projects-item">{tag}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}