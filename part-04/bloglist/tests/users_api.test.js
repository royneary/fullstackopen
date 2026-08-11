const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const helper = require("./test_helper");
const User = require("../models/user");
const { default: mongoose } = require("mongoose");

const api = supertest(app);

describe("With one initial user in the database", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("verysecurepassword", 10);
    const user = new User({
      username: "root",
      name: "Superuser",
      passwordHash,
    });
    await user.save();
  });

  test("that user is returned as json", async () => {
    const response = await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /^application\/json/);

    assert.strictEqual(response.body.length, 1);
    assert.strictEqual(response.body[0].username, "root");
  });

  describe("creating a user", () => {
    test("works if all fields are valid", async () => {
      const newUser = {
        username: "Christian",
        name: "Christian Ulrich",
        password: "mysecret",
      };
      await api
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect("Content-Type", /^application\/json/);

      const usersAtEnd = await helper.usersInDb();
      const usernames = usersAtEnd.map((u) => u.username);
      assert(usernames.includes(newUser.username));
    });

    test("fails if username already exists", async () => {
      const newUser = {
        username: "root",
        name: "Super User",
        password: "supersecurepassword",
      };
      const response = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /^application\/json/);

      assert(response.body.error.includes("`username` must be unique"));

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, 1);
    });

    test("fails if username is missing", async () => {
      const newUser = {
        name: "Al Bundy",
        password: "supersecurepassword",
      };
      const response = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /^application\/json/);

      assert(response.body.error.includes("`username` is required"));

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, 1);
    });

    test("fails if password is missing", async () => {
      const newUser = {
        username: "albundy",
        name: "Al Bundy",
      };
      const response = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /^application\/json/);

      assert(response.body.error.includes("`password` is missing"));

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, 1);
    });

    test("fails if username is too short", async () => {
      const newUser = {
        username: "al",
        name: "Al Bundy",
        password: "supersecurepassword",
      };
      const response = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /^application\/json/);

      assert(
        response.body.error.includes(
          "is shorter than the minimum allowed length",
        ),
      );

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, 1);
    });

    test("fails if password is too short", async () => {
      const newUser = {
        username: "albert",
        name: "Albert Einstein",
        password: "pw",
      };
      const response = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /^application\/json/);

      assert(
        response.body.error.includes("`password` is missing or too short"),
      );

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, 1);
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
