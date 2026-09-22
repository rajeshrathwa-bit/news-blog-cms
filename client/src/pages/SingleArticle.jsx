import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, formatDate } from '../api'

function SingleArticle() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('')
  const [submitError, setSubmitError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    api(`/news/${id}`)
      .then((res) => setData(res))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitError(null)
    setSuccess(false)
    api(`/news/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ name, email, content })
    })
      .then((res) => {
        if (res && res.success) {
          setSuccess(true)
          setName('')
          setEmail('')
          setContent('')
        }
      })
      .catch((err) => setSubmitError(err.message))
  }

  if (loading) return null

  if (error || !data || !data.singleNews) {
    return (
      <div className="post-container">
        <div className="alert alert-warning">
          {error && error.message ? error.message : 'Article not found'}
        </div>
      </div>
    )
  }

  const { singleNews, comments } = data

  return (
    <>
      <div className="post-container">
        <div className="post-content single-post">
          <h3>{singleNews.title}</h3>
          <div className="post-information">
            <span>
              <i className="fa fa-tags" aria-hidden="true" />
              <Link to={`/category/${singleNews.category.slug}`}>{singleNews.category.name}</Link>
            </span>
            <span>
              <i className="fa fa-user" aria-hidden="true" />
              <Link to={`/author/${singleNews.author._id}`}>{singleNews.author.fullname}</Link>
            </span>
            <span>
              <i className="fa fa-calendar" aria-hidden="true" />
              {formatDate(singleNews.createdAt)}
            </span>
          </div>
          <img className="single-feature-image" src={`/uploads/${singleNews.image}`} alt="" />
          <div dangerouslySetInnerHTML={{ __html: singleNews.content }} />
        </div>
      </div>

      <div className="comments-section mt-5">
        <h3>Comments</h3>

        <div className="card mb-4">
          <div className="card-body">
            {success && (
              <div className="alert alert-success">Your comment has been posted successfully.</div>
            )}
            {submitError && (
              <div className="alert alert-danger">{submitError}</div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Comment</label>
                <textarea
                  className="form-control"
                  name="content"
                  rows="3"
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">Submit Comment</button>
            </form>
          </div>
        </div>

        <div className="comments-list">
          {comments.map((comment, i) => (
            <div className="card mb-3" key={i}>
              <div className="card-body">
                <h6 className="card-subtitle mb-2 text-muted">{comment.name}</h6>
                <p className="card-text">{comment.content}</p>
                <small className="text-muted">Posted on {formatDate(comment.createdAt)}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default SingleArticle