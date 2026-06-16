/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import './profile.css'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaTelegramPlane } from 'react-icons/fa'
import { Loading } from '@/components/Loading/Loading'
import TextNeonSvg from '@/components/Text/TextNeonSvg'
import { Profile as ProfileType, Media } from '@/payload-types'
export const Profile = () => {
    const [profile, setProfile] = useState<ProfileType>({
        id: 0,
        title: '',
        firstName: '',
        lastName: '',
        description: '',
        tags: [],
        photo: {
            id: 0,
            alt: '',
            updatedAt: '',
            createdAt: '',
            url: ''
        } as Media
    })

    const [loading, setLoading] = useState(true)

    const router = useRouter()

    useEffect(() => {
        const getProfile = async () => {
            try {
                const res = await fetch('/api/globals/profiles')
                const data = await res.json() as ProfileType
                setProfile(data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        getProfile()
    }, [])

    if (loading) return <Loading />
    return (
        <div className='profile-container'>
            <div className='profile-content'>
                <div>
                    <div className="profile-line">
                        <h1 className='profile-title-name'>{profile.title}</h1>
                        <span className='profile-arya'>|</span>

                        <div className="profile-fullname">
                            <span className="profile-name-up">
                                {profile.firstName}
                            </span>

                            <span className="profile-name-down">
                                {profile.lastName}
                            </span>
                        </div>
                    </div>

                    <div>
                        <TextNeonSvg text={profile.subtitle ?? ''}
                            className='profile-subtitle'
                        />
                        <p className="profile-description">
                            {profile.description}
                        </p>
                    </div>
                </div>

                <div className="profile-list">
                    {profile.tags?.flatMap((item: any) =>
                        item.tag
                            .split(',')
                            .map((tag: string) => tag.trim())
                    ).map((tag: string, index: number) => (
                        <span key={index} className="profile-item">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="profile-buttons">
                    <button
                        className="btn-contact"
                        onClick={() => router.push('/contacts')}
                    >
                        Contactar Ahora
                    </button>

                    <span className="btn-recommender">
                        <FaTelegramPlane className='fatelegram-icon' />
                        <span>Recomendar</span>
                    </span>
                </div>
            </div>

            <div className="profile-photo-box">
                {typeof profile.photo === 'object' && profile.photo?.url && (
                    <Image
                        src={profile.photo?.url || ''}
                        alt={profile.title ?? ''}
                        className="profile-photo"
                        width={340}
                        height={480}
                    />
                )}
            </div>
        </div>
    )
}