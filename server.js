const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

let uniqueOrders = [];

async function fetchOrders() {

  const apiKey = 'スプレッドシートのapiキーを入力してください!';
  const sheetId = 'スプレッドシートのidを入力してください';
  const sheetName = '取得したいスプレッドシートのシート名を入力してください';
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const orders = response.data.values;

    // 重複したorderIdを削除
    const orderMap = new Map();
    for (const order of orders) {

      const orderId = order[0];

      if (!orderMap.has(orderId)) {

        orderMap.set(orderId, order);

      }
    }
    uniqueOrders = Array.from(orderMap.values());

  } catch (error) {

    console.error('Error fetching orders:', error);

  }
}

setInterval(fetchOrders, 10000); // 10秒ごとに更新

app.get('/orders', (req, res) => {

  res.json(uniqueOrders);
  
});

app.use(express.static('public')); // 静的ファイルを提供

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
