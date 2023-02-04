require('dotenv').config()
const jwt = require('jsonwebtoken')
const {SECRET} = process.env //Getting the SECRET variable from our .env file

module.exports = {
    isAuthenticated: (req, res, next) => {
        const headerToken = req.get('Authorization')
        if (!headerToken) { //If header token does not exist, the stuff in this if statment is executed
            console.log('ERROR IN auth middleware')
            res.sendStatus(401) //Sends a response back to the front end  of status 401
        }

        let token // Initializes token as a variable to use below
    
        try {
            token = jwt.verify(headerToken, SECRET)
            //Checks if the the info in the request is valid and returns the decoded info or throw an error if not valid
        } catch (err) {
            err.statusCode = 500
            throw err
        }

        if (!token) {
            const error = new Error('Not authenticated.')
            error.statusCode = 401
            throw error
        }

        next() //Sends request to the next middleware function
    }
}
