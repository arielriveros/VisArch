const request = require('supertest');
const api = require('../api');
const mongoose = require('mongoose');
require('dotenv').config()

beforeAll(async () => {
    await mongoose.disconnect();
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
  });

describe("POST /api/user/register", () => {    
    describe("Given incorrect parameters", () => {
        test("No password: Should return a 400 status code", async () => {
            const response = await request(api)
                .post("/api/user/register")
                .send({
                    username: "test"
                });
            expect(response.statusCode).toBe(400);
        });
        test("No username: Should return a 400 status code", async () => {
            const response = await request(api)
                .post("/api/user/register")
                .send({
                    password: "test"
                });
            expect(response.statusCode).toBe(400);
        });
        test("Password too short: Should return a 400 status code", async () => {
            const response = await request(api)
                .post("/api/user/register")
                .send({
                    username: "test",
                    password: "test"
                });
            expect(response.statusCode).toBe(400);
        });
        test("Invalid e-mail address: Should return a 400 status code", async () => {
            const response = await request(api)
                .post("/api/user/register")
                .send({
                    username: "test",
                    email: "test@",
                    password: "test01"
                });
            expect(response.statusCode).toBe(400);
        });
    });
    describe("Given a username and password", () => {
        test("Should return a 201 status code", async () => {
            const response = await request(api)
                .post("/api/user/register")
                .send({
                    username: "test2",
                    email: "",
                    password: "test012"
                });
            expect(response.statusCode).toBe(201);
        });
    });

});
