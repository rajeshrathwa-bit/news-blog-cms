import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import ArticleList from '../components/ArticleList'
import { api } from '../api'

function Category() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const page = searchParams.get('page') || 1
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setError(null)
    api(`/categories/${slug}/news?page=${page}`)
      .then((res) => setData(res))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [slug, page])

  if (loading) return null

  if (error || !data || !data.category) {
    return (
      <div className="post-container">
        <div className="alert alert-warning">
          {error && error.message ? error.message : 'Category not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="post-container">
      <h2 className="page-heading">{data.category.name} News</h2>
      <ArticleList
        paginatedNews={data.paginatedNews}
        basePath={`/category/${slug}`}
        query={Object.fromEntries(searchParams)}
      />
    </div>
  )
}

export default Category