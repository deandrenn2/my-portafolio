'use client'
import './styles.css'
import { Projects } from '@/slices/Projects/Projects'
import { Profile } from '@/slices/Profile/Profile'
import { Experience } from '@/slices/Experience/Experience'

export default function HomePage() {
  return (
    <div className="home">
      <div className="content">
        <div className='profile-section fade-up'>
          <Profile />
          <Projects />
          <Experience />
        </div>
      </div>
    </div>
  )
}