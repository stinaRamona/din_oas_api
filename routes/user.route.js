const User = require('../models/user');
const Joi = require('joi');
const bcrypt = require("bcrypt"); 
const Jwt = require("jsonwebtoken")
require('dotenv').config(); 

const userRouteArr = [
    {
        //för att lägga till en ny användare
        method: "POST", 
        path: "/adduser", 
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    user_name: Joi.string().min(3).required(), 
                    user_email: Joi.string().min(3).required(), 
                    user_password: Joi.string().min(3).required(), //Mer krav på lösen? stor bokstav osv?
                })
            }
        }, 
        handler: async (request, h) => {
            const { user_name, user_email, user_password} = request.payload; 

            const hashedPassword = await bcrypt.hash(user_password, 10);

            const user = new User({
                user_name, 
                user_email, 
                user_password: hashedPassword
            });

            return await user.save();
        }
    }, 

    {
        //för att logga in användare och skapa JWT token om det är OK
        method: "POST",
        path: "/loginuser", 
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    user_email: Joi.string().required(), 
                    user_password: Joi.string().required(),
                })
            }
        }, 
        handler: async (request, h) => {
            const {user_email, user_password} = request.payload; 

            try {
                const user = await User.findOne({ user_email }); 

                if(!user) {
                    return h.response({error: "Invalid username and/or password"}).code(401); 
                }; 

                const isValidPassword = await bcrypt.compare(user_password, user.user_password); 

                if(!isValidPassword) {
                    return h.response({error: "Invalid username and/or password"}).code(401); 
                }

                //skapa token om allt är OK 
                const token = Jwt.sign(
                    {id: user._id}, 
                    process.env.JWT_SECRET_KEY,
                    {expiresIn: "12h"}
                );

                return h.response({token, user: user}).code(200); 

            } catch(error) {
                console.log(error); 
                return h.response({error: "Something went wrong on the serverside"}).code(500);
            }
        }
    }, 

    {
        //för att hämta en skyddad rutt
        method: "GET", 
        path: "/protected", 
        options: {
            auth: "jwt"
        },
        handler: async (request, h) => {
            const user = request.auth.credentials; 
            console.log("Användare:" + user); 

            return { message: "Login attempt successfull. You have access to the protected route", user: user}
        }
    }
]

module.exports = userRouteArr; 