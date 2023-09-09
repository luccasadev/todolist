const fastify = require('fastify')({ logger: true });
const { DatabasePostgres } = require('./database-postgres.js');

const database = new DatabasePostgres();

fastify.post('/videos', async (request, response) => {
    const { title, description, duration } = request.body;

    await database.create({
        title,
        description,
        duration,
    });

    return response.status(201).send();
});

fastify.get('/videos', async (request) => {
    const search = request.query.search;
    const videos = await database.list(search);
    return videos;
});

fastify.put('/videos/:id', async (request, response) => {
    const videoId = request.params.id;
    const { title, description, duration } = request.body;

    await database.update(videoId, {
        title,
        description,
        duration,
    });

    return response.status(204).send();
});

fastify.delete('/videos/:id', async (request, response) => {
    const videoId = request.params.id;
    await database.delete(videoId);
    return response.status(204).send();
});

fastify.listen({
    host: '0.0.0.0',
    port: process.env.PORT || 3333,
}, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server is listening on ${address}`);
});
