import express from 'express'
import path  from 'path'
import exphbs  from 'express-handlebars'
import Routes from './app/routes/routes.js'
import Data, { checkConnection } from './app/database/db.js'
import cors from 'cors'


const PORT = process.env.PORT || 3000

const app = express()
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.use(cors())
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')
app.use(Routes)
app.use(express.urlencoded({ extended: true }))
app.use(express.static('views/images')); 



app.listen(3000, async () => {
    console.log('Server has been started...')
    await checkConnection();
});