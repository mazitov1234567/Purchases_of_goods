import express from 'express'
import path  from 'path'
import exphbs  from 'express-handlebars'
import Routes from './app/routes/routes.js'
import Data, { checkConnection } from './app/database/db.js'
import cors from 'cors'
import fs from 'fs-extra'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {mlog} from './app/logs.js'
let test = true
var appDir = path.dirname(import.meta.url);
appDir = appDir.split('///')
appDir = appDir[1]
console.log(appDir);

process.on('uncaughtException', (err) => {
    mlog('Глобальный косяк приложения!!! ', err.stack);
    }); 


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


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// app.use(express.static(path.join(__dirname, 'views/images')));
// app.use('/views/assets', express.static(path.join(__dirname, 'assets')));
// app.use(express.static(path.join(__dirname, 'views/public')));
// app.use('/views/public', express.static(path.join(__dirname, 'public')));
app.use(express.static('views/public'));

if (test){
    app.use(express.static(path.join(appDir, 'views/images')));
    app.set('views','views');
} else {
    app.use(express.static(path.join('//',appDir, 'views/images')));
    app.set('views',path.join('//',appDir, 'views'));
}

if (test){
    app.use(express.static(path.join(appDir, 'views/mains')));
    app.set('views','views');
} else {
    app.use(express.static(path.join('//',appDir, 'views/mains')));
    app.set('views',path.join('//',appDir, 'views'));
}


app.listen(3000, async () => {
    console.log('Server has been started...')
    await checkConnection();
});