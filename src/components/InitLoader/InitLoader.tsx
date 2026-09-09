'use client'
import { useEffect, useState } from 'react'
import './initLoader.css'

const MIN_VISIBLE_MS = 1400

export const InitLoader = () => {
    const [visible, setVisible] = useState(true)
    const [leaving, setLeaving] = useState(false)
    const [progress, setProgress] = useState(4)

    useEffect(() => {
        const start = Date.now()
        let finished = false
        let progressTimer: ReturnType<typeof setInterval>

        const tick = () => {
            setProgress((prev) => {
                if (prev >= 92) return prev
                const next = prev + Math.max(1, Math.round((92 - prev) / 10))
                return Math.min(next, 92)
            })
        }
        progressTimer = setInterval(tick, 140)

        const finish = () => {
            if (finished) return
            finished = true
            clearInterval(progressTimer)
            setProgress(100)

            const elapsed = Date.now() - start
            const remaining = Math.max(MIN_VISIBLE_MS - elapsed, 0)

            window.setTimeout(() => {
                setLeaving(true)
                window.setTimeout(() => setVisible(false), 650)
            }, remaining)
        }

        if (document.readyState === 'complete') {
            finish()
        } else {
            window.addEventListener('load', finish)
        }

        return () => {
            clearInterval(progressTimer)
            window.removeEventListener('load', finish)
        }
    }, [])

    if (!visible) return null

    return (
        <div className={`init-loader${leaving ? ' init-loader--leaving' : ''}`} aria-hidden="true">
            <div className="init-loader__scanline" />
            <div className="init-loader__grid" />

            <div className="init-loader__corner init-loader__corner--tl" />
            <div className="init-loader__corner init-loader__corner--tr" />
            <div className="init-loader__corner init-loader__corner--bl" />
            <div className="init-loader__corner init-loader__corner--br" />

            <div className="init-loader__core">
                <div className="init-loader__ring init-loader__ring--outer" />
                <div className="init-loader__ring init-loader__ring--mid" />
                <div className="init-loader__ring init-loader__ring--inner" />
                <div className="init-loader__pulse" />
                <span className="init-loader__percent">{progress}%</span>
            </div>

            <div className="init-loader__label">
                <span className="init-loader__title">DEANDRE.NET</span>
                <span className="init-loader__subtitle">Inicializando interfaz&hellip;</span>
            </div>
        </div>
    )
}
