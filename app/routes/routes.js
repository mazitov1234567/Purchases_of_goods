import express from 'express'
import session from 'express-session'
import pool from '../database/db.js'
import moment from 'moment';
import Handlebars from 'handlebars';
import {get_order_history, get_email, insert_user, get_incomplete_orders, get_completed_orders, get_orders_by_status, update_order_status, update_order_status_with_date, get_user_orders,submit_order} from '../database/db.js'
import {mlog} from '../logs.js'

import fs from 'fs-extra'
import path  from 'path'
//import { myFunction } from '../database/db-function.js';




const app = express()

app.use(session({
  secret: 'your-unique-and-hard-to-guess-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}))

function getcurip(str) {
  let arr = str.split(':');
  arr = arr[arr.length-1];
  return arr;
}

app.use(async function (req, res, next) {
  let page =  req._parsedOriginalUrl.pathname;

  if (page=='/data' || page=='/kabstart' || page=='/upload' || page=='/addmat' || page=='/stream' || page=='/info') {
      next();
      return 1
  }
  if (req.session.userId==undefined) {
      if (page!='/log') {
          res.redirect("/log")
      } else next();
  } else {
      if (page=='/log') {
          res.redirect("/")
      } else next();
  }

  mlog(page,req.session,getcurip(req.socket.remoteAddress),req.query)
  
})




app.set('view engine', 'hbs');



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

  const rows = await get_email(email);
  if (rows.length > 0) {
    const user = rows[0];

    if (password == user.password) {
      req.session.userId = user.id; 
      req.session.user = user; 
      res.redirect('/');
    } else {
      res.send('Неверный пароль');
    }
  } else {
    res.send('Пользователь с таким email не найден');
  }
});

app.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  const rows = await get_email( email);
  if (rows.length > 0) {
    res.send('Пользователь с таким email уже существует');
  } else {
    await insert_user( username, email, password);
    res.redirect('/log');
  }
});



  app.get('/index-admin', (req, res) => {
    if (req.session.user.admin) {
      res.render('index-admin', {
        title: 'Admin Panel',
        user: req.session.user,
      });
    } else {
      res.redirect('/log');
    }
  });



  app.get('/adminOrders', async (req, res) => {
    if(req.session.user.admin) {
      const orders = await get_incomplete_orders();
  
      res.render('adminOrders', { title: 'Admin Orders', user: req.session.user, orders });
    } else {
      res.redirect('/log');
    }
  });

  app.get('/adminOrdersCompleted', async (req, res) => {
    if(req.session.user.admin) {
      const orders = await get_completed_orders(pool);
  
      res.render('adminOrdersCompleted', { title: 'Admin Orders', user: req.session.user, orders });
    } else {
      res.status(403).send('Доступ запрещен');
    }
  });



  app.post('/orders/new', async (req, res) => {
    if(req.session.user.admin) {
      const orders = await get_orders_by_status(pool, 'На рассмотрении');
  
      res.render('adminOrders', { user: req.session.user, orders });
    } else {
      res.status(403).send('Доступ запрещен');
    }
  });
  
  app.post('/orders/processing', async (req, res) => {
    if(req.session.user.admin) {
      const orders = await get_orders_by_status(pool, 'Закупаем');
  
      res.render('adminOrders', { user: req.session.user, orders });
    } else {
      res.status(403).send('Доступ запрещен');
    }
  });
  
  app.post('/orders/completed', async (req, res) => {
    if(req.session.user.admin) {
      const orders = await get_orders_by_status(pool, 'Ждем');
  
      res.render('adminOrders', { user: req.session.user, orders });
    } else {
      res.status(403).send('Доступ запрещен');
    }
  });
  

app.post('/orders/canceled', async (req, res) => {
  if(req.session.user.admin) {
    const orders = await get_orders_by_status(pool, 'Забрать');
 
    res.render('adminOrders', {user: req.session.user, orders });
  } else {
    res.status(403).send('Доступ запрещен');
  }
});

app.post('/orders/completed-order', async (req, res) => {
  if(req.session.user.admin) {
    const orders = await get_orders_by_status(pool, 'Завершено');
    res.render('adminOrders', {user: req.session.user, orders: rows });
  } else {
    res.status(403).send('Доступ запрещен');
  }
});


app.post('/updateOrderStatus', async (req, res) => {
  if(req.session.user.admin) {
    const { OrderID, newStatus } = req.body;

    if (newStatus === 'Забрать') {
      const StatusChangeDate = new Date(); // Получите текущую дату и время

      await update_order_status_with_date(pool, newStatus, StatusChangeDate, OrderID);
    } else {
      await update_order_status(pool, newStatus, OrderID);
    }

    res.redirect('/adminOrders');
  } else {
    res.status(403).send('Доступ запрещен');
  }
});




  app.get('/order-user', (req, res) => {
    if(req.session.user) {
      res.render('order-user', {
        title: 'orders',
        user: req.session.user,
      });
    } else {
      res.redirect('/log'); 
    }
  });

  Handlebars.registerHelper('isOverThreeDays', function(status, StatusChangeDate) {
    console.log('Status:', status);
    console.log('Status Change Date:', StatusChangeDate);
  
    if (status === 'Забрать') {
      const changeDate = new Date(StatusChangeDate);
      const now = new Date();
      const differenceInDays = Math.ceil((now - changeDate) / (1000 * 60 * 60 * 24));
  
      console.log('Difference in Days:', differenceInDays);
  
      return differenceInDays > 3;
    }
    return false;
  });
  
  
  
  

  Handlebars.registerHelper('dateFormat', function(value) {
        return moment(value).format('DD/MM');
  });

  Handlebars.registerHelper('OrderDateAndEndDate', function(value) {
    return moment(value).format('DD/MM/YY');
});

  Handlebars.registerHelper('eq', function(a, b) {
    return a === b;
  });

  app.get('/myOrder', async (req, res) => {
    if(req.session.user) {
      const userId = req.session.user.id;
    
      const orders = await get_user_orders(pool, userId);
    
      res.render('myOrder', { title: 'orders', user: req.session.user, orders });
    } else {
      res.redirect('/log');
    }
  });
  

  app.post('/completeOrder', async (req, res) => {
    if(req.session.user) {
      const orderId = req.body.orderId;
      const endDate = new Date(); // Получите текущую дату и время
    
      await complete_order(pool, endDate, orderId);
    
      res.redirect('/myOrder');
    } else {
      res.redirect('/log');
    }
  });
  

  app.get('/order-history', async (req, res) => {
    if(req.session.user) {
      const userId = req.session.user.id;
      
      const orders = await get_order_history(userId);
  
      res.render('order-history', { title: 'orders', user: req.session.user, orders });
      return orders;
    } else {
      res.redirect('/log');
    }
  });



  app.post('/submit-order', async (req, res) => {
    const order = req.body;
    const userId = req.session.userId;
    const author = req.session.user.username; // Используйте имя пользователя из сессии
    const orderDate = new Date(); // Получите текущую дату и время
  
    if (userId) {
      await submit_order(pool, order, userId, author, orderDate);
      res.redirect('/myOrder');
      
    } else {
      res.status(400).send('Ошибка: userId не определен');
    }
  });
  
  
  
  


  app.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.redirect('/');
      }
    
      res.clearCookie('connect.sid'); 
      res.redirect('/log');
    });
  });

  app.get('/start', (req, res) => {
    if(req.session.user) {
      res.render('order-user', {
        title: 'Order',
        user: req.session.user,
      });
    } else {
      res.redirect('/log'); 
    }
  });
  
export default app;