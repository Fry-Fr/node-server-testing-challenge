const response = require('supertest');
const server = require('./server');
const db = require('../data/db-config');
const User = require('./users/user-model');

describe('server.js', () => {
    beforeAll(async () => {
        await db.migrate.rollback();
        await db.migrate.latest();
    });

    beforeEach(async () => {
        await db('users').truncate();
      });

    afterAll(async () => {
        await db.destroy();
    });

    test('proper database env variable is set', () => {
        expect(process.env.DB_ENV).toEqual('testing');
    });

    describe("[GET] '/'", () => {
        it("endpoint '/' get 200 and {api:'up'} response", () => {
            return response(server)
                .get('/')
                .expect(200, { api: 'up' })
        });
    });

    describe("[GET] '/api/users'", () => {
        it('returns an empty array if no data in users table', async () => {
            const res = await response(server).get('/api/users');

            expect(res.body).toEqual([])
        });

        it('returns an array of users when db has been seeded', async () => {
            await db.seed.run();
            const res = await response(server).get('/api/users');

            expect(res.body).toHaveLength(3);
        });

        it('table has id and user_name propertys ', async () => {
            await db.seed.run();
            const res = await response(server).get('/api/users');
            
            res.body.forEach(user => {
                expect(user).toHaveProperty('id');
                expect(user).toHaveProperty('user_name');
            });
        });

    });

    describe("[GET] '/api/users/:id'", () => {
        it('returns user if it exists', async () => {
            await db.seed.run();
            const res = await response(server).get('/api/users/1');

            expect(res.body).toMatchObject({ id: 1, user_name: "David"});
        });

        it("returns 404 status and message if user doesn't exist", () => {
            const id = 123;
            return response(server).get(`/api/users/${id}`)
            .expect(404, { message: `No user with id ${id}` });
        });
    });

    describe("[POST] '/api/users'", () => {
        it('creates a new name into users db', async () => {
            const newUser = await User.add({ user_name: "Ryan" });
            const res = await response(server).get(`/api/users/${newUser.id}`);

            expect(res.body).toMatchObject({ id: 1, user_name: "Ryan" });
        });

        it('makes sure the post request created a new user to database', async () => {
            const res = await response(server).post('/api/users').send({ user_name: "Ryan" });

            expect(await User.findById(res.body.id)).toMatchObject({ id: 1, user_name: "Ryan" });
        });

        it('responds with 201 status code', async () => {
            return response(server).post('/api/users').send({ user_name: "Ryan" })
            .expect(201, { id: 1, user_name: "Ryan" })
        });
    });

    describe("[Put] '/api/users/:id'", () => {
        it('updates a user_name in the database', async () => {
            await User.add({ user_name: "Ryan" });

            expect(await User.findById(1)).toMatchObject({ id: 1, user_name: "Ryan" });
            await response(server).put('/api/users/1').send({ user_name: "Ryan1" })
            expect(await User.findById(1)).toMatchObject({ id: 1, user_name: "Ryan1" });
        });
        it('response with 200 success', async () => {
            await User.add({ user_name: "Rngo" })
            const res = await response(server).put('/api/users/1').send({ user_name: "Ringo" })
            
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({ id: 1, user_name: "Ringo" })
        });
    });

    describe("[DELETE] '/api/users/:id", () => {
        it('deletes user from db', async () => {
            await db.seed.run();
            const users = await User.findAll();
            expect(users).toHaveLength(3);

            await response(server).delete('/api/users/1')
            const delUsers = await User.findAll();
            expect(delUsers).toHaveLength(2);
        });

        it('responds with 204 status', async () => {
            await db.seed.run();

            return response(server).delete('/api/users/1')
            .expect(204)
        });

        it('responds with 404 if user id does not exist', () => {
            const id = 123;
            return response(server).delete(`/api/users/${id}`)
            .expect(404, { message: `No user with id ${id}`})
        });
    });
});