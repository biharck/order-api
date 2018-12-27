// import * as fs from 'fs'
// import * as https from 'https'
import app from './app'

const PORT = process.env.PORT || 3000

// const httpsOptions = {
//   key: fs.readFileSync('./config/key.pem'),
//   cert: fs.readFileSync('./config/cert.pem'),
// }
// https.createServer(httpsOptions, app).listen(PORT)

app.listen(PORT)
