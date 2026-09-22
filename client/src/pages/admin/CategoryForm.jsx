import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api'
import ErrorMessages from '../../components/ErrorMessages'

function CategoryForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState(null)

  useEffect(() => {
    if (!isEdit) {
      setLoading(false)
      return
    }
    api(`/admin/categories/${id}`)
      .then((data) => {
        setName(data.name || '')
        setDescription(data.description || '')
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors(null)
    const body = JSON.stringify({ name, description })

    try {
      if (isEdit) {
        await api(`/admin/categories/${id}`, { method: 'PUT', body })
      } else {
        await api('/admin/categories', { method: 'POST', body })
      }
      navigate('/admin/categories')
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
              {isEdit ? 'Update Category' : 'Add New Category'}
            </h1>
          </div>
          <div className="col-md-6 mx-auto">
            <div className="card">
              <h5 className="card-header">
                {isEdit ? 'Update Category' : 'Add New Category'}
              </h5>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Category Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Category Name"
                      required
                      autoComplete="off"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
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

export default CategoryForm