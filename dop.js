app.post('/log', async (req, res) => {
    const { email, password } = req.body;

    // Здесь должна быть ваша логика проверки имени пользователя и пароля
    // Например:
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
        const user = rows[0];

        // Здесь вы должны проверить пароль. Это зависит от того, как вы храните пароли.
        // Если вы храните их в открытом виде (что не рекомендуется), вы можете просто сравнить строки:
        if (password === user.password) {
            res.render('log', {
                title: 'login',
            });
        } else {
            res.send('Неверный пароль');
        }
    } else {
        res.send('Пользователь с таким email не найден');
    }
});
const sessionStore = new MySQLStore({}, pool);

waitForConnections: true,
    connectionLimit: 50,
    maxIdle: 50, // max idle connections
    idleTimeout: 60000, // idle connections
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0