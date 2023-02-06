require('dotenv').config()
const {SECRET} = process.env
const {User} = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const createToken = (username, id) => {
    return jwt.sign(
        {
           username,
           id 
        },
        SECRET,
        {
            expiresIn: '2 days'
        }
    )
      
}


module.exports = {
    
    register: async (req, res) => {
       try {            
        const { username, password } = req.body
        let foundUser = await User.findOne({where: {username: username}})
        if(foundUser){
            res.status(400).send('Username already exists')
        }else{
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)
            const newUser = await User.create({username: username, hashedPass:hash})
            const token = createToken(newUser.dataValues.username, newUser.dataValues.id)
            console.log(newUser, 'NEW USER ')
            const exp = Date.now() + 1000 * 60 * 60 * 48
            res.status(200).send({
                username: newUser.dataValues.username,
                id: newUser.dataValues.id,
                token: token,
                exp: exp
            })
        }
       } catch (err){
        console.log(err)
        console.log('Error in register')
        res.sendStatus(400)
       }
    },
login: async (req, res) => {
    try {
        const {username , password} = req.body
        let foundUser = await User.findOne({where: {username: username}})
        if(foundUser){
            const isAuthenticated = bcrypt.compareSync(password, foundUser.hashedPass)
            if(isAuthenticated){
                const token = createToken(foundUser.dataValues.username, foundUser.dataValues.id)
                const exp = Date.now() + 1000 * 60 * 60 * 48
                res.status(200).send({
                    username: foundUser.dataValues.username, 
                        userId: foundUser.dataValues.id,
                        token, 
                        exp
                })
            }else{
                res.status(400).send('ERROR IN BACKEND LOGIN')
            }
        }else{
            res.status(400).send('ERROR IN BACKEND LOGIN OUTER')
            }
        }
        catch(err) {
            console.log(err)
            console.log('error in login')
            res.sensStatus(400)
        }
    }
    


}
