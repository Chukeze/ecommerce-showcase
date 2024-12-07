import { securityLayer } from "../../src/middlewares/security";
import express from 'express';
import request from 'supertest';

describe('Security Test', () => {
    let app;
    beforeEach(() => {
        app = express();
        securityLayer(app);

        app.get('/test', (req, res) => {
            res.status(200).send('Test route OK');
        });
    });
    test('should add security headers using Helmet', async () => {
        const response = await request(app).get('/test');
        expect(response.headers['x-dns-prefetch-control']).toBeDefined();
        expect(response.headers['x-frame-options']).toBeDefined();
        expect(response.headers['strict-transport-security']).toBeDefined();
        expect(response.headers['x-download-options']).toBeDefined();
        expect(response.headers['x-content-type-options']).toBeDefined();
        expect(response.headers['x-xss-protection']).toBeDefined();
    });

    test('should enable CORS with correct origin', async () => {
        const res = await request(app).get('/test');
        expect(res.headers['access-control-allow-origin']).toBe('*');
    });

    test('should rate limit requests', async () => {
        for (let i = 0; i < 10; i++) {
            await request(app).get('/test');
        }
        const res = await request(app).get('/test');
        expect(res.status).toBe(429);
        expect(res.body.message).toEqual('Too many requests, please try again later');
    });
});