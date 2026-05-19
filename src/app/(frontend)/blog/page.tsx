'use client'
import '../blog/blog.css'
import { FaComment, FaHandsHelping, FaBookmark, FaTree } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const BlogPage = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [blogs, setBlogs] = useState<any[]>([]);
    const router = useRouter()

    useEffect(() => {
        fetch('/api/blog/?depth=2')
            .then(resp => resp.json())
            .then(data => {
                setBlogs(data.docs ?? []);
            })
    }, []);

    const formatDate = (date: string) => {
        const d = new Date(date)
        const formatted = d.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })

        return formatted.charAt(0).toUpperCase() + formatted.slice(1)
    }
    return (
        <div className="blog-container">
            <div className="blog-header">
                <h1>Blog</h1>
                <div className="blog-sections">
                    <p>Suscribete a nuestra seccion de blog y novedades</p>
                    <input type="text"
                        placeholder='Email'
                        className="blog-input" />
                    <div className="blog-buttom">
                        <span className='blog-spam'>Newsletter</span>
                        <button className="blog-btn">Suscribirme</button>
                    </div>
                </div>
            </div>

            <div className="blog-card">
                {blogs.map((blog) => (
                    <div
                        key={blog.id} className="card-header" onClick={() => {
                            if (!blog?.id) return; // evita error
                            router.push(`/blog/${blog.id}`)
                        }}>
                        <div className="blog-card-content">
                            <div className="card-contentainer">
                                <h2 className="blog-title">{blog.title}</h2>
                                <p className="blog-description">
                                    {blog.description.slice(0, 200)}...
                                </p>
                                <div className="blog-meta">
                                    <span className="blog-date">{formatDate(blog.publishedAt)}</span>
                                    <span className='blog-views'>Views 256</span>
                                    <span className='blog-comments'>
                                        <FaComment className='blog-facoment' />
                                        256
                                    </span>
                                    <span><FaBookmark className='blog-fabookmark' />
                                        10
                                    </span>
                                    <span>
                                        <FaHandsHelping className='blog-fahands' />
                                        10
                                    </span>
                                </div>
                            </div>
                            <div className="blog-right">
                                <div className="blog-author-container">
                                    <p className="blog-author">Autor: {blog.author}</p>
                                </div>
                                <div className="blog-img">
                                    <FaTree className='blog-icon' />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default BlogPage