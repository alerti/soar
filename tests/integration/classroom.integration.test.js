const request = require("supertest");
const { expect } = require("chai");
const app = require("../../app");
const classroomModel = require("../../managers/entities/classroom/classroom.model");
const schoolModel = require("../../managers/entities/school/school.model");
const userModel = require("../../managers/entities/user/user.model");

describe("Classroom Entity Integration Tests", function () {
  this.timeout(10000); // Extend the timeout for async operations

  let superadminId;
  let superadminToken;
  let schooladminId;
  let schooladminToken;
  let schoolId;
  let classroomId;

  before(async () => {
    // Clear all collections before starting tests
    await Promise.all([
      userModel.deleteMany({}),
      schoolModel.deleteMany({}),
      classroomModel.deleteMany({}),
    ]);

    // Create a superadmin user and authenticate
    const superadmin = {
      username: "Super Admin",
      email: "superadmin@soartest.com",
      password: "password123",
      role: "superadmin",
    };
    const superadminRes = await request(app)
      .post("/api/users/register")
      .send(superadmin);
    superadminId = superadminRes.body.user._id;

    const superadminAuth = await request(app).post("/api/users/login").send({
      email: superadmin.email,
      password: superadmin.password,
    });
    superadminToken = superadminAuth.body.token;

    // Create a schooladmin user and authenticate
    const schooladmin = {
      username: "School Admin",
      email: "schooladmin@soartest.com",
      password: "password123",
      role: "schooladmin",
    };
    const schooladminRes = await request(app)
      .post("/api/users/register")
      .send(schooladmin);
    schooladminId = schooladminRes.body.user._id;

    const schooladminAuth = await request(app).post("/api/users/login").send({
      email: schooladmin.email,
      password: schooladmin.password,
    });
    schooladminToken = schooladminAuth.body.token;

    // Create a school using the superadmin token
    const school = {
      name: "Test School",
      address: "123 Test St",
      phone: "123-456-7890",
      email: "testschool@soartest.com",
      website: "http://testschool.com",
      established: "2000-01-01",
      admin: superadminId,
    };
    const schoolRes = await request(app)
      .post("/api/schools")
      .set("Authorization", `Bearer ${superadminToken}`)
      .send(school);
    schoolId = schoolRes.body._id;
  });

  after(async () => {
    // Clear all collections after tests
    await Promise.all([
      userModel.deleteMany({}),
      schoolModel.deleteMany({}),
      classroomModel.deleteMany({}),
    ]);
  });

  it("should not allow schooladmin to create a classroom without a school", async () => {
    const classroom = {
      name: "Test Classroom",
      capacity: 30,
      resources: ["Projector", "Whiteboard"],
    };

    const res = await request(app)
      .post("/api/classrooms")
      .set("Authorization", `Bearer ${schooladminToken}`)
      .send(classroom);

    expect(res.status).to.equal(400);
  });

  it("should update schooladmin user to associate with a school", async () => {
    const update = { school: schoolId };

    const res = await request(app)
      .put(`/api/users/${schooladminId}`)
      .set("Authorization", `Bearer ${superadminToken}`)
      .send(update);

    expect(res.status).to.equal(200);
    expect(res.body.school).to.equal(schoolId);
  });

  it("should allow schooladmin to create a new classroom", async () => {
    const classroom = {
      name: "Test Classroom",
      school: schoolId,
      capacity: 30,
      resources: ["Projector", "Whiteboard"],
    };

    const res = await request(app)
      .post("/api/classrooms")
      .set("Authorization", `Bearer ${schooladminToken}`)
      .send(classroom);

    classroomId = res.body._id;
    expect(res.status).to.equal(201);
    expect(res.body.name).to.equal(classroom.name);
  });

  it("should update a classroom capacity", async () => {
    const update = { capacity: 35 };

    const res = await request(app)
      .put(`/api/classrooms/${classroomId}`)
      .set("Authorization", `Bearer ${schooladminToken}`)
      .send(update);

    expect(res.status).to.equal(200);
    expect(res.body.capacity).to.equal(update.capacity);
  });

  it("should retrieve a classroom by ID", async () => {
    const res = await request(app)
      .get(`/api/classrooms/${classroomId}`)
      .set("Authorization", `Bearer ${schooladminToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.name).to.equal("Test Classroom");
    expect(res.body.capacity).to.equal(35);
  });

  it("should delete a classroom", async () => {
    const res = await request(app)
      .delete(`/api/classrooms/${classroomId}`)
      .set("Authorization", `Bearer ${schooladminToken}`);

    expect(res.status).to.equal(204);
  });

  it("should fail to retrieve a deleted classroom", async () => {
    const res = await request(app)
      .get(`/api/classrooms/${classroomId}`)
      .set("Authorization", `Bearer ${schooladminToken}`);

    expect(res.status).to.equal(404);
  });

  it("should retrieve all classrooms for a schooladmin", async () => {
    const classroom1 = {
      name: "Classroom A",
      school: schoolId,
      capacity: 20,
      resources: ["Desks"],
    };
    const classroom2 = {
      name: "Classroom B",
      school: schoolId,
      capacity: 40,
      resources: ["Computers"],
    };

    await Promise.all([
      request(app)
        .post("/api/classrooms")
        .set("Authorization", `Bearer ${schooladminToken}`)
        .send(classroom1),
      request(app)
        .post("/api/classrooms")
        .set("Authorization", `Bearer ${schooladminToken}`)
        .send(classroom2),
    ]);

    const res = await request(app)
      .get("/api/classrooms")
      .set("Authorization", `Bearer ${schooladminToken}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.be.at.least(2);
  });
});
