import Fastify from 'fastify'
import cors from '@fastify/cors'
import { healthRoutes } from './routes/health'
const fastify = Fastify({
    logger: true
})

await fastify.register(cors, {
    origin: 'http://localhost:3000',
    credentials: true
})
await fastify.register(healthRoutes)

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