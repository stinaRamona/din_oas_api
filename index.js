'use strict';

const Hapi = require('@hapi/hapi');
const Mongoose = require('mongoose'); 
const loginAuthStrategy = require('./loginauth'); 
const Inert = require('@hapi/inert'); 
const Path = require('path'); 
require('dotenv').config(); 

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost', 
        routes: {
            cors: {
                origin: ['*']
            },
            payload: {
                maxBytes: 10 * 1024 * 1024, //Maximal payload-storlek (10 MB)
                multipart: { output: 'stream' }, //Stöd för multipart-form-data
            },
        },
    });

    //initiera Inert
    await server.register(Inert);

    //validering med authstrategy 
    await loginAuthStrategy(server);

    //kopplar till databasen 
    Mongoose.connect(process.env.DATABASE).then(() => {
        console.log("Ansluten till MongoDB"); 
    }).catch((error) => {
        console.log("Fel vid anslutning:" + error); 
    });

    //Rutter för nyheter, tjänster och portfolio
    const routes = require("./routes/combined.route"); 
    server.route(routes);

    //Route för att komma åt statiska filer
    server.route({
        method: 'GET',
        path: '/uploads/{file*}', //matcha filer i "uploads"-mappen
        options: {
            auth: false
        },
        handler: {
            directory: {
                path: Path.join(__dirname, 'uploads'),
                listing: true, //Visar filerna om URL:en inte pekar på en specifik fil
            },
        },
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};


process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();