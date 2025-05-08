const {handleFileUpload} = require('../handlers/fileHandler');
const Joi = require('joi');
const Portfolio = require('../models/portfolio');
const Path = require('path'); 
const Fs = require('fs'); 

const portfolioRouteArr = [
    {
        //hämtar hela protfoliolistan
        method: 'GET',
        path: '/portfolio', 
        options: {
            auth: false,
        },
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
        options: {
            auth: false
        },
        handler: async (request, h) => {
            try {
                const portfolio = await Portfolio.findById(request.params.id); 
                return h.response(portfolio).code(200); 
            } catch(error) {
                return h.response({error: "Failed to fetch single project"}).code(500); 
            }
        }
    }, 

    {
        //lägget till nytt porjekt till portfolion
        method: 'POST',
        path: '/portfolio',
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
                    project_name: Joi.string().min(3).required(), 
                    project_description: Joi.string().min(3).required(),
                    file: Joi.any(),
                })
            }
        },
        handler: async (request, h) => {
            try {
                const { file, project_name, project_description } = request.payload;

                if (!project_name || !project_description) {
                    return h.response({ error: 'Alla obligatoriska fält måste vara ifyllda.' }).code(400);
                }

                //Hantera filuppladdning
                let uploadedFilePath = null;
                if (file) {
                    const uploadResult = await handleFileUpload(file);
                    uploadedFilePath = `/uploads/${uploadResult.filename}`; //Skapa URL
                }

                //Skapa nyhetsobjekt och spara i databasen
                const portfolio = new Portfolio({
                    project_name,
                    project_description,
                    project_picture: uploadedFilePath, //Spara URL:en
                });

                const savedPortfolio = await portfolio.save();

                return h.response({
                    message: 'Projekt tillagt',
                    news: savedPortfolio,
                }).code(201);
            } catch (err) {
                console.error('Error in creating portfolio:', err.message);
                return h.response({ error: 'Ett fel uppstod vid skapandet av portfolion.' }).code(500);
            }
        }
    }, 

    {
        //Uppdaterar projekt i portfolion 
        method: 'PUT',
        path: '/portfolio/{id}', 
        options: {
            payload: {
                output: 'stream', 
                parse: true, 
                maxBytes: 10 * 1024 * 1024,
            },
            auth: false,
            validate: {
                payload: Joi.object({
                    project_name: Joi.string().min(3).required(), 
                    project_description: Joi.string().min(3).required(),
                    file: Joi.any(),
                })
            }
        },
        handler: async (request, h) => {
            try {
                const { file, project_name, project_description } = request.payload;
                const { id } = request.params;
        
                // Hämta nyhetsobjektet från databasen
                const portfolio = await Portfolio.findById(id);
                if (!portfolio) {
                    return h.response({ error: 'Projectet kunde inte hittas.' }).code(404);
                }
        
                // Uppdatera fält endast om de skickas med
                if (project_name) {
                    portfolio.project_name = project_name;
                }
                
                if (project_description) {
                    portfolio.project_description = project_description; 
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
                    portfolio.project_picture = `/uploads/${filename}`;
                }
        
                // Spara uppdaterade nyhetsdata
                const updatedPortfolio = await portfolio.save();
        
                return h.response({
                    message: 'Projekt uppdaterat',
                    portfolio: updatedPortfolio,
                }).code(200);
        
            } catch (err) {
                console.error('Error in updating portfolio:', err.message);
                return h.response({ error: 'Ett fel uppstod vid uppdateringen av portfolion.' }).code(500);
            }
        }
    }, 

    {
        //Tar bort ett projekt från portfolion
        method: 'DELETE',
        path: '/portfolio/{id}',
        options: {
            auth: false,
        }, 
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