
import { FastifyInstance } from "fastify";

import prisma from "../lib/prisma.js";



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
    fastify.get('/api/test-db', async (request, reply) => {
        const result = await fastify.pg.query('SELECT NOW() as current_time, version() as pg_version')
        return {
            status: 'connected',
            database: result.rows[0]
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

}