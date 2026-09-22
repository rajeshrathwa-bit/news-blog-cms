import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api'
import ErrorMessages from '../../components/ErrorMessages'

function UserForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('author')
  const [errors, setErrors] = useState(null)

  useEffect(() => {
    if (!isEdit) {
      setLoading(false)
      return
    }
    api(`/admin/users/${id}`)
      .then((data) => {
        setFullname(data.fullname || '')
        setUsername(data.username || '')
        setRole(data.role || 'author')
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors(null)

    let body
    if (isEdit) {
      const payload = { fullname, role }
      if (password) payload.password = password
      body = JSON.stringify(payload)
    } else {
      body = JSON.stringify({ fullname, username, password, role })
    }

    try {
      if (isEdit) {
        await api(`/admin/users/${id}`, { method: 'PUT', body })
      } else {
        await api('/admin/users', { method: 'POST', body })
      }
      navigate('/admin/users')
    } catch (error) {
      setErrors(error.data?.errors || null)
    }
  }

  if (loading) return null

  return (
    <div id="admin-content">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="admin-heading">
              {isEdit ? 'Modify User Details' : 'Add User'}
            </h1>
          </div>
          <div className="col-md-6 mx-auto">
            <div className="card">
              <h5 className="card-header">
                {isEdit ? 'Update User' : 'Add New User'}
              </h5>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="fullname"
                      className="form-control"
                      placeholder="Full Name"
                      required
                      autoComplete="off"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">User Name</label>
                    <input
                      type="text"
                      name="username"
                      className="form-control"
                      placeholder="Username"
                      required
                      autoComplete="off"
                      disabled={isEdit}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    {isEdit && (
                      <small className="text-muted d-block">
                        leave blank to keep
                      </small>
                    )}
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder={isEdit ? 'Password' : 'Password'}
                      required={!isEdit}
                      autoComplete="off"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">User Role</label>
                    <select
                      className="form-control"
                      name="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="author">Author</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  <input
                    type="submit"
                    name="save"
                    className="btn btn-primary"
                    value={isEdit ? 'Update' : 'Save'}
                  />
                </form>

                <ErrorMessages errors={errors} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserForm