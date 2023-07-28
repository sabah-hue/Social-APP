import bcryptjs from 'bcryptjs'

export const hash =({password='',saltRound=process.env.SALT_ROUND}={})=>{
    const hashPassword = bcryptjs.hashSync(password,parseInt(saltRound))
    return hashPassword
}

export const compare =({plaintext='',hashPassword=''}={})=>{
    const match = bcryptjs.compareSync(plaintext,hashPassword)
    return match
}