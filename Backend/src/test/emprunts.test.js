const request = require("supertest");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret";
process.env.JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "test-jwt-refresh-secret";

jest.mock("../models/utilisateur.js", () => {
  const bcrypt = require("bcryptjs");

  const seed = [
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
      nom: "Biblio",
      email: "biblio@mail.com",
      motDePasse: bcrypt.hashSync("123456", 10),
      role: "BIBLIOTHECAIRE",
      isActive: true,
    },
  ];

  let users = [];

  const clone = (value) => JSON.parse(JSON.stringify(value));

  const reset = () => {
    users = seed.map((item) => clone(item));
  };

  reset();

  const withoutPassword = (user) => {
    if (!user) return null;
    const safe = clone(user);
    delete safe.motDePasse;
    return safe;
  };

  return {
    __reset: reset,
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

jest.mock("../models/livre.js", () => {
  const seed = [
    {
      _id: "l1",
      titre: "Clean Code",
      auteur: "Robert C. Martin",
      isbn: "ISBN-001",
      categorie: "cat1",
      quantite: 3,
      exemplairesDisponibles: 2,
      isActive: true,
    },
    {
      _id: "l2",
      titre: "Livre desactive",
      auteur: "Auteur",
      isbn: "ISBN-002",
      categorie: "cat1",
      quantite: 2,
      exemplairesDisponibles: 2,
      isActive: false,
    },
    {
      _id: "l3",
      titre: "Stock vide",
      auteur: "Auteur",
      isbn: "ISBN-003",
      categorie: "cat1",
      quantite: 1,
      exemplairesDisponibles: 0,
      isActive: true,
    },
  ];

  let livres = [];

  const clone = (value) => JSON.parse(JSON.stringify(value));

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

  const reset = () => {
    livres = seed.map((item) => clone(item));
  };

  reset();

  return {
    __reset: reset,
    findById: jest.fn(async (id) => {
      const livre = livres.find((item) => item._id === id) || null;
      return toDocument(livre);
    }),
  };
});

jest.mock("../models/emprunt.js", () => {
  const users = [
    { _id: "u1", nom: "Admin", email: "admin@mail.com", role: "ADMIN" },
    { _id: "u2", nom: "Membre", email: "membre@mail.com", role: "MEMBRE" },
    {
      _id: "u3",
      nom: "Biblio",
      email: "biblio@mail.com",
      role: "BIBLIOTHECAIRE",
    },
  ];

  const livres = [
    {
      _id: "l1",
      titre: "Clean Code",
      auteur: "Robert C. Martin",
      exemplairesDisponibles: 2,
      isActive: true,
    },
    {
      _id: "l2",
      titre: "Livre desactive",
      auteur: "Auteur",
      exemplairesDisponibles: 2,
      isActive: false,
    },
    {
      _id: "l3",
      titre: "Stock vide",
      auteur: "Auteur",
      exemplairesDisponibles: 0,
      isActive: true,
    },
  ];

  const seed = [
    {
      _id: "e1",
      utilisateur: "u2",
      livre: "l1",
      dateEmprunt: "2026-03-01T00:00:00.000Z",
      dateRetourPrevue: "2026-03-20T00:00:00.000Z",
      dateRetourReelle: null,
      statut: "EN_COURS",
    },
    {
      _id: "e2",
      utilisateur: "u2",
      livre: "l1",
      dateEmprunt: "2026-02-01T00:00:00.000Z",
      dateRetourPrevue: "2026-02-20T00:00:00.000Z",
      dateRetourReelle: "2026-02-15T00:00:00.000Z",
      statut: "RETOURNE",
    },
  ];

  let emprunts = [];

  const clone = (value) => JSON.parse(JSON.stringify(value));

  const findLivre = (id) => livres.find((item) => item._id === id) || null;
  const findUser = (id) => users.find((item) => item._id === id) || null;

  const applyPopulate = (record, fields) => {
    if (!record) return null;

    const out = clone(record);

    if (fields.includes("livre")) {
      out.livre = findLivre(record.livre) ? clone(findLivre(record.livre)) : null;
    }

    if (fields.includes("utilisateur")) {
      out.utilisateur = findUser(record.utilisateur)
        ? clone(findUser(record.utilisateur))
        : null;
    }

    return out;
  };

  const toDocument = (emprunt) => {
    if (!emprunt) return null;

    return {
      ...clone(emprunt),
      save: async function save() {
        const index = emprunts.findIndex((item) => item._id === this._id);
        if (index === -1) return null;

        emprunts[index] = {
          ...emprunts[index],
          utilisateur: this.utilisateur,
          livre: this.livre,
          dateEmprunt: this.dateEmprunt,
          dateRetourPrevue: this.dateRetourPrevue,
          dateRetourReelle: this.dateRetourReelle,
          statut: this.statut,
        };

        return toDocument(emprunts[index]);
      },
      deleteOne: async function deleteOne() {
        const index = emprunts.findIndex((item) => item._id === this._id);
        if (index !== -1) {
          emprunts.splice(index, 1);
        }
      },
    };
  };

  const makeQuery = (getData) => {
    const fields = [];

    const query = {
      populate(field) {
        fields.push(field);
        return query;
      },
      then(resolve, reject) {
        const value = getData(fields);
        return Promise.resolve(value).then(resolve, reject);
      },
      catch(reject) {
        const value = getData(fields);
        return Promise.resolve(value).catch(reject);
      },
    };

    return query;
  };

  const reset = () => {
    emprunts = seed.map((item) => clone(item));
  };

  reset();

  return {
    __reset: reset,
    create: jest.fn(async (data) => {
      const emprunt = {
        _id: `e${emprunts.length + 1}`,
        utilisateur: data.utilisateur,
        livre: data.livre,
        dateEmprunt: new Date().toISOString(),
        dateRetourPrevue: data.dateRetourPrevue,
        dateRetourReelle: null,
        statut: "EN_COURS",
      };

      emprunts.push(emprunt);
      return toDocument(emprunt);
    }),
    find: jest.fn((filter = {}) =>
      makeQuery((fields) => {
        let list = emprunts;

        if (filter.utilisateur) {
          list = list.filter((item) => item.utilisateur === filter.utilisateur);
        }

        return list.map((item) => applyPopulate(item, fields));
      })
    ),
    findById: jest.fn((id) =>
      makeQuery((fields) => {
        const emprunt = emprunts.find((item) => item._id === id) || null;

        if (!emprunt) return null;

        if (fields.length === 0) {
          return toDocument(emprunt);
        }

        return applyPopulate(emprunt, fields);
      })
    ),
  };
});

const app = require("../app");
const Emprunt = require("../models/emprunt.js");
const Livre = require("../models/livre.js");
const Utilisateur = require("../models/utilisateur.js");

let adminToken;
let membreToken;
let biblioToken;

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

  const biblioRes = await request(app).post("/api/auth/login").send({
    email: "biblio@mail.com",
    motDePasse: "123456",
  });
  biblioToken = biblioRes.body?.data?.accessToken;
});

