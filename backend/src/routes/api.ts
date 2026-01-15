
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

    fastify.post('/api/trades', async (request, reply) => {
        const { userId, marketId, position } = request.body as {
            userId: number;
            marketId: number;
            position: 'YES' | 'NO'
        }

        if (!userId || !marketId || !position) {
            return reply.status(400).send({
                error: "Missing required fields: userId, marketId, position",
                statusCode: 400
            })
        }
        if (position != 'YES' && position !== 'NO') {
            return reply.status(400).send({
                error: 'Position must be YES or NO',
                statusCode: 400
            })
        }
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })
        if (!user) {
            return reply.status(404).send({
                error: 'User not found',
                statuCode: 404
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
        if (market.status !== 'open') {
            return reply.status(400).send({
                error: 'Cannot trade on closed or resolved markets',
                statusCode: 400
            })
        }
        const trade = await prisma.trade.create({
            data: {
                userId,
                marketId,
                position,
                amount: 1
            }
        })
        return { trade, message: 'Trade created successfully' }
    })

    fastify.get("/api/markets/:id/trades", async (request, reply) => {
        const { id } = request.params as { id: string }
        const marketId = parseInt(id, 10)
        if (isNaN(marketId)) {
            return reply.status(400).send({
                error: "Invalid Market Id",
                statusCode: 400
            })
        }

        const market = await prisma.market.findUnique({
            where: { id: marketId }
        })
        if (!market) {
            return reply.status(404).send({
                error: "Market not found",
                statusCode: 404
            })
        }
        const trades = await prisma.trade.findMany({
            where: { marketId },
            include: {
                user: {
                    select: {
                        id: true,
                        githubUsername: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return { trades, count: trades.length }
    })
}