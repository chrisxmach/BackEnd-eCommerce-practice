/* eslint-disable no-undef */
const  {expressjwt}  = require("express-jwt");

const authJwt = () => {
    const secret = process.env.SECRET_KEY;
    const api_url = process.env.API_URL;
    return expressjwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path:[
            `${api_url}/users/login`,
            `${api_url}/users/register`,
            {url:/\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
            {url:/\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] }
        ]
    })
}

const isRevoked = async (req, token) =>{
    if (!token.payload.isAdmin) {
        return true
    }
    return false;
}

module.exports = authJwt;