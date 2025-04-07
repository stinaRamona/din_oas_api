const Service = require('../models/services');
const Joi = require('joi');

const serviceRouteArr = [
    {
        method: 'GET', 
        path: '/service', 
        handler: async (request, h) => {
            try {
                const service = await Service.find(); 
                return h.response(service).code(200); 
            } catch(error) {
                return h.response({error: "Failed to fetch services"}).code(500); 
            }
        }
    }, 

    {
        method: 'GET',
        path: '/service/{id}', 
        handler: async (request, h) => {
            try {
                const service = await Service.findById(request.params.id); 
                return h.response(service).code(200); 
            } catch(error) {
                return h.response({error: "Failed to fetch single service"}).code(500); 
            }
        }
    }, 

    {
        method: 'POST',
        path: '/service',
        options: {
            validate: {
                payload: Joi.object({
                    service_name: Joi.string().min(3).required(), 
                    service_description: Joi.string().min(3).required(), 
                })
            }
        },
        handler: async (request, h) => {
            try {
                const service = new Service(request.payload)
                return await service.save(); 
            } catch(error) {
                return h.response({error: "Failed to post new service"}).code(500); 
            }
        }
    }, 

    {
        method: 'PUT',
        path: '/service/{id}', 
        options: {
            validate: {
                payload: Joi.object({
                    service_name: Joi.string().min(3).required(), 
                    service_description: Joi.string().min(3).required(), 
                })
            }
        },
        handler: async (request, h) => {
            try {
                const service = await Service.findByIdAndUpdate(
                    request.params.id, 
                    request.payload, 
                    {new: true}
                ); 
                if(!service) {
                    return h.response({error: "Failed to find service to update"}).cide(404);
                }; 
                return h.response(service).code(200); 
            } catch(error) {
                return h.response({error: "Failed to update service"}).code(500);
            }
        }

    }, 

    {
        method: 'DELETE',
        path: '/service/{id}', 
        handler: async (request, h) => {
            try {
                const service = await Service.findByIdAndDelete(request.params.id); 

                if(!service) {
                    return h.response({error: "Failed to find service to delete"}).code(404); 
                };

                return h.response({message: "Successfully deleted service"}).code(200); 

            } catch(error) {
                return h.response({error: "Failed to delete service"}).code(500); 
            }
        }
    }
]

module.exports = serviceRouteArr; 