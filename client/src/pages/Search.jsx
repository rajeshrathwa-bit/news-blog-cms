import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ArticleList from '../components/ArticleList'
import { api } from '../api'

function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('search') || ''
  const page = searchParams.get('page') || 1
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setError(null)
    api(`/search?search=${encodeURIComponent(query)}&page=${page}`)
      .then((res) => setData(res))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [query, page])

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
      <h2 className="page-heading">Search : {data.searchQuery}</h2>
      <ArticleList
        paginatedNews={data.paginatedNews}
        basePath="/search"
        query={{ search: query }}
      />
    </div>
  )
}

export default Search