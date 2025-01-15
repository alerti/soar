const request = require("supertest");
const { expect } = require("chai");
const app = require("../../app");
const schoolModel = require("../../managers/entities/school/school.model");
const userModel = require("../../managers/entities/user/user.model");

describe("School Entity Integration Tests", function () {
  this.timeout(10000); // Increase timeout to handle longer async operations

  let superadminId;
  let superadminToken;
  let schoolId;

  before(async () => {
    console.time("Setup Time");

    try {
      // Clear collections
      await Promise.all([userModel.deleteMany({}), schoolModel.deleteMany({})]);

      // Create and authenticate superadmin
      const superadmin = {
        username: "Super Admin",
        email: "superadmin@soartest.com",
        password: "password123",
        role: "superadmin",
      };

      const res = await request(app)
        .post("/api/users/register")
        .send(superadmin);

      superadminId = res.body.user._id;

      const authRes = await request(app)
        .post("/api/users/login")
        .send({ email: superadmin.email, password: superadmin.password });

      superadminToken = authRes.body.token;

      // Create schools
      const schools = [
        {
          name: "Test School A",
          address: "123 Main St",
          phone: "123-456-7890",
          email: "schoolA@soartest.com",
          website: "http://schoolA.com",
          established: "2000-01-01",
          admin: superadminId,
        },
        {
          name: "Test School B",
          address: "456 Elm St",
          phone: "987-654-3210",
          email: "schoolB@soartest.com",
          website: "http://schoolB.com",
          established: "2005-01-01",
          admin: superadminId,
        },
      ];

      for (const school of schools) {
        const schoolRes = await request(app)
          .post("/api/schools")
          .set("Authorization", `Bearer ${superadminToken}`)
          .send(school);
        schoolId = schoolRes.body._id; // Keep the last created school ID
      }
    } catch (error) {
      console.error("Error during setup:", error);
    } finally {
      console.timeEnd("Setup Time");
    }
  });

  after(async () => {
    console.time("Teardown Time");

    try {
      // Clear collections
      await Promise.all([userModel.deleteMany({}), schoolModel.deleteMany({})]);
    } catch (error) {
      console.error("Error during teardown:", error);
    } finally {
      console.timeEnd("Teardown Time");
    }
  });

  it("should get all schools", async () => {
    const res = await request(app)
      .get("/api/schools")
      .set("Authorization", `Bearer ${superadminToken}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.be.at.least(2); // At least 2 schools should be returned

    const schoolNames = res.body.map((school) => school.name);
    expect(schoolNames).to.include("Test School A");
    expect(schoolNames).to.include("Test School B");
  });

  it("should get a school by ID", async () => {
    const res = await request(app)
      .get(`/api/schools/${schoolId}`)
      .set("Authorization", `Bearer ${superadminToken}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("_id", schoolId);
    expect(res.body).to.have.property("name");
    expect(res.body).to.have.property("address");
  });

  it("should update a school", async () => {
    const updatedSchool = {
      name: "Updated Test School",
      address: "789 Updated St",
      phone: "555-555-5555",
      email: "updatedschool@soartest.com",
      website: "http://updatedschool.com",
      established: "2010-01-01",
    };

    const res = await request(app)
      .put(`/api/schools/${schoolId}`)
      .set("Authorization", `Bearer ${superadminToken}`)
      .send(updatedSchool);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("name", updatedSchool.name);
    expect(res.body).to.have.property("address", updatedSchool.address);
  });

  it("should delete a school", async () => {
    const res = await request(app)
      .delete(`/api/schools/${schoolId}`)
      .set("Authorization", `Bearer ${superadminToken}`);

    expect(res.status).to.equal(204);

    const getRes = await request(app)
      .get(`/api/schools/${schoolId}`)
      .set("Authorization", `Bearer ${superadminToken}`);

    expect(getRes.status).to.equal(404);
  });
});
