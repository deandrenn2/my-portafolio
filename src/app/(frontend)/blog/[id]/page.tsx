
import './blogDetaill.css'
import { FaBookmark, FaComment, FaHandsHelping, FaTree } from "react-icons/fa";

type Props = {
    params: Promise<{
        id: string
    }>
}

async function getBlog(id: string) {
    const res = await fetch(`http://localhost:3000/api/blog/${id}?depth=2`,
        {
            cache: 'no-store',
        }
    )
    return res.json();
}

export default async function BlogDetail({ params }: Props) {
    const { id } = await params;
    const blog = await getBlog(id);

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
        <div>
            <h1 className='blogdetaill-title'>{blog.title}</h1>
            <div className='blogdetaill-content'>
                <div className="blogdetaill-img">
                    <FaTree className='blogdetaill-icon' />
                </div>
                <div className="blogdetaill-info">
                    <div className="blogdetaill-meta">
                        <span className="blogdetaill-date">{formatDate(blog.publishedAt)}</span>
                        <span className='blogdetaill-views'>Views 256</span>
                        <span className='blogdetaill-comments'>
                            <FaComment className='blogdetaill-facoment' />
                            256
                        </span>
                        <span><FaBookmark className='blogdetaill-fabookmark' />
                            10
                        </span>
                        <span>
                            <FaHandsHelping className='blogdetaill-fahands' />
                            10
                        </span>
                    </div>
                    <div className="blogdetaill-author-container">
                        <p className="blogdetaill-author">Autor: {blog.author}</p>
                    </div>
                </div>

            </div>
            <div className='blogdetaill-infordescription'>
                <div className="blogdetaill-description">
                    <p className='blogdetaill-description-text'>{blog.description}</p>
                </div>
            </div>
        </div>
    )
}