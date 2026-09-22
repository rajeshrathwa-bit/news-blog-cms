import { useEffect, useState } from 'react'
import { api } from '../../api'
import ErrorMessages from '../../components/ErrorMessages'

function Settings() {
  const [loading, setLoading] = useState(true)
  const [websiteTitle, setWebsiteTitle] = useState('')
  const [footerDescription, setFooterDescription] = useState('')
  const [websiteLogo, setWebsiteLogo] = useState('')
  const [logo, setLogo] = useState(null)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState(null)

  useEffect(() => {
    api('/admin/settings')
      .then((data) => {
        if (data) {
          setWebsiteTitle(data.website_title || '')
          setFooterDescription(data.footer_description || '')
          setWebsiteLogo(data.website_logo || '')
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors(null)
    setSuccess(false)

    const formData = new FormData()
    formData.append('website_title', websiteTitle)
    formData.append('footer_description', footerDescription)
    if (logo) formData.append('website_logo', logo)

    try {
      await api('/admin/settings', { method: 'PUT', body: formData })
      if (logo) setWebsiteLogo('')
      setSuccess(true)
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
              <i className="fa fa-cog"></i> Settings
            </h1>
          </div>
          <div className="col-md-6 mx-auto">
            <div className="card">
              <h5 className="card-header">Settings</h5>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="website_title" className="form-label">
                      Website Title
                    </label>
                    <input
                      type="text"
                      name="website_title"
                      className="form-control"
                      autoComplete="off"
                      required
                      value={websiteTitle}
                      onChange={(e) => setWebsiteTitle(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="website_logo" className="form-label">
                      Upload Logo
                    </label>
                    <br />
                    {websiteLogo && (
                      <img
                        src={`/uploads/${websiteLogo}`}
                        alt=""
                        className="w-25 mb-3"
                      />
                    )}
                    <input
                      type="file"
                      name="website_logo"
                      className="form-control"
                      onChange={(e) => setLogo(e.target.files[0])}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="footer_description" className="form-label">
                      Footer Description
                    </label>
                    <input
                      type="text"
                      name="footer_description"
                      className="form-control"
                      autoComplete="off"
                      required
                      value={footerDescription}
                      onChange={(e) => setFooterDescription(e.target.value)}
                    />
                  </div>

                  <input
                    type="submit"
                    name="submit"
                    className="btn btn-primary"
                    value="Save"
                  />
                </form>

                {success && (
                  <div className="alert alert-success mt-3">
                    Settings saved successfully.
                  </div>
                )}

                <ErrorMessages errors={errors} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings