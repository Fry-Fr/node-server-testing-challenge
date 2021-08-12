const response = require('supertest');
const server = require('./server');

describe('server.js', () => {
    describe('[GET] /', () => {
        it("endpoint '/' get 200 and {api:'up'} response", () => {
            return response(server)
                .get('/')
                .expect(200, { api: 'up' })
        });
    });
});