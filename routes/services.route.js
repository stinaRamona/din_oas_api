const {handleFileUpload} = require('../handlers/fileHandler');
const Service = require('../models/services');
const Joi = require('joi');
const Path = require('path'); 
const Fs = require('fs');

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
            payload: {
                output: 'stream',
                parse: true,
                multipart: true,
                maxBytes: 10 * 1024 * 1024, // Maxstorlek 10 MB
            },
            auth: false,
            validate: {
                payload: Joi.object({
                    service_name: Joi.string().min(3).required(), 
                    service_description: Joi.string().min(3).required(),
                    file: Joi.any(),
                })
            }
        },
        handler: async (request, h) => {
            try {
                const { file, service_name, service_description } = request.payload;

                if (!service_name || !service_description) {
                    return h.response({ error: 'Alla obligatoriska fält måste vara ifyllda.' }).code(400);
                }

                //Hantera filuppladdning
                let uploadedFilePath = null;
                if (file) {
                    const uploadResult = await handleFileUpload(file);
                    uploadedFilePath = `/uploads/${uploadResult.filename}`; //Skapa URL
                }

                //Skapa nyhetsobjekt och spara i databasen
                const service = new Service({
                    service_name,
                    service_description,
                    service_picture: uploadedFilePath, //Spara URL:en
                });

                const savedService = await service.save();

                return h.response({
                    message: 'Tjänst tillagd',
                    service: savedService,
                }).code(201);
            } catch (err) {
                console.error('Error in creating servide:', err.message);
                return h.response({ error: 'Ett fel uppstod vid skapandet av tjänsten.' }).code(500);
            }
        }
    }, 

    {
        method: 'PUT',
        path: '/service/{id}', 
        options: {
            payload: {
                output: 'stream', 
                parse: true, 
                maxBytes: 10 * 1024 * 1024,
            },
            auth: false,
            validate: {
                payload: Joi.object({
                    service_name: Joi.string().min(3).required(), 
                    service_description: Joi.string().min(3).required(), 
                    file: Joi.any(),
                })
            }
        },
        handler: async (request, h) => {
            try {
                const { file, service_name, service_description } = request.payload;
                const { id } = request.params;
        
                // Hämta nyhetsobjektet från databasen
                const service = await Service.findById(id);
                if (!service) {
                    return h.response({ error: 'Tjänsten kunde inte hittas.' }).code(404);
                }
        
                // Uppdatera fält endast om de skickas med
                if (service_name) {
                    service.service_name = service_name;
                }
                
                if (service_description) {
                    service.service_description = service_description; 
                }
        
                // Hantera filuppladdning om en ny fil skickas
                if (file && file._data) {
                    const fileExtension = Path.extname(file.hapi.filename);
        
                    // Kontrollera tillåtna filtyper
                    const allowedTypes = ['.jpeg', '.jpg', '.png'];
                    if (!allowedTypes.includes(fileExtension)) {
                        return h.response({ error: 'Ogiltig filtyp.' }).code(400);
                    }
        
                    // Spara filen till servern
                    const filename = `${Date.now()}-${file.hapi.filename}`;
                    const uploadPath = Path.join(__dirname, '../uploads/', filename);
                    const fileStream = Fs.createWriteStream(uploadPath);
        
                    file.pipe(fileStream);
        
                    await new Promise((resolve, reject) => {
                        fileStream.on('finish', resolve);
                        fileStream.on('error', reject);
                    });
        
                    // Uppdatera URL:en för bilden i databasen
                    service.service_picture = `/uploads/${filename}`;
                }
        
                // Spara uppdaterade nyhetsdata
                const updatedService = await service.save();
        
                return h.response({
                    message: 'Tjänsten uppdaterad',
                    service: updatedService,
                }).code(200);
        
            } catch (err) {
                console.error('Error in updating service:', err.message);
                return h.response({ error: 'Ett fel uppstod vid uppdateringen av tjänsten.' }).code(500);
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