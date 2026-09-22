import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api'

function Users() {
  const [users, setUsers] = useState([])

  const loadUsers = () => {
    api('/admin/users')
      .then((data) => setUsers(data))
      .catch((error) => console.error(error))
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      await api(`/admin/users/${id}`, { method: 'DELETE' })
      loadUsers()
    } catch (error) {
      if (error.status === 400 && error.data?.message) {
        alert(error.data.message)
      } else {
        console.error(error)
      }
    }
  }

  return (
    <div id="admin-content">
      <div className="container">
        <div className="row">
          <div className="col-md-10">
            <h1 className="admin-heading">
              <i className="fa fa-users"></i> All Users
            </h1>
          </div>
          <div className="col-md-2">
            <Link className="add-new" to="/admin/users/new">
              add user
            </Link>
          </div>
          <div className="col-md-12">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Full Name</th>
                  <th>User Name</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.fullname}</td>
                    <td>{user.username}</td>
                    <td>{user.role}</td>
                    <td>
                      <Link
                        to={`/admin/users/${user._id}/edit`}
                        className="btn btn-sm btn-success"
                      >
                        Edit
                      </Link>{' '}
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(user._id)}
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

export default Users