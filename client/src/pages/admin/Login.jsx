import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Login() {
  const { user, loading, login } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  if (loading) return null

  if (user) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await login(username, password)
      navigate('/admin/dashboard')
    } catch (err) {
      let message = err.message || 'Login failed'
      if (err.data) {
        if (err.data.errors && err.data.errors.length > 0) {
          message = err.data.errors[0].msg
        } else if (err.data.message) {
          message = err.data.message
        }
      }
      setError(message)
    }
  }

  return (
    <div id="wrapper-admin" className="body-content">
      <div className="container">
        <div className="row justify-content-center mt-5">
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h3 className="text-center">Admin Login</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary">
                      Login
                    </button>
                  </div>
                </form>

                {error && <div className="alert alert-danger mt-3">{error}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login