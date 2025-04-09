const {handleFileUpload} = require('../handlers/fileHandler'); 
const News = require('../models/news');
const Joi = require('joi');
const Path = require('path'); 
const Fs = require('fs'); 

const newsRouteArr = [
    {
        //hämta alla nyhetsinlägg
        method: 'GET', 
        path: '/news',
        handler: async (request, h) => {
            try {
                const news = await News.find();
                return h.response(news).code(200);
            } catch(error) {
                return h.response({ error: 'Failed to fetch news' }).code(500);
            }
        }
    }, 

    {
        //hämta nyhetsinlägg med id
        method: 'GET',
        path: '/news/{id}',
        handler: async (request, h) => {
            try {
                const news = await News.findById(request.params.id); 
                return h.response(news).code(200); 
            } catch(error) {
                return h.response({error: 'Failed to fetch this piece of news'}).code(500); 
            }
        }
    }, 

    {
        //skapa ett nytt nyhetsinlägg
        method: 'POST',
        path: '/news',
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
                    news_title: Joi.string().min(3).required(),
                    author: Joi.string().required(), 
                    news_content: Joi.string().min(3).required(),
                    file: Joi.any()
                })
            }
        },
        handler: async (request, h) => {
            try {
                const { file, news_title, author, news_content } = request.payload;

                if (!news_title || !author || !news_content) {
                    return h.response({ error: 'Alla obligatoriska fält måste vara ifyllda.' }).code(400);
                }

                // Hantera filuppladdning
                let uploadedFilePath = null;
                if (file) {
                    const uploadResult = await handleFileUpload(file);
                    uploadedFilePath = `/uploads/${uploadResult.filename}`; // Skapa URL
                }

                // Skapa nyhetsobjekt och spara i databasen
                const news = new News({
                    news_title,
                    author,
                    news_content,
                    news_picture: uploadedFilePath, // Spara URL:en
                });

                const savedNews = await news.save();

                return h.response({
                    message: 'Nyhet skapad',
                    news: savedNews,
                }).code(201);
            } catch (err) {
                console.error('Error in creating news:', err.message);
                return h.response({ error: 'Ett fel uppstod vid skapandet av nyheten.' }).code(500);
            }
        }
    }, 

    {
        method: 'PUT',
        path: '/news/{id}',
        options: {
            payload: {
                output: 'stream', 
                parse: true, 
                maxBytes: 10 * 1024 * 1024,
            },
            auth: false,
            validate: {
                payload: Joi.object({
                    news_title: Joi.string().min(3).required(),
                    author: Joi.string().required(), 
                    news_content: Joi.string().min(3).required(),
                    file: Joi.any(),
                })
            }
        }, 
        handler: async (request, h) => {
            try {
                const { file, news_title, author, news_content } = request.payload;
                const { id } = request.params;
        
                // Hämta nyhetsobjektet från databasen
                const news = await News.findById(id);
                if (!news) {
                    return h.response({ error: 'Nyheten kunde inte hittas.' }).code(404);
                }
        
                // Uppdatera fält endast om de skickas med
                if (news_title) {
                    news.news_title = news_title;
                }
                if (author) {
                    news.author = author;
                }
                if (news_content) {
                    news.news_content = news_content;
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
                    news.news_picture = `/uploads/${filename}`;
                }
        
                // Spara uppdaterade nyhetsdata
                const updatedNews = await news.save();
        
                return h.response({
                    message: 'Nyhet uppdaterad',
                    news: updatedNews,
                }).code(200);
        
            } catch (err) {
                console.error('Error in updating news:', err.message);
                return h.response({ error: 'Ett fel uppstod vid uppdateringen av nyheten.' }).code(500);
            }
        }
    }, 

    {
        method: 'DELETE',
        path: '/news/{id}',
        handler: async (request, h) => {
            try {
                const news = await News.findByIdAndDelete(request.params.id); 
                if (!news) {
                    return h.response({error: 'News not found'}).code(404); 
                }
                return h.response({message: 'News deleted successfully'}).code(200);
            } catch(error) {
                return h.response({error: 'Failed to delete post'}).code(500); 
            }
        }
    }
]; 

module.exports = newsRouteArr;