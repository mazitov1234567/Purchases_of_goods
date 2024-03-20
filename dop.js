function filterOrders(status) {
    var orders = document.getElementsByClassName('order');
    for (var i = 0; i < orders.length; i++) {
      if (status === '' || orders[i].getAttribute('data-status') === status) {
        orders[i].style.display = '';
      } else {
        orders[i].style.display = 'none';
      }
    }
  }
  

  <div style="max-width: 600px; margin: auto; border: 1px solid #ccc; padding: 20px; margin-top: 50px; border-radius: 10px;">
  <h2 style="text-align: center;">Все заказы</h2>
  <div>
    <button onclick="filterOrders('')">Все заказы</button>
    <button onclick="filterOrders('Новый')">Новый</button>
    <button onclick="filterOrders('В обработке')">В обработке</button>
    <button onclick="filterOrders('Выполнен')">Выполнен</button>
  </div>
  <ul id="orderList" style="list-style-type: none;">
    {{#each orders}}
      <li class="order" data-status="{{this.Status}}" style="margin-bottom: 20px; padding: 10px; border: 1px solid #ccc; border-radius: 10px;">
        <!-- Остальные поля заказа -->
        <form action="/updateOrderStatus" method="POST">
          <input type="hidden" name="OrderID" value="{{this.OrderID}}">
          <div class="input-group mb-3">
            <select name="newStatus" class="form-control" aria-label="Status" aria-describedby="basic-addon1">
              <option value="Новый" {{#if (eq this.Status 'Новый')}}selected{{/if}}>Новый</option>
              <option value="В обработке" {{#if (eq this.Status 'В обработке')}}selected{{/if}}>В обработке</option>
              <option value="Выполнен" {{#if (eq this.Status 'Выполнен')}}selected{{/if}}>Выполнен</option>
            </select>
            <button type="submit">Обновить статус</button>
          </div>
        </form>
      </li>
    {{/each}}
  </ul>
</div>
<script src="./dop.js"></script>















// app.post('/log', async (req, res) => {
//     const { email, password } = req.body;

//     // Здесь должна быть ваша логика проверки имени пользователя и пароля
//     // Например:
//     const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
//     if (rows.length > 0) {
//         const user = rows[0];

//         // Здесь вы должны проверить пароль. Это зависит от того, как вы храните пароли.
//         // Если вы храните их в открытом виде (что не рекомендуется), вы можете просто сравнить строки:
//         if (password === user.password) {
//             res.render('log', {
//                 title: 'login',
//             });
//         } else {
//             res.send('Неверный пароль');
//         }
//     } else {
//         res.send('Пользователь с таким email не найден');
//     }
// });
// const sessionStore = new MySQLStore({}, pool);

// waitForConnections: true,
//     connectionLimit: 50,
//     maxIdle: 50, // max idle connections
//     idleTimeout: 60000, // idle connections
//     queueLimit: 0,
//     enableKeepAlive: true,
//     keepAliveInitialDelay: 0