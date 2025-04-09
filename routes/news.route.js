const {handleFileUpload} = require('../handlers/fileHandler'); 
const News = require('../models/news');
const Joi = require('joi');
const path = require('path'); 

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
            validate: {
                payload: Joi.object({
                    news_title: Joi.string().min(3).required(),
                    author: Joi.string().required(), 
                    news_content: Joi.string().min(3).required(),
                    news_picture: Joi.any(),
                })
            }
        }, 
        handler: async (request, h) => {
            try {
                const news = await News.findById(request.params.id); 
                
                if (!news) {
                    return h.response({error: 'News not found'}).code(404); 
                }

                if(request.payload.news_picture) {
                    const uploadedFile = await handleFileUpload(request.payload.news_picture, {
                        dest: path.join(__dirname, '../uploads/news'), 
                        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
                        maxFileSize: 5 * 1024 * 1024,
                    });

                    news.news_picture = uploadedFile.filename
                }

                if(request.payload.news_title) { news.news_title = request.payload.news_title }

                if(request.payload.author) { news.author = request.payload.author }

                if(request.payload.news_content) { news.news_content = request.payload.news_content }

                await news.save(); 
                return h.response(news).code(200)
 
            } catch(error) {
                return h.response({error: 'Failed to update post'}).code(500); 
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