const request = require('supertest');
const app = require('../app');
const db = require('../db');
const {createData} = require('./_test-common');

beforeEach(createData);
    
afterAll(async () => {
    await db.end();
}   );


describe('GET /invoices', function() {
    test('get all invoices', async function() {
        const response = await request(app).get('/invoices');
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
            invoices: [
                {id: 1, comp_code: 'apple', amt: 100},
                {id: 2, comp_code: 'apple', amt: 200},
                {id: 3, comp_code: 'ibm', amt: 300}
            ]
        });
    });
});


describe('GET /1', function() {
    test(' get invoice by id', async function() {
        const response = await request(app).get('/invoices/1');
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
            invoice: {
                id: 1,
                amt: 100,
                paid: false,
                add_date: '2018-01-01T05:00:00.000Z',
                paid_date: null,
                company: {
                    code: 'apple',
                    name: 'Apple Computer',
                    description: 'Maker of OSX.'
                }
            }
        });
    }); 
});


describe('POST /invoices', function() {
    test('create a new invoice', async function() {
        const response = await request(app)
            .post('/invoices')
            .send({amt: 400, comp_code: 'ibm'});
        expect(response.statusCode).toEqual(201);
        expect(response.body).toEqual({
            invoice: {id: 4, comp_code: 'ibm', amt: 400, paid: false, add_date: expect.any(String), paid_date: null}
        });
    });
});


describe('PUT /invoices/1', function() {
    test('update an invoice', async function() {
        const response = await request(app)
            .put('/invoices/1')
            .send({amt: 500});
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
            invoice: {id: 1, comp_code: 'apple', amt: 500, paid: false, add_date: expect.any(String), paid_date: null}
        });
    });
});

describe('DELETE /invoices/1', function() {
    test('delete an invoice', async function() {
        const response = await request(app).delete('/invoices/1');
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({status: "deleted"});
    });
});


