import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import redis from '../infra/redis/index.js';
import { FastifyReply, FastifyRequest } from 'fastify';
import { UserRepository } from '../domain/repositories/UserRepository.js';

export async function loginUser(email: string, password: string, request: FastifyRequest, reply: FastifyReply, userRepository: UserRepository): Promise<string> {
    
    const user = await userRepository.findByEmail(email);
    console.log('Log de authService L11: user = ', user);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
        expiresIn: '7d',
    });
    return reply.send({ token });
}


