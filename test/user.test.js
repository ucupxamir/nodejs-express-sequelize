const supertest = require('supertest')
const web = require('../src/app/web')
const testUtils = require('./test-utils')

describe('POST /api/register', function () {

    afterEach(async () => {
        await testUtils.removeUser()
    })

    it('should success register new user', async () => {
        const result = await supertest(web)
            .post('/api/register')
            .send({
                username: 'testuser',
                password: 'rahasia123',
                email: 'testuser@email.com',
                phone: '081234567890',
                address: 'depok'
            })

        expect(result.status).toBe(200)
    })

    it('should reject if request is invalid', async () => {
        const result = await supertest(web)
            .post('/api/register')
            .send({
                username: '',
                password: '',
                email: '',
                phone: '',
                address: ''
            })

        expect(result.status).toBe(400)
        expect(result.body.errors).toHaveLength(5)
    })

    it('should reject if request is empty', async () => {
        const result = await supertest(web)
            .post('/api/register')
            .send({})

        expect(result.status).toBe(400)
        expect(result.body.errors).toHaveLength(3)
    })

    it('should reject if username already in use', async () => {
        await testUtils.createUser('testuser', 'testuser@email.com')

        const result = await supertest(web)
            .post('/api/register')
            .send({
                username: 'testuser',
                password: 'rahasia123',
                email: 'testuser@email.com',
                phone: '081234567890',
                address: 'depok'
            })

        expect(result.status).toBe(409)
        expect(result.body.errors).toHaveLength(1)
        expect(result.body.errors[0]).toBe('username or email already in use')
    })

    it('should reject if email already in use', async () => {
        await testUtils.createUser('testuser', 'testuser@email.com')

        const result = await supertest(web)
            .post('/api/register')
            .send({
                username: 'testuser2',
                password: 'rahasia123',
                email: 'testuser@email.com',
                phone: '081234567890',
                address: 'depok'
            })

        expect(result.status).toBe(409)
        expect(result.body.errors).toHaveLength(1)
        expect(result.body.errors[0]).toBe('username or email already in use')
    })

})

describe('POST /api/login', function () {

    afterEach(async () => {
        await testUtils.removeUser()
    })

    it('should success login', async () => {
        await testUtils.createUser('testuser', 'testuser@email.com')

        const result = await supertest(web)
            .post('/api/login')
            .auth('testuser', 'rahasia123')

        expect(result.status).toBe(200)
    })

    it('should reject if user not found', async () => {
        const result = await supertest(web)
            .post('/api/login')
            .auth('testuser', 'rahasia123')

        expect(result.status).toBe(404)
        expect(result.body.errors).toHaveLength(1)
        expect(result.body.errors[0]).toBe('user was not found')
    })

    it('should reject if password wrong', async () => {
        await testUtils.createUser('testuser', 'testuser@email.com')

        const result = await supertest(web)
            .post('/api/login')
            .auth('testuser', 'rahasia1234')

        expect(result.status).toBe(400)
        expect(result.body.errors).toHaveLength(1)
        expect(result.body.errors[0]).toBe('username or password wrong')
    })

})

describe('POST /api/logout', function () {

    afterEach(async () => {
        await testUtils.removeUser()
    })

    it('should success logout', async () => {
        await testUtils.createUser('testuser', 'testuser@email.com')
        const token = await testUtils.loginUser()

        const result = await supertest(web)
            .post('/api/logout')
            .set('Token', token)

        expect(result.status).toBe(200)
    })

})

describe('POST /api/change-password', function () {

    afterEach(async () => {
        await testUtils.removeUser()
    })

    it('should success change password', async () => {
        await testUtils.createUser('testuser', 'testuser@email.com')

        const token = await testUtils.loginUser()

        const result = await supertest(web)
            .put('/api/change-password')
            .set('Token', token)
            .send({
                username: 'testuser',
                old_password: 'rahasia123',
                new_password: 'newpass123'
            })

        expect(result.status).toBe(200)
    })

    it('should reject if request is invalid', async () => {
        await testUtils.createUser('testuser', 'testuser@email.com')

        const token = await testUtils.loginUser()

        const result = await supertest(web)
            .put('/api/change-password')
            .set('Token', token)
            .send({
                username: '',
                old_password: '',
                new_password: ''
            })

        expect(result.status).toBe(400)
        expect(result.body.errors).toHaveLength(3)
    })

    it('should reject if change another user', async () => {
        await testUtils.createUser('testuser', 'testuser@email.com')

        const token = await testUtils.loginUser()

        const result = await supertest(web)
            .put('/api/change-password')
            .set('Token', token)
            .send({
                username: 'testuser1',
                old_password: 'rahasia123',
                new_password: 'newpass123'
            })

        expect(result.status).toBe(401)
        expect(result.body.errors).toHaveLength(1)
        expect(result.body.errors[0]).toBe('unauthorized')
    })

    it('should reject if old password and new password is same', async () => {
        await testUtils.createUser('testuser', 'testuser@email.com')

        const token = await testUtils.loginUser()

        const result = await supertest(web)
            .put('/api/change-password')
            .set('Token', token)
            .send({
                username: 'testuser',
                old_password: 'rahasia123',
                new_password: 'rahasia123'
            })

        expect(result.status).toBe(400)
        expect(result.body.errors).toHaveLength(1)
        expect(result.body.errors[0]).toBe('new password must be different with old password')
    })

    it('should reject if old password is wrong', async () => {
        await testUtils.createUser('testuser', 'testuser@email.com')

        const token = await testUtils.loginUser()

        const result = await supertest(web)
            .put('/api/change-password')
            .set('Token', token)
            .send({
                username: 'testuser',
                old_password: 'rahasia1234',
                new_password: 'newpass123'
            })

        expect(result.status).toBe(400)
        expect(result.body.errors).toHaveLength(1)
        expect(result.body.errors[0]).toBe('old password is wrong')
    })

})

