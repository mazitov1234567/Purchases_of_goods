import express from 'express';
import session from 'express-session';
import mysql from 'mysql2';
import MySQLStore from 'express-mysql-session';

let sets = {
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'web-db',
    charset : 'utf8mb4_general_ci',
    
}

const app = express();
const pool = mysql.createPool(sets).promise();



export async function checkConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Успешное подключение к БД');
        connection.release();
    } catch (err) {
        console.error('Ошибка подключения к БД:', err);
    }
}

export async function get_order_history(userID){
    const qer = 'SELECT * FROM Orders WHERE UserID = ? AND Status = "Завершено"';
    const [rows, fields] = await pool.query(qer, [userID]);
    return rows;
}
export async function get_email( email){
    const qer = 'SELECT * FROM users WHERE email = ?';
    const [rows, fields] = await pool.query(qer, [email]);
    return rows;
}
export async function insert_user(username, email, password){
    const qer = 'INSERT INTO users (username, email, password, admin) VALUES (?, ?, ?, ?)';
    await pool.query(qer, [username, email, password, 0]);
}
export async function get_incomplete_orders(){
    const qer = 'SELECT * FROM Orders WHERE Status != "Завершено"';
    const [rows, fields] = await pool.query(qer);
    return rows;
}
export async function get_completed_orders(){
    const qer = 'SELECT * FROM Orders WHERE Status = ?';
    const [rows, fields] = await pool.query(qer, ['Завершено']);
    return rows;
}
export async function get_orders_by_status(pool, status){
    const qer = 'SELECT * FROM Orders WHERE Status = ?';
    const [rows, fields] = await pool.query(qer, [status]);
    return rows;
}
export async function update_order_status(pool, newStatus, OrderID){
    const qer = 'UPDATE Orders SET Status = ? WHERE OrderID = ?';
    await pool.query(qer, [newStatus, OrderID]);
}

export async function update_order_status_with_date(pool, newStatus, StatusChangeDate, OrderID){
    const qer = 'UPDATE Orders SET Status = ?, StatusChangeDate = ? WHERE OrderID = ?';
    await pool.query(qer, [newStatus, StatusChangeDate, OrderID]);
}
export async function get_user_orders(pool, userId){
    const qer = 'SELECT * FROM Orders WHERE UserID = ? AND Status != "Завершено"';
    const [rows, fields] = await pool.query(qer, [userId]);
    return rows;
}
export async function complete_order(pool, endDate, orderId){
    const qer = 'UPDATE Orders SET Status = "Завершено", EndDate = ? WHERE OrderID = ?';
    await pool.query(qer, [endDate, orderId]);
}
export async function submit_order(pool, order, userId, author, orderDate){
    const qer = 'INSERT INTO Orders (ProductName, Quantity, URL, StartDate, Author, Status, UserID, OrderDate) VALUES (?, ?, ?, ?, ?, "На рассмотрении", ?, ?)';
    await pool.query(qer, [order.productName, order.quantity, order.url, order.startDate, author, userId, orderDate]);
}

export default pool;

