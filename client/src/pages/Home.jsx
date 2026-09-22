import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ArticleList from '../components/ArticleList'
import { api } from '../api'

function Home() {
  const [searchParams] = useSearchParams()
  const page = searchParams.get('page') || 1
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setError(null)
    api(`/news?page=${page}`)
      .then((res) => setData(res))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [page])

  if (loading) return null

  if (error) {
    return (
      <div className="post-container">
        <div className="alert alert-warning">{error.message}</div>
      </div>
    )
  }

  return (
    <div className="post-container">
      <ArticleList
        paginatedNews={data}
        basePath="/"
        query={Object.fromEntries(searchParams)}
      />
    </div>
  )
}

export default Home