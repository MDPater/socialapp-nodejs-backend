const express = require('express')
const app = express()
const port = 3000

app.get('/status', (req, res) => {
    const status = {
        "status": "running",
        "version": "1.0.0",
    }
    res.send(status)
})

app.listen(port, () => {
    console.log(`App listening on Port: ${port}`)
})