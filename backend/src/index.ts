import Fastify from 'fastify'
import cors from '@fastify/cors'
import { healthRoutes } from './routes/health'
import { apiRoutes } from './routes/api'
const fastify = Fastify({
    logger: true
})

await fastify.register(cors, {
    origin: 'http://localhost:3000',
    credentials: true
})
// Error handler (catches thrown errors)
fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error)
    reply.status(error.statusCode || 500).send({
        error: error.message || 'Internal Server Error',
        statusCode: error.statusCode || 500
    })
})
// Error handler (catches route not found)
fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
        error: "Route not found",
        statusCode: 404,
        path: request.url
    })
})

await fastify.register(healthRoutes)
await fastify.register(apiRoutes)

fastify.get("/", async (request, reply) => {
    return { message: "Hello from Will It Merge API" }
})

const start = async () => {
    try {
        await fastify.listen({ port: 3001, host: '0.0.0.0' });
        console.log('🚀 Server running on http://localhost:3001');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start()