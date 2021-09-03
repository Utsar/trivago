export const errorsMiddleware = (err, req, res, next) => {
  if (err.status === 500) {
    console.log(err)
    res.status(500).json("Generic Server Error")
  } else {
    res.status(err.status).json(err)
  }
}
