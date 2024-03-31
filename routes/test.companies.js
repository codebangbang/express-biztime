const request = require('supertest');
const app = require('../app');
const db = require('../db');
const {createData} = require('./_test-common');

beforeEach(createData);
    
afterAll(async () => {
    await db.end();
}   );

describe('GET /companies', function() {
    test('get all companies', async function() {
        const response = await request(app).get('/companies');
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
            companies: [
                {code: 'apple', name: 'Apple Computer', description: 'Maker of OSX.'},
                {code: 'ibm', name: 'IBM', description: 'Big blue.'},
                {code: 'oracle', name: 'Oracle', description: 'Larry Ellison\'s company.'}
            ]
        });
    });
});


describe('GET /apple', function() {
    test(' get company by code', async function() {
        const response = await request(app).get('/companies/apple');
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
            company: {
                code: 'apple',
                name: 'Apple Computer',
                description: 'Maker of OSX.',
                invoices: [
                    {id: 1},
                    {id: 2}
                ]
            }
        });
    }); 
});

describe('POST /companies', function() {
    test('create a new company', async function() {
        const response = await request(app)
            .post('/companies')
            .send({name: 'Microsoft', description: 'Bill Gates\' company'});
        expect(response.statusCode).toEqual(201);
        expect(response.body).toEqual({
            company: {code: 'microsoft', name: 'Microsoft', description: 'Bill Gates\' company'}
        });
    });
});


describe('PUT /companies/apple', function() {
    test('update a company', async function() {
        const response = await request(app)
            .put('/companies/apple')
            .send({name: 'Apple Computer Inc.', description: 'Maker of OSX.'});
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
            company: {code: 'apple', name: 'Apple Computer Inc.', description: 'Maker of OSX.'}
        });
    });
});

describe('DELETE /companies/apple', function() {
    test('delete a company', async function() {
        const response = await request(app).delete('/companies/apple');
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({status: "deleted"});
    });
});


