import jwt,{jwtPayload} from "jsonwebtoken"

const generateJWT = (payload:jwtPayload)=>
  new Promise((resolve, reject) =>
    jwt.sign(payload, process.env.JWT_SECRET as String, { expiresIn: "1w" }, (err, token) => {
      if (err) reject(err)
      resolve(token)
    })
  )

export const getJWT = async user => {
  const accessToken = await generateJWT({ _id: user._id, role: user.role as string })
  return accessToken
}

export const verifyJWT = token =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decodedToken) => {
      if (err) reject(err)
      resolve(decodedToken)
    })
  )
