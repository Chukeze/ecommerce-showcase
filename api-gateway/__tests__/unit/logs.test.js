import { errorHandler } from '../src/middlewares/errorHandlerMiddleware'

describe('Error Handler Middleware - Unit Tests', () => {
  let mockReq
  let mockRes
  const mockNext = jest.fn()

  beforeEach(() => {
    mockReq = {}
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  test('should return 500 and a message when an error is thrown', () => {
    const error = new Error('Test error')

    errorHandler(error, mockReq, mockRes, mockNext)
    expect(mockRes.status).toHaveBeenCalledWith(500)
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
    })
  })
})
