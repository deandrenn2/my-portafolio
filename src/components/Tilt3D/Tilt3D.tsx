'use client'
import { useRef } from 'react'
import './tilt3d.css'

interface Tilt3DProps {
    children: React.ReactNode
    className?: string
    maxTilt?: number
    glare?: boolean
}

export const Tilt3D = ({ children, className = '', maxTilt = 14, glare = true }: Tilt3DProps) => {
    const wrapRef = useRef<HTMLDivElement>(null)
    const frameRef = useRef<number | null>(null)

    const applyTransform = (rotateX: number, rotateY: number, px: number, py: number) => {
        const el = wrapRef.current
        if (!el) return
        el.style.setProperty('--tilt-rx', `${rotateX}deg`)
        el.style.setProperty('--tilt-ry', `${rotateY}deg`)
        el.style.setProperty('--glare-x', `${px}%`)
        el.style.setProperty('--glare-y', `${py}%`)
        el.style.setProperty('--glare-opacity', '1')
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = wrapRef.current
        if (!el) return

        const rect = el.getBoundingClientRect()
        const px = ((e.clientX - rect.left) / rect.width) * 100
        const py = ((e.clientY - rect.top) / rect.height) * 100

        const rotateY = ((px - 50) / 50) * maxTilt
        const rotateX = -((py - 50) / 50) * maxTilt

        if (frameRef.current) cancelAnimationFrame(frameRef.current)
        frameRef.current = requestAnimationFrame(() => applyTransform(rotateX, rotateY, px, py))
    }

    const handleMouseLeave = () => {
        const el = wrapRef.current
        if (!el) return
        if (frameRef.current) cancelAnimationFrame(frameRef.current)
        el.style.setProperty('--tilt-rx', '0deg')
        el.style.setProperty('--tilt-ry', '0deg')
        el.style.setProperty('--glare-opacity', '0')
    }

    return (
        <div
            ref={wrapRef}
            className={`tilt3d ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className="tilt3d__inner">
                {children}
                {glare && <div className="tilt3d__glare" />}
                <div className="tilt3d__shine-edge" />
            </div>
        </div>
    )
}
