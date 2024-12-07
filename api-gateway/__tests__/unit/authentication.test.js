import jwt from 'jsonwebtoken';
import { authenticateToken } from '../../src/middlewares/authentication';

describe('Authentication Token test', () => {
    const mockNext = jest.fn();
    let mockRequest;
    let mockResponse;
    beforeEach(() => {
        mockRequest = {
            headers: {
                authorization: '',
            },
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    test('should validate JWT token is decoded correctly', () => {
        const mockUser = {id: '001', username: 'testuser', email:'test@example.com', password:'password123', role: 'customer'};
        mockRequest.headers.authorization = 'Bearer valid-token';
        jwt.verify = jest.fn((token, secret, callback) => callback(null, mockUser));

        authenticateToken(mockRequest, mockResponse, mockNext);
        expect(mockNext).toHaveBeenCalled();
        expect(mockRequest.user).toEqual(mockUser);
    });

    test('should validate JWT token is missing', () => {
        authenticateToken(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Token is missing' });
    }); 

    test('should return 403 JWT token is invalid', () => {
        mockRequest.headers.authorization = 'Bearer invalid-token';
        jwt.verify = jest.fn((token, secret, callback) => callback(new Error('Invalid token'), null));
        authenticateToken(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Token is invalid' });
    });

    test('should deny request correctly', () => {  
        mockRequest.headers.authorization = 'Bearer Invalid-token';
        jwt.verify = jest.fn((token, secret, callback) => callback(new Error('Invalid token'), null));
        authenticateToken(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Token is invalid' });
    });
})