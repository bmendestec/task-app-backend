import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { UserRepository } from '../../../domain/repositories/UserRepository.js';
import { AuthController } from '../../../auth/authController.js';
import { log } from 'console';

export class LoginRoutes {
    userRepository: UserRepository;
    server: FastifyInstance;

    constructor(userRepository: UserRepository, server: FastifyInstance) {
        this.userRepository = userRepository;
        this.server = server;
    }

    async execute() {
        const loginController = new AuthController(this.userRepository);
        this.server.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const { email, password } = request.body as { email: string; password: string };
                const token = await loginController.login(email, password);
                if (!token) {
                    throw new Error('Invalid credentials');
                }
                reply.headers({ 'Authorization': `Bearer ${token}` });
                reply.status(200).send(token);
            } catch (error) {
                const err = error as Error;
                if (err.message === 'Invalid credential') {
                    return reply.status(401).send({ message: "Invalid email or password" });
                }
                return reply.status(500).send({ message: "Internal Server Error" });
            }
        });

        this.server.post('/auth/facebook', async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const { token } = request.body as { token: string; };
                const accessToken = await loginController.facebookLogin(token);
                if (!accessToken) {
                    throw new Error('Invalid credentials');
                }
                console.log(accessToken);
                reply.headers({ 'Authorization': `Bearer ${accessToken}` });
                reply.status(200).send(accessToken);
            } catch (error) {
                const err = error as Error;
                if (err.message === 'Invalid credential') {
                    return reply.status(401).send({ message: "Invalid email or password" });
                }
                return reply.status(500).send({ message: "Internal Server Error" });
            }
        });

        this.server.get('/logout', async (request: FastifyRequest, reply: FastifyReply) => {
            const authHeader = request.headers['authorization'];
            if (!authHeader) {
                return reply.status(401).send({ message: 'Authorization header is missing' });
            }
            const token = authHeader.split(' ')[1];
            const response = await loginController.logout(token);

            reply.send(response);
        });

        this.server.get('/validate-token', async (request: FastifyRequest, reply: FastifyReply) => {
            const authHeader = request.headers['authorization'] as string;
            if (!authHeader) {
                return reply.status(401).send({ message: 'Authorization header is missing' });
            }

            const token = authHeader.split(' ')[1];
            const response = await loginController.validateToken(token);

            reply.send(response);
        });
    }
}