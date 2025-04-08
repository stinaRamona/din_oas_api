const HapiJwt = require("hapi-auth-jwt2"); 
const User = require("./models/user.model"); 

const validate = async (decoded, request, h) => {
    try {
        const user = await User.findById(decoded.id); 
        if (!user) {
            return { isValid: false }
        }

        console.log("Användare: " + user);
        return { isValid: true, credentials: user }; 

    } catch(error) {
        console.log(error); 

        return { isValid : false } 
    }
}; 

const loginAuthStrategy = async (server) => {
    await server.register(HapiJwt); 

    server.auth.strategy("jwt", "jwt", {
        key: process.env.JWT_SECRET_KEY, 
        validate, 
        verifyOptions: { algorithms: ["HS256"] },
    }); 

    server.auth.default("jwt"); 
}; 

module.exports = loginAuthStrategy; 
