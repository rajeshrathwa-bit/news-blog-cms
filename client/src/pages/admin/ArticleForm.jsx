import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api'
import ErrorMessages from '../../components/ErrorMessages'

function ArticleForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [image, setImage] = useState(null)
  const [article, setArticle] = useState(null)
  const [categories, setCategories] = useState([])
  const [errors, setErrors] = useState(null)

  useEffect(() => {
    const loadCategories = async () => {
      const data = await api('/admin/categories')
      setCategories(data)
    }

    const loadArticle = async () => {
      const data = await api(`/admin/articles/${id}`)
      setArticle(data)
      setTitle(data.title || '')
      setContent(data.content || '')
      setCategory(data.category?._id || '')
    }

    ;(async () => {
      try {
        if (isEdit) await loadArticle()
        await loadCategories()
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors(null)
    const formData = new FormData()
    formData.append('title', title)
    formData.append('content', content)
    formData.append('category', category)
    if (image) formData.append('image', image)

    try {
      if (isEdit) {
        await api(`/admin/articles/${id}`, { method: 'PUT', body: formData })
      } else {
        await api('/admin/articles', { method: 'POST', body: formData })
      }
      navigate('/admin/articles')
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
              {isEdit ? 'Update Article' : 'Add New Article'}
            </h1>
          </div>
          <div className="col-md-8 mx-auto">
            <div className="card">
              <h5 className="card-header">
                {isEdit ? 'Update Article' : 'Add New Article'}
              </h5>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="article_title" className="form-label">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="article_title"
                      className="form-control"
                      autoComplete="off"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="summernote" className="form-label">
                      Description
                    </label>
                    <textarea
                      name="content"
                      id="summernote"
                      className="form-control"
                      rows="5"
                      required
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="article_category" className="form-label">
                      Category
                    </label>
                    <select
                      name="category"
                      id="article_category"
                      className="form-control"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {!isEdit && (
                        <option value="" disabled>
                          Select Category
                        </option>
                      )}
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="article_image" className="form-label">
                      Article image
                    </label>
                    {isEdit && article?.image && (
                      <>
                        <br />
                        <img
                          src={`/uploads/${article.image}`}
                          alt=""
                          className="article-image mb-3 w-25 border border-3 border-primary"
                        />
                      </>
                    )}
                    <input
                      type="file"
                      name="image"
                      id="article_image"
                      className="form-control"
                      required={!isEdit}
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                  </div>
                  <input
                    type="submit"
                    name="submit"
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

export default ArticleForm