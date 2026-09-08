'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from '../Sidebar/Sidebar'
import { Header } from '../Header/Header'
import { CreditsSlider } from '@/components/CreditsSlider/CreditsSlider'

export const AppShell = ({ children }: { children: React.ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setSidebarOpen(false)
    }, [pathname])

    return (
        <>
            <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
            <div className="container-principal">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                {sidebarOpen && (
                    <div
                        className="sidebar-overlay"
                        onClick={() => setSidebarOpen(false)}
                        aria-hidden="true"
                    />
                )}
                <main className="layout-main">
                    {children}
                    <CreditsSlider />
                </main>
            </div>
        </>
    )
}
