// eslint-disable-next-line no-unused-vars
const errorhandler = (err, req, res, next) => {
        // return res.status(err.status).json({
        //     success: false,
        //     name: err.name,
        //     message: err.inner.message
        // })
        if(err.name === 'UnauthorizedError'){
            return res.status(400).json({
                success: false,
                error: 'User not Authorized'
            }) 
        }

        if(err.name === 'ValidationError'){
            return res.status(401).json({
                success: false,
                error: err
            }) 
        }

        // dafault
        return res.status(500).json({
            success: false,
            error: err
        })
}

module.exports = errorhandler;