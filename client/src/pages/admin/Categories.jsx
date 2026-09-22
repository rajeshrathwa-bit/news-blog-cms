import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api'

function Categories() {
  const [categories, setCategories] = useState([])

  const loadCategories = () => {
    api('/admin/categories')
      .then((data) => setCategories(data))
      .catch((error) => console.error(error))
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    try {
      await api(`/admin/categories/${id}`, { method: 'DELETE' })
      loadCategories()
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
              <i className="fa fa-gears"></i> All Categories
            </h1>
          </div>
          <div className="col-md-2">
            <Link className="add-new" to="/admin/categories/new">
              add category
            </Link>
          </div>
          <div className="col-md-12">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={category._id}>
                    <td>{index + 1}</td>
                    <td>{category.name}</td>
                    <td>{category.slug}</td>
                    <td>
                      <Link
                        to={`/admin/categories/${category._id}/edit`}
                        className="btn btn-sm btn-success"
                      >
                        Edit
                      </Link>{' '}
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(category._id)}
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

export default Categories