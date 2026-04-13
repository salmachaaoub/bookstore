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
      _id: "cat1",
      nom: "Informatique",
      isActive: true,
    },
    {
      _id: "cat2",
      nom: "Histoire",
      isActive: true,
    },
  ];

  let categories = [];

  const clone = (value) => JSON.parse(JSON.stringify(value));

  const reset = () => {
    categories = seed.map((item) => clone(item));
  };

  reset();

  return {
    __reset: reset,
    findById: jest.fn(async (id) => {
      const categorie = categories.find((item) => item._id === id) || null;
      return categorie ? clone(categorie) : null;
    }),
  };
});

jest.mock("../models/livre.js", () => {
  const categories = [
    { _id: "cat1", nom: "Informatique", isActive: true },
    { _id: "cat2", nom: "Histoire", isActive: true },
  ];

  const seed = [
    {
      _id: "l1",
      titre: "Clean Code",
      auteur: "Robert C. Martin",
      isbn: "ISBN-001",
      categorie: "cat1",
      quantite: 5,
      exemplairesDisponibles: 5,
      isActive: true,
    },
    {
      _id: "l2",
      titre: "Sapiens",
      auteur: "Yuval Noah Harari",
      isbn: "ISBN-002",
      categorie: "cat2",
      quantite: 5,
      exemplairesDisponibles: 2,
      isActive: true,
    },
  ];

  let livres = [];

  const clone = (value) => JSON.parse(JSON.stringify(value));

  const populateCategorie = (livre) => {
    if (!livre) return null;
    const cat = categories.find((item) => item._id === livre.categorie) || null;

    return {
      ...clone(livre),
      categorie: cat ? clone(cat) : livre.categorie,
    };
  };

  const toDocument = (livre) => {
    if (!livre) return null;

    return {
      ...clone(livre),
      save: async function save() {
        const index = livres.findIndex((item) => item._id === this._id);
        if (index === -1) return null;

        livres[index] = {
          ...livres[index],
          titre: this.titre,
          auteur: this.auteur,
          isbn: this.isbn,
          categorie: this.categorie,
          quantite: this.quantite,
          exemplairesDisponibles: this.exemplairesDisponibles,
          isActive: this.isActive,
        };

        return toDocument(livres[index]);
      },
      deleteOne: async function deleteOne() {
        const index = livres.findIndex((item) => item._id === this._id);
        if (index !== -1) {
          livres.splice(index, 1);
        }
      },
    };
  };

  const listFromQuery = (query) => {
    if (!query || Object.keys(query).length === 0) return livres;

    if (Array.isArray(query.$or)) {
      return livres.filter((item) =>
        query.$or.some((condition) => {
          if (condition.titre && condition.titre.$regex !== undefined) {
            const regex = new RegExp(
              condition.titre.$regex,
              condition.titre.$options || ""
            );
            return regex.test(item.titre);
          }

          if (condition.auteur && condition.auteur.$regex !== undefined) {
            const regex = new RegExp(
              condition.auteur.$regex,
              condition.auteur.$options || ""
            );
            return regex.test(item.auteur);
          }

          return false;
        })
      );
    }

    return livres;
  };

  const reset = () => {
    livres = seed.map((item) => clone(item));
  };

  reset();

  return {
    __reset: reset,
    findOne: jest.fn(async (filter) => {
      const livre = livres.find((item) => item.isbn === filter.isbn) || null;
      return toDocument(livre);
    }),
    create: jest.fn(async (data) => {
      const livre = {
        _id: `l${livres.length + 1}`,
        titre: data.titre,
        auteur: data.auteur,
        isbn: data.isbn,
        categorie: data.categorie,
        quantite: data.quantite,
        exemplairesDisponibles: data.exemplairesDisponibles,
        isActive: true,
      };

      livres.push(livre);
      return toDocument(livre);
    }),
    find: jest.fn((query) => ({
      populate: async () => listFromQuery(query).map((item) => populateCategorie(item)),
    })),
    findById: jest.fn((id) => {
      const livre = livres.find((item) => item._id === id) || null;
      const document = toDocument(livre);

      return {
        populate: async () => populateCategorie(document),
        then: (resolve, reject) =>
          Promise.resolve(document).then(resolve, reject),
        catch: (reject) => Promise.resolve(document).catch(reject),
      };
    }),
  };
});

const app = require("../app");
const Livre = require("../models/livre.js");
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
  Livre.__reset();
  Categorie.__reset();
  jest.clearAllMocks();
});

