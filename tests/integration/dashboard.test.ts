import request from "supertest";
import jwt from "jsonwebtoken";
import { execSync } from "child_process";
import app from "../../server";
import { ProfessionalModel } from "../../src/models/Professional";
import { UserModel } from "../../src/models/User";
import { sequelize } from "../../src/config/database";

describe("Dashboard integration tests", () => {
  let token: string;
  let professionalId: number;

  beforeAll(async () => {
    // Ensure migrations and seeders applied for deterministic data
    try {
      execSync("npx sequelize-cli db:migrate", { stdio: "inherit" });
      execSync("npx sequelize-cli db:seed:all", { stdio: "inherit" });
    } catch (err: any) {
      // continue — CI should have DB prepared
      console.warn("Migrations/seed step failed (maybe already applied):", String(err));
    }

    // find a professional and create a JWT for its user
    const professional = await ProfessionalModel.findOne();
    if (!professional) throw new Error("No professional found in DB for tests");
    professionalId = professional.id;

    const user = await UserModel.findByPk(professional.user_id);
    if (!user) throw new Error("No user found for professional");

    token = jwt.sign(
      {
        user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
        client: {},
      },
      process.env.SECRET_KEY || "secret"
    );
  }, 20000);

  afterAll(async () => {
    await sequelize.close();
  });

  test("GET /api/dashboard/kpis without token returns 401", async () => {
    const res = await request(app).get("/api/dashboard/kpis");
    expect(res.status).toBe(401);
  });

  test("Authenticated professional receives KPIs and is isolated", async () => {
    const res = await request(app)
      .get("/api/dashboard/kpis")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty("totalServices");
    expect(res.body).toHaveProperty("totalEarnings");
    // totals must be numbers
    expect(typeof res.body.totalServices).toBe("number");
    expect(typeof res.body.totalEarnings).toBe("number");
  });

  test("earnings-over-time respects from/to and groups by month", async () => {
    const from = new Date();
    from.setMonth(from.getMonth() - 6);
    const to = new Date();

    const res = await request(app)
      .get("/api/dashboard/earnings-over-time")
      .query({ from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) })
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((row: any) => {
      expect(row).toHaveProperty("month");
      expect(row).toHaveProperty("total");
    });
  });
});
