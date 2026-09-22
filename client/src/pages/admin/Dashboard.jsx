import { useEffect, useState } from 'react'
import { api } from '../../api'
import { useAuth } from '../../context/AuthContext'

function Dashboard() {
  const { user } = useAuth()
  const [counts, setCounts] = useState({ articleCount: 0, categoryCount: 0, userCount: 0 })

  useEffect(() => {
    api('/admin/dashboard')
      .then((data) => setCounts(data))
      .catch((error) => console.error(error))
  }, [])

  return (
    <div id="admin-content">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="admin-heading mb-3">
              <i className="fa fa-cubes"></i>Dashboard | <small>Hello {user.fullname} </small>
            </h1>
          </div>
          <div className="col-md-3">
            <div className="admin-block" style={{ backgroundColor: '#CFE2FF' }}>
              <i className="fa fa-file-text"></i>
              <h4>Articles</h4>
              <h1>{counts.articleCount}</h1>
            </div>
          </div>
          <div className="col-md-3">
            <div className="admin-block">
              <i className="fa fa-gears"></i>
              <h4>Categories</h4>
              <h1>{counts.categoryCount}</h1>
            </div>
          </div>
          {user.role === 'admin' && (
            <div className="col-md-3">
              <div className="admin-block" style={{ backgroundColor: '#D2F4EA' }}>
                <i className="fa fa-users"></i>
                <h4>Users</h4>
                <h1>{counts.userCount}</h1>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard