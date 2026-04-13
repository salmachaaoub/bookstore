const request = require("supertest");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret";
process.env.JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "test-jwt-refresh-secret";

jest.mock("../models/utilisateur.js", () => {
  const bcrypt = require("bcryptjs");

  const users = [
    {
      _id: "u1",
      nom: "Admin",
      email: "admin@mail.com",
      motDePasse: bcrypt.hashSync("123456", 10),
      role: "ADMIN",
      isActive: true,
    },
    {
      _id: "u2",
      nom: "Membre",
      email: "membre@mail.com",
      motDePasse: bcrypt.hashSync("123456", 10),
      role: "MEMBRE",
      isActive: true,
    },
    {
      _id: "u3",
      nom: "Inactive",
      email: "inactive@mail.com",
      motDePasse: bcrypt.hashSync("123456", 10),
      role: "MEMBRE",
      isActive: false,
    },
  ];

  const copy = (value) => JSON.parse(JSON.stringify(value));

  const withoutPassword = (user) => {
    if (!user) return null;
    const clean = copy(user);
    delete clean.motDePasse;
    return clean;
  };

  const toDocument = (user) => {
    if (!user) return null;

    return {
      ...copy(user),
      save: async function save() {
        const index = users.findIndex((item) => item._id === this._id);
        if (index === -1) return null;

        users[index] = {
          ...users[index],
          nom: this.nom,
          email: this.email,
          motDePasse: this.motDePasse,
          role: this.role,
          isActive: this.isActive,
        };

        return toDocument(users[index]);
      },
      deleteOne: async function deleteOne() {
        const index = users.findIndex((item) => item._id === this._id);
        if (index !== -1) {
          users.splice(index, 1);
        }
      },
    };
  };

  const singleQuery = (user) => ({
    select: async () => withoutPassword(user),
    then: (resolve, reject) =>
      Promise.resolve(toDocument(user)).then(resolve, reject),
    catch: (reject) => Promise.resolve(toDocument(user)).catch(reject),
  });

  const manyQuery = (list) => ({
    select: async () => list.map((item) => withoutPassword(item)),
    then: (resolve, reject) =>
      Promise.resolve(list.map((item) => toDocument(item))).then(
        resolve,
        reject
      ),
    catch: (reject) =>
      Promise.resolve(list.map((item) => toDocument(item))).catch(reject),
  });

  return {
    findOne: jest.fn(async (filter) => {
      const user = users.find((item) => item.email === filter.email) || null;
      return toDocument(user);
    }),
    create: jest.fn(async (data) => {
      const user = {
        _id: `u${users.length + 1}`,
        nom: data.nom,
        email: data.email,
        motDePasse: data.motDePasse,
        role: data.role || "MEMBRE",
        isActive: true,
      };

      users.push(user);
      return toDocument(user);
    }),
    findById: jest.fn((id) => {
      const user = users.find((item) => item._id === id) || null;
      return singleQuery(user);
    }),
    find: jest.fn(() => manyQuery(users)),
  };
});

const app = require("../app");
const { generateAccessToken } = require("../utils/jwt.js");

let token;
let userId;

beforeAll(async () => {
  const res = await request(app).post("/api/auth/login").send({
    email: "admin@mail.com",
    motDePasse: "123456",
  });

  token = res.body?.data?.accessToken;
});

describe("Auth guards", () => {
  it("POST /api/auth/login -> 403 si compte desactive", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "inactive@mail.com",
      motDePasse: "123456",
    });

    expect(res.statusCode).toBe(403);
  });

  it("GET /api/utilisateurs/profile -> 403 si token utilisateur desactive", async () => {
    const inactiveToken = generateAccessToken("u3", "MEMBRE");

    const res = await request(app)
      .get("/api/utilisateurs/profile")
      .set("Authorization", `Bearer ${inactiveToken}`);

    expect(res.statusCode).toBe(403);
  });
});

describe("Utilisateur routes", () => {
  it("GET /api/utilisateurs/profile", async () => {
    const res = await request(app)
      .get("/api/utilisateurs/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it("PUT /api/utilisateurs/profile/update", async () => {
    const res = await request(app)
      .put("/api/utilisateurs/profile/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nom: "Test Updated",
        email: "test.updated@mail.com",
      });

    expect(res.statusCode).toBe(200);
  });

  it("PUT /api/utilisateurs/profile/change-password", async () => {
    const res = await request(app)
      .put("/api/utilisateurs/profile/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ancienMotDePasse: "123456",
        nouveauMotDePasse: "12345678",
      });

    expect([200, 400]).toContain(res.statusCode);
  });

  it("GET /api/utilisateurs", async () => {
    const res = await request(app)
      .get("/api/utilisateurs")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    const liste = res.body?.data || res.body || [];
    const cible = liste.find((item) => item._id !== "u1");
    userId = cible?._id;
    expect(userId).toBeTruthy();
  });

  it("GET /api/utilisateurs/:id", async () => {
    const res = await request(app)
      .get(`/api/utilisateurs/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it("PUT /api/utilisateurs/:id", async () => {
    const res = await request(app)
      .put(`/api/utilisateurs/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        nom: "Admin Updated",
      });

    expect(res.statusCode).toBe(200);
  });

  it("PATCH /api/utilisateurs/:id/toggle", async () => {
    const res = await request(app)
      .patch(`/api/utilisateurs/${userId}/toggle`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it("DELETE /api/utilisateurs/:id", async () => {
    const res = await request(app)
      .delete(`/api/utilisateurs/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect([200, 404]).toContain(res.statusCode);
  });
});

