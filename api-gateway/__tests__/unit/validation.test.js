import { validateRequest } from "../../src/middlewares/validation";
import { body, validationResult } from "express-validator";

describe('Validation', () => {
    test('should pass validation for correct input', () => {
        const req = {
            body: {
                email: 'gooduser@example.com',
                password:'goodpassword123',
                username: 'gooduser'
            }
        };
        const res = {

        }
        const next = jest.fn()

        validateRequest[2](req, res, next)
        expect(validationResult(req).isEmpty()).toBe(true);
        expect(next).toHaveBeenCalled();
    });

    test('should fail validation for incorrect email format', () => {
        const req = {
            body: {
                email: 'baduserexample.com',
                password:'goodpassword123',
                username: 'gooduser'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn()

        validateRequest[2](req, res, next);
        expect(validationResult(req).isEmpty()).toBe(false);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalled();
    });

        test('should fail validation for incorrect email', () => {
        const req = {
            body: {
                email: 'wrongemail@example.com',
                password:'goodpassword123',
                username: 'gooduser'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn()

        validateRequest[2](req, res, next);
        expect(validationResult(req).isEmpty()).toBe(false);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalled();
    });

    test('should fail validation for password length less than 10', () => {
        const req = {
            body: {
                email: 'gooduser@example.com',
                password:'g23',
                username: 'gooduser'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn()
        validateRequest[2](req, res, next);
        expect(validationResult(req).isEmpty()).toBe(false);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalled();
    });
});