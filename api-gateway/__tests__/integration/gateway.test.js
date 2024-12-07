import request from 'supertest';
import app from '../../src/index';
import nock from 'nock';

describe('API Gateway - Routes test', () => {
    test('does nothing if the gateway is working', () => {       
        expect(true).toBe(true);
    })

    test('should return 404 for invalid route', async () => {
        const response = await request(app).get('/invalid');
        expect(response.status).toBe(404);
    });

    test ('GET /user should return 401 if no token is provided', async () => {
        const response = await request(app).get('/user');
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Token is missing');
    });

    test('GET /user should return 200 with valid token' , async () => {
        const token = 'mock-valid-jwt-token';
        const response = await request(app).get('/user').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    beforeAll(() => {
        nock('http://localhost:3001')
            .get('/user')
            .reply(200, { message: 'User list' });

        nock('http://localhost:3002')
            .get('/product')
            .reply(200, { message: 'Product list' });
    });
    
    test('GET /product should route to product service', async () => {
        const response = await request(app).get('/product');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Product list');
    });


    afterAll(() => {
        nock.cleanAll();
        app.close();
    });
});