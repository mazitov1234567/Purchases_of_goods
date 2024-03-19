import express from 'express'
import session from 'express-session'
import pool from '../database/db.js' 

const app = express()

app.set('view engine', 'hbs');

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}))

app.get('/', (req, res) => {
  res.render('index', {
    user: req.session.user,
  });
});

app.get('/log', (req, res) => {
  res.render('log', {
    title: 'login',
  })
});

app.get('/reg', (req, res) => {
  res.render('reg', {
    title: 'registration',
  })
});

app.use(express.urlencoded({ extended: true }))

app.post('/log', async (req, res) => {
    const { email, password } = req.body;
  
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      const user = rows[0];
  
      if (password === user.password) {
        req.session.user = user;
        res.redirect('/');
      } else {
        res.send('Неверный пароль');
      }
    } else {
      res.send('Пользователь с таким email не найден');
    }
  });
  
  app.get('/admin', (req, res) => {
    if (req.session.user && req.session.user.admin) {
      res.render('admin', {
        title: 'Admin Panel',
        user: req.session.user,
      });
    } else {
      res.redirect('/log');
    }
  });

  app.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.redirect('/');
      }
  
      res.clearCookie('sid');
      res.redirect('/log');
    });
  });
  



export default app;