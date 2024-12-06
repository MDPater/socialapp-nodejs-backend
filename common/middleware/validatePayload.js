const Ajv = require('ajv').default,
    AJV_OPTS = {allErrors: true};

module.exports = {
    //verify if sent data matches payload example
    verify: (payload) => {
        if(!payload){
            throw new Error('Payload not provided');
        }

        return (req, res, next) => {
            const { body } = req;
            const ajv = new Ajv(AJV_OPTS);
            const validate = ajv.compile(payload);
            const isValid = validate(body);

            if(isValid) {
                return next();
            }

            return res.send({
                status: false,
                error: {
                    message: 'invalid Payload'
                }
            });
        }
    }
}