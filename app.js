const express = require('express')
require('dotenv').config()
require('express-async-errors')
const connectDb = require('./db/connectDb')
const Not_Found = require('./middleWares/not-found')
const handleErrorMiddleWare = require('./middleWares/handle_error')
const AuthRouter = require('./routes/auth')
const JobRouter = require('./routes/job')
const authenticateMiddleware = require('./middleWares/authentication')
const helmet = require('helmet')
const cors = require('cors')
const xssClean = require('xss-clean')
const rateLimiter = require('express-rate-limit')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swaggerDocs.yaml')

const app = express()

app.set('trust proxy', 1)
app.use(rateLimiter({
   windowMs: 15 * 60 * 1000,
   max: 100
}))
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xssClean())


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.get('/', (req, res) => {
   res.send('<h1>Jobs API</h1><a href="/api-docs">View Documentation</a>')
})
app.use('/api/v1/auth', AuthRouter)
app.use('/api/v1/jobs', authenticateMiddleware, JobRouter)
app.use(Not_Found)
app.use(handleErrorMiddleWare)


const port = process.env.PORT || 3000
const start = async () => {
   try {
      await connectDb(process.env.MONGO_URI)
      app.listen(port, () => console.log(`server is listening at port ${port}...`))
   } catch (error) {
      console.log(error);

   }
}

start()