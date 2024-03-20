// import ConData from './db.js'

// // Функция, которая получает заказы пользователя из базы данных
// async function getUserOrders(userId) {
//   const orders = await ConData.query(`
//     SELECT * FROM Orders WHERE Author = ${userId}
//   `);
//   return orders.rows;
// }

// // Функция для отображения заказов на странице
// async function displayOrders(userId) {
//   const orders = await getUserOrders(userId);
//   const orderList = document.getElementById('orderList');

//   orders.forEach(order => {
//     const listItem = document.createElement('li');
//     listItem.innerHTML = `
//       <p><strong>Товар:</strong> ${order.ProductName}</p>
//       <p><strong>Количество:</strong> ${order.Quantity}</p>
//       <p><strong>URL:</strong> <a href="${order.URL}">${order.URL}</a></p>
//       <p><strong>Сроки:</strong> с ${order.StartDate} по ${order.EndDate}</p>
//       <p><strong>Автор:</strong> ${order.Author}</p>
//       <p><strong>Статус:</strong> ${order.Status}</p>
//     `;
//     orderList.appendChild(listItem);
//   });
// }

// // Вызовите эту функцию при загрузке страницы
// displayOrders(userId);

// export default function myFunction() {
//    getUserOrders(),
//    displayOrders(),
//    getElementById()

//   }