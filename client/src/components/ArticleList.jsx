import { Link } from 'react-router-dom'
import { formatDate } from '../api'

function buildPageUrl(basePath, query, page) {
  const params = new URLSearchParams(query)
  params.set('page', page)
  return `${basePath}?${params.toString()}`
}

function ArticleList({ paginatedNews, basePath, query }) {
  if (!paginatedNews || !paginatedNews.data || paginatedNews.data.length === 0) {
    return null
  }

  return (
    <>
      {paginatedNews.data.map((article) => (
        <div className="post-content" key={article._id}>
          <div className="row">
            <div className="col-md-4">
              <Link className="post-img" to={`/single/${article._id}`}>
                <img src={`/uploads/${article.image}`} alt="" />
              </Link>
            </div>
            <div className="col-md-8">
              <div className="inner-content clearfix">
                <h3><Link to={`/single/${article._id}`}>{article.title}</Link></h3>
                <div className="post-information">
                  <span>
                    <i className="fa fa-tags" aria-hidden="true" />
                    <Link to={`/category/${article.category.slug}`}>{article.category.name}</Link>
                  </span>
                  <span>
                    <i className="fa fa-user" aria-hidden="true" />
                    <Link to={`/author/${article.author._id}`}>{article.author.fullname}</Link>
                  </span>
                  <span>
                    <i className="fa fa-calendar" aria-hidden="true" />
                    {formatDate(article.createdAt)}
                  </span>
                </div>
                <p className="description">
                  {article.content.substring(0, 30) + '...'}
                </p>
                <Link className="read-more pull-right" to={`/single/${article._id}`}>read more</Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      <nav>
        <ul className="pagination">
          {paginatedNews.hasPrevPage ? (
            <li className="page-item">
              <Link className="page-link" to={buildPageUrl(basePath, query, paginatedNews.prevPage)}>Previous</Link>
            </li>
          ) : (
            <li className="page-item disabled">
              <a className="page-link">Previous</a>
            </li>
          )}
          {Array.from({ length: paginatedNews.totalPages }, (_, i) => i + 1).map((page) => (
            <li className={`page-item ${page === paginatedNews.currentPage ? 'active' : ''}`} key={page}>
              <Link className="page-link" to={buildPageUrl(basePath, query, page)}>{page}</Link>
            </li>
          ))}
          {paginatedNews.hasNextPage ? (
            <li className="page-item">
              <Link className="page-link" to={buildPageUrl(basePath, query, paginatedNews.nextPage)}>Next</Link>
            </li>
          ) : (
            <li className="page-item disabled">
              <a className="page-link">Next</a>
            </li>
          )}
        </ul>
      </nav>
    </>
  )
}

export default ArticleList