module.exports = {
    type: 'object',
    properties: {
        username: {
            type: 'string',
            transform: ["trim", "toLowerCase"],
            minLength: 3,
            maxLength: 30,
        },
        password: {
            type: 'string',
            minLength: 8,
            transform: ["trim"],
        },
    },
    required: [
        'username',
        'password'
    ],
    additionalProperties: false
}