beforeEach(() => {
  Emprunt.__reset();
  Livre.__reset();
  Utilisateur.__reset();
  jest.clearAllMocks();
});

describe("Emprunt routes", () => {
  it("POST /api/emprunts -> 401 sans token", async () => {
    const res = await request(app).post("/api/emprunts").send({
      livreId: "l1",
      dateRetourPrevue: "2026-04-01T00:00:00.000Z",
    });

    expect(res.statusCode).toBe(401);
  });

  it("POST /api/emprunts -> 201", async () => {
    const res = await request(app)
      .post("/api/emprunts")
      .set("Authorization", `Bearer ${membreToken}`)
      .send({
        livreId: "l1",
        dateRetourPrevue: "2026-04-01T00:00:00.000Z",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.utilisateur).toBe("u2");
    expect(res.body.data.livre).toBe("l1");
  });

  it("POST /api/emprunts -> 400 si dateRetourPrevue absente", async () => {
    const res = await request(app)
      .post("/api/emprunts")
      .set("Authorization", `Bearer ${membreToken}`)
      .send({
        livreId: "l1",
      });

    expect(res.statusCode).toBe(400);
  });

  it("POST /api/emprunts -> 404 si livre introuvable", async () => {
    const res = await request(app)
      .post("/api/emprunts")
      .set("Authorization", `Bearer ${membreToken}`)
      .send({
        livreId: "inconnu",
        dateRetourPrevue: "2026-04-01T00:00:00.000Z",
      });

    expect(res.statusCode).toBe(404);
  });

  it("POST /api/emprunts -> 400 si livre desactive", async () => {
    const res = await request(app)
      .post("/api/emprunts")
      .set("Authorization", `Bearer ${membreToken}`)
      .send({
        livreId: "l2",
        dateRetourPrevue: "2026-04-01T00:00:00.000Z",
      });

    expect(res.statusCode).toBe(400);
  });

  it("POST /api/emprunts -> 400 si aucun exemplaire", async () => {
    const res = await request(app)
      .post("/api/emprunts")
      .set("Authorization", `Bearer ${membreToken}`)
      .send({
        livreId: "l3",
        dateRetourPrevue: "2026-04-01T00:00:00.000Z",
      });

    expect(res.statusCode).toBe(400);
  });

  it("GET /api/emprunts/me -> 200", async () => {
    const res = await request(app)
      .get("/api/emprunts/me")
      .set("Authorization", `Bearer ${membreToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(2);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("GET /api/emprunts -> 200 (admin)", async () => {
    const res = await request(app)
      .get("/api/emprunts")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(2);
  });

  it("GET /api/emprunts -> 200 (bibliothecaire)", async () => {
    const res = await request(app)
      .get("/api/emprunts")
      .set("Authorization", `Bearer ${biblioToken}`);

    expect(res.statusCode).toBe(200);
  });

  it("GET /api/emprunts -> 403 (membre)", async () => {
    const res = await request(app)
      .get("/api/emprunts")
      .set("Authorization", `Bearer ${membreToken}`);

    expect(res.statusCode).toBe(403);
  });

  it("GET /api/emprunts/:id -> 200", async () => {
    const res = await request(app)
      .get("/api/emprunts/e1")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe("e1");
  });

  it("GET /api/emprunts/:id -> 404", async () => {
    const res = await request(app)
      .get("/api/emprunts/inconnu")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });

  it("PATCH /api/emprunts/:id/retour -> 200", async () => {
    const res = await request(app)
      .patch("/api/emprunts/e1/retour")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.statut).toBe("RETOURNE");
    expect(res.body.data.dateRetourReelle).toBeTruthy();
  });

  it("PATCH /api/emprunts/:id/retour -> 400 deja retourne", async () => {
    const res = await request(app)
      .patch("/api/emprunts/e2/retour")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(400);
  });

  it("PATCH /api/emprunts/:id/retour -> 404 emprunt introuvable", async () => {
    const res = await request(app)
      .patch("/api/emprunts/inconnu/retour")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });

  it("PATCH /api/emprunts/:id/retour -> 404 livre introuvable", async () => {
    Emprunt.findById.mockImplementationOnce((id) => {
      const query = {
        populate() {
          return query;
        },
        then(resolve, reject) {
          return Promise.resolve({
            _id: id,
            utilisateur: "u2",
            livre: "livre-inconnu",
            statut: "EN_COURS",
            save: async () => ({}),
          }).then(resolve, reject);
        },
        catch(reject) {
          return Promise.resolve({
            _id: id,
            utilisateur: "u2",
            livre: "livre-inconnu",
            statut: "EN_COURS",
            save: async () => ({}),
          }).catch(reject);
        },
      };

      return query;
    });

    const res = await request(app)
      .patch("/api/emprunts/e404livre/retour")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });

  it("PATCH /api/emprunts/:id/retour -> 403 membre", async () => {
    const res = await request(app)
      .patch("/api/emprunts/e1/retour")
      .set("Authorization", `Bearer ${membreToken}`);

    expect(res.statusCode).toBe(403);
  });

  it("GET /api/emprunts/me -> 500", async () => {
    Emprunt.find.mockImplementationOnce(() => {
      const query = {
        populate() {
          return query;
        },
        then(resolve, reject) {
          return Promise.reject(new Error("DB error")).then(resolve, reject);
        },
        catch(reject) {
          return Promise.reject(new Error("DB error")).catch(reject);
        },
      };

      return query;
    });

    const res = await request(app)
      .get("/api/emprunts/me")
      .set("Authorization", `Bearer ${membreToken}`);

    expect(res.statusCode).toBe(500);
  });

  it("GET /api/emprunts -> 500", async () => {
    Emprunt.find.mockImplementationOnce(() => {
      const query = {
        populate() {
          return query;
        },
        then(resolve, reject) {
          return Promise.reject(new Error("DB error")).then(resolve, reject);
        },
        catch(reject) {
          return Promise.reject(new Error("DB error")).catch(reject);
        },
      };

      return query;
    });

    const res = await request(app)
      .get("/api/emprunts")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(500);
  });

  it("GET /api/emprunts/:id -> 500", async () => {
    Emprunt.findById.mockImplementationOnce(() => {
      const query = {
        populate() {
          return query;
        },
        then(resolve, reject) {
          return Promise.reject(new Error("DB error")).then(resolve, reject);
        },
        catch(reject) {
          return Promise.reject(new Error("DB error")).catch(reject);
        },
      };

      return query;
    });

    const res = await request(app)
      .get("/api/emprunts/e1")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(500);
  });

  it("POST /api/emprunts -> 500", async () => {
    Livre.findById.mockRejectedValueOnce(new Error("DB error"));

    const res = await request(app)
      .post("/api/emprunts")
      .set("Authorization", `Bearer ${membreToken}`)
      .send({
        livreId: "l1",
        dateRetourPrevue: "2026-04-01T00:00:00.000Z",
      });

    expect(res.statusCode).toBe(500);
  });

  it("PATCH /api/emprunts/:id/retour -> 500", async () => {
    Emprunt.findById.mockRejectedValueOnce(new Error("DB error"));

    const res = await request(app)
      .patch("/api/emprunts/e1/retour")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(500);
  });
});

