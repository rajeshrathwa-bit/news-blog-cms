import { useEffect, useState } from 'react'
import { api, formatDate } from '../../api'

function Comments() {
  const [comments, setComments] = useState([])

  const loadComments = () => {
    api('/admin/comments')
      .then((data) => setComments(data))
      .catch((error) => console.error(error))
  }

  useEffect(() => {
    loadComments()
  }, [])

  const handleStatusChange = async (id, status) => {
    setComments((prev) =>
      prev.map((comment) => (comment._id === id ? { ...comment, status } : comment))
    )
    try {
      await api(`/admin/comments/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this comment?')) return
    try {
      await api(`/admin/comments/${id}`, { method: 'DELETE' })
      loadComments()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div id="admin-content">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="admin-heading">
              <i className="fa fa-comments"></i> Comments Management
            </h1>
          </div>
          <div className="col-md-12">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Article</th>
                  <th>Content</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment, index) => (
                  <tr key={comment._id}>
                    <td>{index + 1}</td>
                    <td>{comment.article?.title}</td>
                    <td>{comment.content}</td>
                    <td>{comment.name}</td>
                    <td>
                      {formatDate(comment.createdAt, {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      }).replace(/\s/g, '-')}
                    </td>
                    <td>
                      <select
                        name="status"
                        className="form-select form-select-sm d-inline-block w-auto"
                        value={comment.status}
                        onChange={(e) => handleStatusChange(comment._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(comment._id)}
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

export default Comments