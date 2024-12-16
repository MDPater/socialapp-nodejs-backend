module.exports = {
    type: 'object',
    properties: {
        username: {
            type: 'string',
            transform: ["trim", "toLowerCase"],
        },
        password: {
            type: 'string',
            transform: ["trim"],
        },
    },
    required: [
        'username',
        'password'
    ],
    additionalProperties: false
}