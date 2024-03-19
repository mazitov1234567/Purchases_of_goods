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


export default pool;