describe("Livre routes", () => {
  it("GET /api/livres/public -> 200 sans token", async () => {
    const res = await request(app).get("/api/livres/public");

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(2);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("GET /api/livres/public?search=clean -> 200 sans token", async () => {
    const res = await request(app).get("/api/livres/public?search=clean");

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].titre).toBe("Clean Code");
  });

  it("GET /api/livres -> 401 sans token", async () => {
    const res = await request(app).get("/api/livres");

    expect(res.statusCode).toBe(401);
  });

  it("GET /api/livres -> 200", async () => {
    const res = await request(app)
      .get("/api/livres")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(2);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("GET /api/livres?search=clean -> 200", async () => {
    const res = await request(app)
      .get("/api/livres?search=clean")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].titre).toBe("Clean Code");
  });

  it("POST /api/livres -> 403 pour un membre", async () => {
    const res = await request(app)
      .post("/api/livres")
      .set("Authorization", `Bearer ${membreToken}`)
      .send({
        titre: "Node.js Design Patterns",
        auteur: "Mario Casciaro",
        isbn: "ISBN-003",
        categorie: "cat1",
        quantite: 3,
      });

    expect(res.statusCode).toBe(403);
  });

  it("POST /api/livres -> 201", async () => {
    const res = await request(app)
      .post("/api/livres")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        titre: "Node.js Design Patterns",
        auteur: "Mario Casciaro",
        isbn: "ISBN-003",
        categorie: "cat1",
        quantite: 3,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.titre).toBe("Node.js Design Patterns");
    expect(res.body.data.exemplairesDisponibles).toBe(3);
  });

  it("POST /api/livres -> 400 si ISBN deja utilise", async () => {
    const res = await request(app)
      .post("/api/livres")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        titre: "Autre livre",
        auteur: "Auteur",
        isbn: "ISBN-001",
        categorie: "cat1",
        quantite: 2,
      });

    expect(res.statusCode).toBe(400);
  });

  it("POST /api/livres -> 404 si categorie introuvable", async () => {
    const res = await request(app)
      .post("/api/livres")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        titre: "Autre livre",
        auteur: "Auteur",
        isbn: "ISBN-999",
        categorie: "catX",
        quantite: 2,
      });

    expect(res.statusCode).toBe(404);
  });

  it("GET /api/livres/:id -> 200", async () => {
    const res = await request(app)
      .get("/api/livres/l1")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe("l1");
  });

  it("GET /api/livres/:id -> 404", async () => {
    const res = await request(app)
      .get("/api/livres/inconnu")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });

  it("PUT /api/livres/:id -> 200", async () => {
    const res = await request(app)
      .put("/api/livres/l1")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        titre: "Clean Code 2",
        quantite: 7,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.titre).toBe("Clean Code 2");
    expect(res.body.data.quantite).toBe(7);
    expect(res.body.data.exemplairesDisponibles).toBe(7);
  });

  it("PUT /api/livres/:id -> 400 si stock invalide", async () => {
    const res = await request(app)
      .put("/api/livres/l2")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        quantite: 1,
      });

    expect(res.statusCode).toBe(400);
  });

  it("PUT /api/livres/:id -> 404", async () => {
    const res = await request(app)
      .put("/api/livres/inconnu")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        titre: "Nouveau titre",
      });

    expect(res.statusCode).toBe(404);
  });

  it("PATCH /api/livres/:id/toggle -> 200", async () => {
    const res = await request(app)
      .patch("/api/livres/l1/toggle")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);

    const check = await request(app)
      .get("/api/livres/l1")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(check.statusCode).toBe(200);
    expect(check.body.isActive).toBe(false);
  });

  it("PATCH /api/livres/:id/toggle -> 404", async () => {
    const res = await request(app)
      .patch("/api/livres/inconnu/toggle")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });

  it("DELETE /api/livres/:id -> 200", async () => {
    const res = await request(app)
      .delete("/api/livres/l1")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);

    const check = await request(app)
      .get("/api/livres/l1")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(check.statusCode).toBe(404);
  });

  it("DELETE /api/livres/:id -> 404", async () => {
    const res = await request(app)
      .delete("/api/livres/inconnu")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });

  it("GET /api/livres -> 500 si erreur serveur", async () => {
    Livre.find.mockImplementationOnce(() => ({
      populate: async () => {
        throw new Error("DB error");
      },
    }));

    const res = await request(app)
      .get("/api/livres")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(500);
  });
});


