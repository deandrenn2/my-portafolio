'use client'
import Link from 'next/link'
import { RedesSocials } from '../../components/RedesSocials/RedesSocials'
import { usePathname } from 'next/navigation'

interface SidebarProps {
    isOpen?: boolean
    onClose?: () => void
}

export const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
    const pathname = usePathname()

    return (
        <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
            <div className='logo'>
                <h2 className='title'>DEANDRE</h2>
                <h1 className='subtitle'>Developer Web FullStack</h1>

            </div>
            <div>
                <nav className="menu">
                    <Link
                        href="/"
                        className={`menu-btn ${pathname === '/' ? 'active' : ''}`}
                        onClick={onClose}
                    >
                        Perfil
                    </Link>

                    <Link
                        href="/services"
                        className={`menu-btn ${pathname === '/services' ? 'active' : ''}`}
                        onClick={onClose}
                    >
                        Servicios
                    </Link>

                    <Link
                        href="/apps"
                        className={`menu-btn ${pathname === '/apps' ? 'active' : ''}`}
                        onClick={onClose}
                    >
                        Apps
                    </Link>

                    <Link
                        href="/blog"
                        className={`menu-btn ${pathname === '/blog' ? 'active' : ''}`}
                        onClick={onClose}
                    >
                        Blog
                    </Link>

                    <Link
                        href="/contacts"
                        className={`menu-btn ${pathname === '/contacts' ? 'active' : ''}`}
                        onClick={onClose}
                    >
                        Contacto
                    </Link>
                </nav>
            </div>
            <div>
                <RedesSocials />
            </div>
        </aside >
    )
}
