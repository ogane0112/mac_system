const removedOrders = [];

async function fetchOrders() {
    const response = await fetch('/orders');
    const data = await response.json();

    const waitingOrders = document.getElementById('waitingOrders');
    const completedOrders = document.getElementById('completedOrders');

    data.forEach(orderRow => {
        const orderId = orderRow[1];
        const ordernum = orderRow[0];
        const status = orderRow[5];

        if (removedOrders.includes(ordernum)) {
            return;
        }

        const time = new Date(orderRow[4]);
        const now = new Date();
        const check = (now - time) / (60 * 1000);

        const existingOrder = document.getElementById(`order-num-${ordernum}`);

        const removeOrderAfterDelay = (orderElement) => {
            setTimeout(function() {
                if (completedOrders.contains(orderElement)) {
                    completedOrders.removeChild(orderElement);
                    removedOrders.push(ordernum);
                }
            }, 120000);
        };

        if (existingOrder) {
            existingOrder.innerText = `整理券: ${orderId} 会計番号: ${ordernum}`;

            if (status === '注文完了' && check <= 15 && !completedOrders.contains(existingOrder)) {
                waitingOrders.removeChild(existingOrder);
                completedOrders.appendChild(existingOrder);
                removeOrderAfterDelay(existingOrder);  // ここにタイマーを追加
            } else if (status !== "注文完了" && check <= 15 && !waitingOrders.contains(existingOrder)) {
                completedOrders.removeChild(existingOrder);
                waitingOrders.appendChild(existingOrder);
            }

        } else {
            const orderDiv = document.createElement('div');
            orderDiv.id = `order-num-${ordernum}`;
            orderDiv.innerText = `整理券: ${orderId} 会計番号: ${ordernum}`;

            if (status === '注文完了' && check <= 15) {
                completedOrders.appendChild(orderDiv);
                removeOrderAfterDelay(orderDiv);
            } else if (status !== "注文完了" && check <= 15) {
                waitingOrders.appendChild(orderDiv);
            }
        }
    });
}

setInterval(fetchOrders, 10000);

