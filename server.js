// * -------- Import Section --------
import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import methodOverride from 'method-override'
import morgan from 'morgan'
import session from 'express-session'
import MongoStore from "connect-mongo"
import passUserToView from './middleware/passUserToView.js'
import isSignedIn from './middleware/isSignedIn.js'

// Routers
import authRouter from './controllers/auth.js'
import userRouter from './controllers/users.js'
import moviesRouter from './controllers/movies.js'

// * -------- Const Section --------
const app = express()
const port = process.env.PORT || 3000


// * -------- Middleware Section --------
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  })
}))
app.use(passUserToView)


// * -------- Routes Section --------

// Home route
app.get('/', (req, res) => {
  res.render('index.ejs')
})

// Router files
app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use ('/movies', moviesRouter)

// Error handling

app.use((req,res)=>{
    return res.render('errors/404.ejs')
})

app.use((err, req, res, next)=>{
    console.log(err)
    res.render('errors/error.ejs', err)
})


// * -------- Server Section --------
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`)
})