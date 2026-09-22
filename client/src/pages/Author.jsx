import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import ArticleList from '../components/ArticleList'
import { api } from '../api'

function Author() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const page = searchParams.get('page') || 1
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setError(null)
    api(`/authors/${id}/news?page=${page}`)
      .then((res) => setData(res))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [id, page])

  if (loading) return null

  if (error || !data || !data.author) {
    return (
      <div className="post-container">
        <div className="alert alert-warning">
          {error && error.message ? error.message : 'Author not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="post-container">
      <h2 className="page-heading">Author : {data.author.fullname}</h2>
      <ArticleList
        paginatedNews={data.paginatedNews}
        basePath={`/author/${id}`}
        query={Object.fromEntries(searchParams)}
      />
    </div>
  )
}

export default Author