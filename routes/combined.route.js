//kombinerar alla rutter för webbtjänsten

const newsRoute = require("../routes/news.route"); 
const portfolioroute = require("../routes/portfolio.route"); 
const servicesRoute = require("../routes/services.route"); 
const userRoute = require("../routes/user.route"); 

const combinedRoutes = [
    ... newsRoute,
    ... portfolioroute, 
    ... servicesRoute, 
    ... userRoute
]

module.exports = combinedRoutes; 