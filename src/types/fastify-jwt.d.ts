import 'fastify'
import { FastifyReply } from 'fastify';

declare module 'fastify' {
    interface FastifyRequest {
        user: {
            id: string;
            name: string;
            email: string;
            birthDate: Date;
            createdAt: Date;
            updateAt: Date;
        }
        jwtVerify(): Promise<void>
    }
    interface FastifyInstance {
        authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
        jwt: {
            sign: FastifyJWT['sign'];
            verify: FastifyJWT['verify'];
            decode: FastifyJWT['decode'];
          };
    }

}