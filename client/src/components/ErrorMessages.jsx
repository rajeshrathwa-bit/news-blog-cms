function ErrorMessages({ errors }) {
  if (!errors || errors.length === 0) return null

  return (
    <div className="alert alert-danger mt-3">
      <ul>
        {errors.map((error, index) => (
          <li key={index}>{error.msg}</li>
        ))}
      </ul>
    </div>
  )
}

export default ErrorMessages