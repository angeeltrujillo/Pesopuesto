import path from 'path';
import dotenv from "dotenv";
import supertest from 'supertest';
import { createConnection, getConnection } from 'typeorm';
import { singUpValidator, hashPassword, createUser, createToken } from './auth.service';
import app from '../../Config/Express';
const request = supertest(app)

describe('SingUp Validator function', () => {
    test('User should received user data if he sends valid data', async () => {
        const userDetails = {
            firstName: 'Angel',
            lastName: 'Trujillo',
            userName: 'angeeltrujillo',
            email: 'angeeltrujillo@gmail.com',
            password: 'abc123',
            provider: 'local'
        }
        const user = await singUpValidator(userDetails);
        expect(user).toHaveProperty('firstName')
        expect(user).toHaveProperty('lastName')
        expect(user).toHaveProperty('userName')
        expect(user).toHaveProperty('email')
        expect(user).toHaveProperty('password')
        expect(user).toHaveProperty('provider')
    });
    test('User should received an error if he doesn\'t provide an username', async () => {
        const userDetails = {
            firstName: 'Angel',
            lastName: 'Trujillo',
            email: 'angeeltrujillo@gmail.com',
            password: 'abc123',
            provider: 'local'
        }
        await expect(singUpValidator(userDetails))
            .rejects
            .toThrowError("\"userName\" is required");
    });
    test('User should received an error if he doesn\'t provide an email', async () => {
        const userDetails = {
            firstName: 'Angel',
            lastName: 'Trujillo',
            userName: 'angeeltrujillo',
            password: 'abc123',
            provider: 'local'
        }
        await expect(singUpValidator(userDetails))
            .rejects
            .toThrowError("\"email\" is required");
    });
    test('User should received an error if his email doesn\'t have the rigth format', async () => {
        const userDetails = {
            firstName: 'Angel',
            lastName: 'Trujillo',
            userName: 'angeeltrujillo',
            email: 'Email',
            password: 'abc123',
            provider: 'local'
        }
        await expect(singUpValidator(userDetails))
            .rejects
            .toThrowError("\"email\" must be a valid email");
    });
});

describe('Hash password function', () => {
    test('Hash password return a string', async () => {
        const hashedPassword = await hashPassword('password')
        expect(hashedPassword).toHaveLength(60)
    });
});

describe('Create a new user in the database', () => {
    beforeAll(async () => {
        dotenv.config();
        const databaseUri : string = process.env.DB_URI;
        const con = await createConnection({
            type: "postgres",
            url: databaseUri,
            entities: [
              path.join(__dirname, '..', '*/*.entity.ts')
            ],
            synchronize: true,
            dropSchema: true,
            logging: false
        })
    });

    afterAll( async () => {
        const defaultConnection = getConnection('default')
        await defaultConnection.close()
    });

    test('Return a user if send valid data', async () => {
        const userDetails = {
            firstName: 'Angel',
            lastName: 'Trujillo',
            userName: 'angeeltrujillo',
            email: 'angeeltrujillo@gmail.com',
            password: '$2b$10$CTvCd0Ncy1l33dizDf2PzOw6u4.98YU0kzl9Ug3CqAJKqBNcjwCVa',
            provider: 'local'
        }
        const user = await createUser(userDetails);
        expect(user).toHaveProperty('id', 1);
        expect(user).toHaveProperty('providerId');
        expect(user).toHaveProperty('createdAt')
        expect(user).toHaveProperty('photoUrl')
    });

    test('Return error if there\'s data missing', async () => {
        const userDetails = {
            lastName: 'Trujillo',
            userName: 'angeeltrujillo',
            email: 'angeeltrujillo@gmail.com',
            password: '$2b$10$CTvCd0Ncy1l33dizDf2PzOw6u4.98YU0kzl9Ug3CqAJKqBNcjwCVa',
            provider: 'local'
        }
        await expect(createUser(userDetails))
            .rejects
            .toThrowError('firstName');
    });
    test('Return error if provider is different from enum', async () => {
        const userDetails = {
            firstName: 'Angel',
            lastName: 'Trujillo',
            userName: 'angeeltrujillo',
            email: 'angeeltrujillo@gmail.com',
            password: '$2b$10$CTvCd0Ncy1l33dizDf2PzOw6u4.98YU0kzl9Ug3CqAJKqBNcjwCVa',
            provider: 'Algo'
        }
        await expect(createUser(userDetails))
            .rejects
            .toThrowError('Algo');
    });
});

describe('Create a Token JWT', () => {
    test('Return a JWT', () => {
        const token = createToken(1);
        expect(token).toHaveLength(137);
    });
});

describe('Auth User API Endpoints', () => {
    beforeAll(async () => {
        dotenv.config();
        const databaseUri : string = process.env.DB_URI;
        const con = await createConnection({
            type: "postgres",
            url: databaseUri,
            entities: [
              path.join(__dirname, '..', '*/*.entity.ts')
            ],
            synchronize: true,
            dropSchema: true,
            logging: false
        })
    });

    afterAll( async () => {
        const defaultConnection = getConnection('default')
        await defaultConnection.close()
    });

    test('User SignUp with valid data', async () => {
        const userDetails = {
            firstName: 'Angel',
            lastName: 'Trujillo',
            userName: 'angeeltrujillo',
            email: 'angeeltrujillo@gmail.com',
            password: 'abc123',
        }
        const res = await request.post('/api/v1/auth/signup')
            .send(userDetails)
            .expect(201)
        expect(res.body).toHaveProperty('status', 'Success')
        expect(res.body).toHaveProperty('token')
        expect(res.body).toHaveProperty('data')
        expect(res.body).toHaveProperty('data.user')
        expect(res.body).not.toHaveProperty('data.user.password')
    });
    test('User SignUp with invalid data', async () => {
        const userDetails = {
            firstName: 'Angel',
            email: 'angeeltrujillo@gmail.com',
            password: 'abc123',
        }
        const res = await request.post('/api/v1/auth/signup')
            .send(userDetails)
            .expect(400)
    });
    test('User LogIn with valid data', async () => {
        const userDetails = {
            email: 'angeeltrujillo@gmail.com',
            password: 'abc123',
        }
        const res = await request.post('/api/v1/auth/login')
            .send(userDetails)
            .expect(200)
        expect(res.body).toHaveProperty('status', 'Success')
        expect(res.body).toHaveProperty('token')
        expect(res.body).toHaveProperty('data')
        expect(res.body).toHaveProperty('data.user')
        expect(res.body).not.toHaveProperty('data.user.password')
    });
    test('User LogIn with invalid data', async () => {
        const userDetails = {
            email: 'angeeltrujillo@gmail.com',
            password: 'abc1234',
        }
        const res = await request.post('/api/v1/auth/login')
            .send(userDetails)
            .expect(401)
    });
});
