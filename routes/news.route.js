const News = require('../models/news');
const Joi = require('joi');

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
            auth: false, 
            validate: {
                payload: Joi.object({
                    news_title: Joi.string().min(3).required(),
                    author: Joi.string().required(), 
                    news_content: Joi.string().min(3).required(),
                    news_picture: Joi.string()
                })
            }
        },
        handler: async (request, h) => {
            try {
                const news = new News(request.payload); 
                return await news.save(); 
            } catch(error) {
                return h.response({error: 'Failed to create post'}).code(500); 
            }
        }
    }, 

    {
        method: 'PUT',
        path: '/news/{id}',
        options: {
            validate: {
                payload: Joi.object({
                    news_title: Joi.string().min(3).required(),
                    author: Joi.string().required(), 
                    news_content: Joi.string().min(3).required(),
                    news_picture: Joi.string(),
                })
            }
        }, 
        handler: async (request, h) => {
            try {
                const news = await News.findByIdAndUpdate(
                    request.params.id,
                    request.payload,
                    {new: true}
                ); 
                if (!news) {
                    return h.response({error: 'News not found'}).code(404); 
                }
                return h.response(news).code(200); 

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