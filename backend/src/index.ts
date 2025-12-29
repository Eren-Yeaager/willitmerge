import Fastify from "fastify";
const fastify = Fastify({ logger: true })
fastify.get('/', async (request, reply) => {
    return { message: "Hello" }
})

const start = async () => {
    try {
        await fastify.listen({ port: 3001 })
        console.log('Server running on http://localhost:3001')
    } catch (error) {
        fastify.log.error(error)
        process.exit(1)
    }
}
start()