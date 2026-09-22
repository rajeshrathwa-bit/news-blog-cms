import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, formatDate } from '../../api'

function Articles() {
  const [articles, setArticles] = useState([])

  const loadArticles = () => {
    api('/admin/articles')
      .then((data) => setArticles(data))
      .catch((error) => console.error(error))
  }

  useEffect(() => {
    loadArticles()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this article?')) return
    try {
      await api(`/admin/articles/${id}`, { method: 'DELETE' })
      loadArticles()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div id="admin-content">
      <div className="container">
        <div className="row">
          <div className="col-md-10">
            <h1 className="admin-heading">
              <i className="fa fa-file-text"></i> All Articles
            </h1>
          </div>
          <div className="col-md-2">
            <Link className="add-new" to="/admin/articles/new">
              Add New Article
            </Link>
          </div>
          <div className="col-md-12">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Author</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article, index) => (
                  <tr key={article._id}>
                    <td>{index + 1}</td>
                    <td>{article.title}</td>
                    <td>{article.category?.name}</td>
                    <td>
                      {formatDate(article.createdAt, {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      }).replace(/\s/g, '-')}
                    </td>
                    <td>{article.author?.fullname}</td>
                    <td>
                      <Link
                        to={`/admin/articles/${article._id}/edit`}
                        className="btn btn-sm btn-success"
                      >
                        Edit
                      </Link>{' '}
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(article._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Articles