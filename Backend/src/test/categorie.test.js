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
  ];

  const clone = (value) => JSON.parse(JSON.stringify(value));

  const withoutPassword = (user) => {
    if (!user) return null;
    const safe = clone(user);
    delete safe.motDePasse;
    return safe;
  };

  return {
    findOne: jest.fn(async (filter) => {
      const user = users.find((item) => item.email === filter.email) || null;
      return user ? clone(user) : null;
    }),
    findById: jest.fn((id) => {
      const user = users.find((item) => item._id === id) || null;
      return {
        select: async () => withoutPassword(user),
      };
    }),
  };
});

jest.mock("../models/categorie.js", () => {
  const seed = [
    {
      _id: "c1",
      nom: "Roman",
      description: "Livres de fiction",
      isActive: true,
    },
    {
      _id: "c2",
      nom: "Science",
      description: "Livres scientifiques",
      isActive: true,
    },
  ];

  let categories = [];

  const clone = (value) => JSON.parse(JSON.stringify(value));

  const toDocument = (categorie) => {
    if (!categorie) return null;

    return {
      ...clone(categorie),
      save: async function save() {
        const index = categories.findIndex((item) => item._id === this._id);
        if (index === -1) return null;

        categories[index] = {
          ...categories[index],
          nom: this.nom,
          description: this.description,
          isActive: this.isActive,
        };

        return toDocument(categories[index]);
      },
      deleteOne: async function deleteOne() {
        const index = categories.findIndex((item) => item._id === this._id);
        if (index !== -1) {
          categories.splice(index, 1);
        }
      },
    };
  };

  const reset = () => {
    categories = seed.map((item) => clone(item));
  };

  reset();

  return {
    __reset: reset,
    findOne: jest.fn(async (filter) => {
      const categorie =
        categories.find((item) => item.nom === filter.nom) || null;
      return toDocument(categorie);
    }),
    create: jest.fn(async (data) => {
      const categorie = {
        _id: `c${categories.length + 1}`,
        nom: data.nom,
        description: data.description || "",
        isActive: true,
      };

      categories.push(categorie);
      return toDocument(categorie);
    }),
    find: jest.fn(async () => categories.map((item) => clone(item))),
    findById: jest.fn(async (id) => {
      const categorie = categories.find((item) => item._id === id) || null;
      return toDocument(categorie);
    }),
  };
});

const app = require("../app");
const Categorie = require("../models/categorie.js");

let adminToken;
let membreToken;

beforeAll(async () => {
  const adminRes = await request(app).post("/api/auth/login").send({
    email: "admin@mail.com",
    motDePasse: "123456",
  });

  adminToken = adminRes.body?.data?.accessToken;

  const membreRes = await request(app).post("/api/auth/login").send({
    email: "membre@mail.com",
    motDePasse: "123456",
  });

  membreToken = membreRes.body?.data?.accessToken;
});

beforeEach(() => {
  Categorie.__reset();
  jest.clearAllMocks();
});

describe("Categorie routes", () => {
  it("GET /api/categories -> 401 sans token", async () => {
    const res = await request(app).get("/api/categories");

    expect(res.statusCode).toBe(401);
  });

  it("GET /api/categories -> 200", async () => {
    const res = await request(app)
      .get("/api/categories")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(2);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("POST /api/categories -> 403 pour un membre", async () => {
    const res = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${membreToken}`)
      .send({
        nom: "Histoire",
        description: "Livres d'histoire",
      });

    expect(res.statusCode).toBe(403);
  });

  it("POST /api/categories -> 201", async () => {
    const res = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        nom: "Histoire",
        description: "Livres d'histoire",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.nom).toBe("Histoire");
  });

  it("POST /api/categories -> 400 si categorie deja existante", async () => {
    const res = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        nom: "Roman",
        description: "Doublon",
      });

    expect(res.statusCode).toBe(400);
  });

  it("GET /api/categories/:id -> 200", async () => {
    const res = await request(app)
      .get("/api/categories/c1")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe("c1");
  });

  it("GET /api/categories/:id -> 404", async () => {
    const res = await request(app)
      .get("/api/categories/inconnu")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });

  it("PUT /api/categories/:id -> 200", async () => {
    const res = await request(app)
      .put("/api/categories/c1")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        nom: "Roman moderne",
        description: "Livres de fiction moderne",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.nom).toBe("Roman moderne");
  });

  it("PUT /api/categories/:id -> 400 si nom deja utilise", async () => {
    const res = await request(app)
      .put("/api/categories/c1")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        nom: "Science",
      });

    expect(res.statusCode).toBe(400);
  });

  it("PUT /api/categories/:id -> 404", async () => {
    const res = await request(app)
      .put("/api/categories/inconnu")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        nom: "Nouvelle",
      });

    expect(res.statusCode).toBe(404);
  });

  it("PATCH /api/categories/:id/toggle -> 200", async () => {
    const res = await request(app)
      .patch("/api/categories/c1/toggle")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);

    const check = await request(app)
      .get("/api/categories/c1")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(check.statusCode).toBe(200);
    expect(check.body.isActive).toBe(false);
  });

  it("PATCH /api/categories/:id/toggle -> 404", async () => {
    const res = await request(app)
      .patch("/api/categories/inconnu/toggle")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });

  it("DELETE /api/categories/:id -> 200", async () => {
    const res = await request(app)
      .delete("/api/categories/c1")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);

    const check = await request(app)
      .get("/api/categories/c1")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(check.statusCode).toBe(404);
  });

  it("DELETE /api/categories/:id -> 404", async () => {
    const res = await request(app)
      .delete("/api/categories/inconnu")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });

  it("GET /api/categories -> 500 si erreur serveur", async () => {
    Categorie.find.mockRejectedValueOnce(new Error("DB error"));

    const res = await request(app)
      .get("/api/categories")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(500);
  });
});

