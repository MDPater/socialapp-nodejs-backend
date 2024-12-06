module.exports = {
    type: 'object',
    properties: {
        username: {
            type: 'string'
        },
        email: {
            type: 'string',
            pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
        },
        password: {
            type: 'string'
        },
    },
    required: [
        'username',
        'email',
        'password'
    ],
    additionalProperties: false
}