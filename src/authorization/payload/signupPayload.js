module.exports = {
    type: "object",
    properties: {
        username: {
            type: "string",
            minLength: 3,
            maxLength: 30,
            transform: ["trim", "toLowerCase"],
        },
        email: {
            type: "string",
            pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
            transform: ["trim", "toLowerCase"],
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