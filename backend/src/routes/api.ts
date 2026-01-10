
import { FastifyInstance } from "fastify";
import prisma from "../lib/prisma.js";
import { error } from "console";


export async function apiRoutes(fastify: FastifyInstance) {
    fastify.get('/api/status', async (request, reply) => {
        return {
            status: "ok",
            timestamp: new Date().toISOString(),
            service: "Will It Merge API"
        }
    })

    fastify.get('/api/greeting', async (request, reply) => {
        return {
            message: 'Hello from Will It Merge',
            timestamp: new Date().toISOString()
        }
    })

    fastify.post('/api/users', async (request, reply) => {
        const { githubUsername, email } = request.body as { githubUsername: string; email?: string }
        const user = await prisma.user.create({
            data: {
                githubUsername,
                email: email || null
            }
        })
        return { user, message: "User created successfully" }
    })

    fastify.get('/api/users', async (request, reply) => {
        const users = await prisma.user.findMany()
        return { users, conunt: users.length }
    })

    fastify.post('/api/markets', async (request, reply) => {
        const { prUrl, question, endTime } = request.body as {
            prUrl: string;
            question: string;
            endTime: string
        }
        if (!prUrl || !question || !endTime) {
            return reply.status(400).send({
                error: 'Missing required fields: prUrl, question , endTime',
                statusCode: 400
            })
        }

        const endDate = new Date(endTime)
        if (endDate <= new Date()) {
            return reply.status(400).send({
                error: 'endTime must be in the future',
                statusCode: 400
            })
        }
        const market = await prisma.market.create({
            data: {
                prUrl,
                question,
                endTime: endDate,
                status: 'open'
            }
        })
        return { market, message: 'Market created successfully' }
    })

    fastify.get("/api/markets", async (request, reply) => {
        const markets = await prisma.market.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })
        return { markets, count: markets.length }

    })

    fastify.get('/api/markets/:id', async (request, reply) => {
        const { id } = request.params as { id: string }
        const marketId = parseInt(id, 10)

        if (isNaN(marketId)) {
            return reply.status(400).send({
                error: 'Invalid market ID',
                statusCode: 400
            })
        }
        const market = await prisma.market.findUnique({
            where: { id: marketId }
        })
        if (!market) {
            return reply.status(404).send({
                error: 'Market not found',
                statusCode: 404
            })
        }
        return { market }
    })
}