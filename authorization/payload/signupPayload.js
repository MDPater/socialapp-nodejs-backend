module.exports = {
    type: "object",
    properties: {
        username: {
            type: "string",
            transform: ["trim", "toLowerCase"],
            minLength: 3,
            maxLength: 30,
        },
        email: {
            type: "string",
            transform: ["trim", "toLowerCase"],
            pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
        },
        password: {
            type: "string",
            minLength: 8,
            transform: ["trim"],
        },
    },
    required: [
        "username",
        "email",
        "password"
    ],
    additionalProperties: false
}