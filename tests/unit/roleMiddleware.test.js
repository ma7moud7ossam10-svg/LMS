const test = require("node:test");
const assert = require("node:assert/strict");
const requireRole = require("../../src/middleware/roleMiddleware");

test("role middleware allows an authorized role", () => {
    const middleware = requireRole("admin");
    let nextCalled = false;
    middleware(
        { user: { role: "admin" } },
        {},
        () => {
            nextCalled = true;
        }
    );
    assert.equal(nextCalled, true);
});

test("role middleware rejects an unauthorized role", () => {
    const middleware = requireRole("admin");
    let statusCode;
    let body;
    middleware(
        { user: { role: "student" } },
        {
            status(code) {
                statusCode = code;
                return this;
            },
            json(payload) {
                body = payload;
                return payload;
            }
        },
        () => {}
    );
    assert.equal(statusCode, 403);
    assert.equal(body.message, "Forbidden: insufficient role");
});
