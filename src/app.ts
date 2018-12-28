import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as expressWinston from 'express-winston'
import * as mongoose from 'mongoose'
import * as winston from 'winston'
import { APIRoute } from './routes/api'
import { OrderRoute } from './routes/order'
import { UserRoute } from './routes/user'
import * as errorHandler from './utility/errorHandler'
import { OrderAPILogger } from './utility/logger'

class App {
  public app: express.Application
  public userRoutes: UserRoute = new UserRoute()
  public apiRoutes: APIRoute = new APIRoute()
  public orderRoutes: OrderRoute = new OrderRoute()
  public mongoUrl: string = `mongodb://${process.env.MONGODB_URL_PORT ||
    'localhost:27017'}/${process.env.MONGODB_DATABASE}`
  public mongoUser: string = `${process.env.MONGODB_USER || ''}`
  public mongoPass: string = `${process.env.MONGODB_PASS || ''}`

  constructor() {
    this.app = express()
    this.app.use(bodyParser.json())
    this.userRoutes.routes(this.app)
    this.apiRoutes.routes(this.app)
    this.orderRoutes.routes(this.app)
    this.mongoSetup()
    this.app.use(
      expressWinston.errorLogger({
        transports: [new winston.transports.Console()],
      })
    )
    this.app.use(errorHandler.logging)
    this.app.use(errorHandler.clientErrorHandler)
    this.app.use(errorHandler.errorHandler)
  }

  private mongoSetup(): void {
    let options

    if (process.env.MONGODB_URL_PORT === 'localhost:27017') {
      options = {
        user: this.mongoUser,
        pass: this.mongoPass,
        useNewUrlParser: true,
      }
    } else {
      options = {
        useNewUrlParser: true,
      }
    }
    mongoose.connect(
      this.mongoUrl,
      options
    )
    OrderAPILogger.logger.info(`options = ${options.user}`)
    OrderAPILogger.logger.info(`options = ${options.pass}`)
    OrderAPILogger.logger.info(`url = ${this.mongoUrl}`)
  }
}

export default new App().app
