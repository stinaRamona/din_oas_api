const Joi = require('joi');
const Portfolio = require('../models/portfolio');
const Joi = require('joi');

const portfolioRouteArr = [
    {
        //hämtar hela protfoliolistan
        method: 'GET',
        path: '/portfolio', 
        handler: async (request, h) => {
            try {
                const portfolio = await Portfolio.find();
                return h.response(portfolio).code(200);
            } catch(error) {
                return h.response({ error: "Failed to fetch portfolio"}).code(500); 
            }
        }
    }, 

    {
        //hämtar ett projekt från portfolion på id 
        method: 'GET',
        path: '/portfolio/{id}', 
        handler: async (request, h) => {
            try {
                const portfolio = await Portfolio.findById(request.params.id); 
                h.response(portfolio).code(200); 
            } catch(error) {
                return h.response({error: "Failed to fetch single project"}).code(500); 
            }
        }
    }, 

    {
        //lägget till nytt porjekt till portfolion
        method: 'POST',
        path: 'portfolio',
        options: {
            validate: {
                payload: Joi.object({
                    project_name: Joi.string().min(3).required(), 
                    project_description: Joi.string().min(3).required(),
                })
            }
        },
        handler: async (request, h) => {
            try {
                const portfolio = new Portfolio(request.payload); 
                return await portfolio.save(); 
            } catch(error) {
                return h.response({error: "Failed to add new project to portfolio"}).code(500); 
            }
        }
    }, 

    {
        //Uppdaterar projekt i portfolion 
        method: 'PUT',
        path: 'portfolio/{id}', 
        options: {
            validate: {
                payload: Joi.object({
                    project_name: Joi.string().min(3).required(), 
                    project_description: Joi.string().min(3).required(),
                })
            }
        },
        handler: async (request, h) => {
            try {
                const portfolio = Portfolio.findByIdAndUpdate(
                    request.params.id, 
                    request.payload, 
                    {new: true}
                ); 
                if(!portfolio) { 
                    return h.response({error: "Project not found in portfolio"}).code(404); 
                }
                return h.response(portfolio).code(200); 
            } catch {
                return h.response({error: "Failed to update project in portfolio"}).code(500); 
            }
        }
    }, 

    {
        //Tar bort ett projekt från portfolion
        method: 'DELETE',
        path: 'portfolio/{id}', 
        handler: async (request, h) => {
            try {
                const portfolio = await Portfolio.findByIdAndDelete(request.params.id); 
                if(!portfolio) {
                    return h.response({error: "Project not found in portfolio"}); 
                }
                return h.response({message: "Project deleted successfully"}).code(200); 
            } catch(error) {
                return h.response({error: "Failed to delete project from portfolio"})
            }
        }
    }
]

module.exports = portfolioRouteArr; 