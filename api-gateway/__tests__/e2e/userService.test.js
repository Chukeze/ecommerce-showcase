import request from 'supertest'
import app from '../../services/user-service/src/index'

describe('User Service End-to-End Tests', () => {
  test('POST /user/register should create a new user', async () => {
    const res = await request(app).post('/user/register').send({
      email: 'e2euser@example.com',
      password: 'e2epassword',
      username: 'e2euser',
    })
    expect(res.statusCode).toEqual(201)
    expect(res.body.message).toEqual('Customer registered successfully')
  })

  test('POST /user/login should authenticate user', async () => {
    await request(app).post('/user/register').send({
      email: 'e2euser@example.com',
      password: 'e2epassword',
      username: 'e2euser',
    })
    const res = await request(app).post('/user/login').send({
      email: 'e2euser@example.com',
      password: 'e2epassword',
    })
    expect(res.statusCode).toEqual(200)
    expect(res.body.message).toEqual('Login successful')
  })
})
