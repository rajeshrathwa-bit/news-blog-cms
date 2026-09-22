import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatDate } from '../api'

function Sidebar({ latestNews, categories }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(`/search?search=${encodeURIComponent(search)}`)
  }

  return (
    <div id="sidebar" className="col-md-4">
      <div className="search-box-container">
        <h4>Search</h4>
        <form className="search-post" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="search"
              className="form-control"
              placeholder="Search ....."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="input-group-btn">
              <button type="submit" className="btn btn-danger">Search</button>
            </span>
          </div>
        </form>
      </div>

      <div className="recent-post-container">
        <h4>Recent Posts</h4>
        {latestNews.map((latestNew) => (
          <div className="recent-post" key={latestNew._id}>
            <Link className="post-img" to={`/single/${latestNew._id}`}>
              <img src={`/uploads/${latestNew.image}`} alt="" />
            </Link>
            <div className="post-content">
              <h5><Link to={`/single/${latestNew._id}`}>{latestNew.title}</Link></h5>
              <span>
                <i className="fa fa-tags" aria-hidden="true" />
                <Link to={`/category/${latestNew.category.slug}`}>{latestNew.category.name}</Link>
              </span>
              <span>
                <i className="fa fa-calendar" aria-hidden="true" />
                {formatDate(latestNew.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar