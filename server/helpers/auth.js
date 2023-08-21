const bcrypt = require("bcrypt")

/// this code is from tutorials
// https://youtu.be/XPC81RWOItI?t=4005

// const hashPassword = (password) => {
//   return new Promise((resolve, reject) => {
//     // note: the higher value (12) more secure
//     bcrypt.genSalt(12, (err, salt) => {
//       if (err) {
//         reject(err)
//       }
//       bcrypt.hash(password, salt, (err, hash) => {
//         if (err) {
//           reject(err)
//         }
//         resolve(hash)
//       })
//     })
//   })
// }

// this code is from gpt best practice and more readable
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(12)
    const hash = await bcrypt.hash(password, salt)
    return hash
  } catch (err) {
    throw err
  }
}

const comparePassword = (password, hashed) => {
  return bcrypt.compare(password, hashed)
}

module.exports = {
  hashPassword,
  comparePassword,
}
