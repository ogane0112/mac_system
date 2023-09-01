async function fetchOrders() {
    const response = await fetch('/orders');
    const data = await response.json();
    
    const waitingOrders = document.getElementById('waitingOrders');
    const completedOrders = document.getElementById('completedOrders');
  
    // 一旦クリア
    waitingOrders.innerHTML = '<h2>Waiting Orders</h2>';
    completedOrders.innerHTML = '<h2>Completed Orders</h2>';
  
    data.forEach(orderRow => {
      const orderId = orderRow[0];
      const status = orderRow[3]; // 4列目
  
      const orderDiv = document.createElement('div');
      orderDiv.innerText = `Order ID: ${orderId}`;
  
      if (status === '注文完了') {
        completedOrders.appendChild(orderDiv);
      } else {
        waitingOrders.appendChild(orderDiv);
      }
    });

  }
  function goFullScreen() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  }
}
  setInterval(fetchOrders, 10000); // 10秒ごとに更新
  