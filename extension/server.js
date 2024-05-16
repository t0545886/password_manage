const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// 使用 CORS，以便前端應用可以與後端進行交互
app.use(cors());

// 解析 JSON 請求體
app.use(bodyParser.json());

// MySQL 連接配置
const connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'jkj3ipmm',
  database : 'password_manage'
});

// 建立與 MySQL 的連接
connection.connect();

// API 端點示例
app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.get('/api/data', (req, res) => {
  // 檢查是否有提供 website 查詢參數
  const website = req.query.website;

  let query = 'SELECT * FROM password_manage.entry';
  let queryParams = [];

  if (website) {
    query += ' WHERE website LIKE ?';
    queryParams.push(`%${website}%`);  // 添加 % 符號以匹配任何包含指定字串的 website
  }

  // 執行查詢
  connection.query(query, queryParams, (error, results, fields) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.json(results);
    }
  });
});

app.get('/api/account', (req, res) => {
    const websiteURL = req.query.website;
    console.log(`Requested website: ${websiteURL}`);
    if (!websiteURL) {
        return res.status(400).send({ message: 'Website parameter is required' });
    }

    try {
        // 解析 URL 以獲取基礎 URI
        const parsedUrl = new URL(websiteURL);
        const basePath = `${parsedUrl.protocol}//${parsedUrl.hostname}/`;

        console.log(`Base Path: ${basePath}`);

        const query = 'SELECT username, password FROM password_manage.entry WHERE uri = ?';

        connection.query(query, [basePath], (error, results) => {
            if (error) {
                return res.status(500).send(error);
            }
            if (results.length > 0) {
                // 考慮僅返回必要的信息，避免直接返回密碼
                const data = results.map(entry => ({
                    username: entry.username,
                    password: entry.password  // 以星號隱藏密碼
                }));
                res.json(data);
            } else {
                res.status(404).send({ message: 'No entries found for the given website' });
            }
        });
    } catch (error) {
        return res.status(400).send({ message: 'Invalid website URL provided' });
    }
});


app.post('/api/entries', (req, res) => {
  const { website, username, password, uri } = req.body;
  connection.query(
    'INSERT INTO password_manage.entry (website, username, password, uri) VALUES (?, ?, ?, ?)',
    [website, username, password, uri],
    (error, results) => {
      if (error) throw error;
      res.status(201).send({identy: results.insertId, message: 'Entry created successfully!'});
    }
  );
});

app.put('/api/entries/:identy', (req, res) => {
  const { website, username, password, uri } = req.body;
  connection.query(
    'UPDATE password_manage.entry SET website = ?, username = ?, password = ?, uri = ? WHERE identy = ?',
    [website, username, password, uri, req.params.identy],
    (error, results) => {
      if (error) throw error;
      res.send({ message: 'Entry updated' });
    }
  );
});

app.delete('/api/entries/:identy', (req, res) => {
  const identy = req.params.identy;
  connection.query(
    'DELETE FROM password_manage.entry WHERE identy = ?',
    [identy],
    (error, results) => {
      if (error) throw error;
      // 檢查是否真的有刪除任何記錄
      if (results.affectedRows > 0) {
        res.send({ message: 'Entry deleted' });
      } else {
        res.status(404).send({ message: 'Entry not found' });
      }
    }
  );
});


// 監聽指定端口
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
