# mac_system
学祭で使用するためのマックの注文システムのようなものを実装してみました.  
フロントエンド側の処理とスプレットシートに書き込む処理はGASで実装しています。  
なのでコピペするだけでは動作しないです。  
# システムの構造図
![image](https://github.com/ogane0112/mac_system/assets/120627734/c399527e-bc43-44d2-abe8-17ed2468611e)  
***システムの簡単な構成図です！***   
画像の通り,フロントエンド側の処理をGASで行い,データベースとしてspreadSheetをもちいました。さらにSpreadSheetのAPIと    
node.jsを用いて画面表示用のhtml,css,JavaScriptを用いて実装したサイトに注文情報が表示されるようにしました。　　
# なぜ作ったのか?
サークルでチュロスを出店する事になったのだが,同じくチュロスを出店する別サークルが3団体もあり,何か差別化は図れないのか？と思い,　　
マックのように注文完了をお知らせする画面を作りタブレットで注文を受け取るようにすれば,レジの効率もあがり,視覚的にも優れた物になると考え作りました！　　
# 機能面の説明＋UIについての説明
<img width="287" alt="image" src="https://github.com/ogane0112/mac_system/assets/120627734/a8d14e05-2ef6-47bc-9710-4e76c38ec597">  

上の画像は注文画面のUIです！今考えると写真を加えるなどもう少し工夫した方がよかったかもしれません。　　
<img width="279" alt="image" src="https://github.com/ogane0112/mac_system/assets/120627734/7b838810-7116-49a4-bda2-a3a3a4a7acd3">  

上の画像は注文確定ボタンを押すと表示される画面でOrderIDを表示して

これをお客さんに控えてもらって,注文時にこの注文idで呼び出しをしました

機能面の反省点としては,settimeoutなどを用いてボタンの連打を防ぐ機能があったらよかったかなぁ～

<img width="313" alt="image" src="https://github.com/ogane0112/mac_system/assets/120627734/24360770-d475-4628-84dc-4b7a4e9773af">  

注文確定を押すとすぐにこのようにスプレットシートに注文内容が記入されます！  

<img width="894" alt="image" src="https://github.com/ogane0112/mac_system/assets/120627734/8806a9b2-aaeb-41c0-910e-d0c3772815c5">  

上の画像のようにnode.jsとスプレットシートのAPIを用いて先ほどのスプレットシートの情報がウェブ上で見れられるようにしました！  

さらにこれをＰＣで表示させ,モニターとＰＣをつなげて大画面表示させることで注文まちか注文完了なのかどうか見られるようにしました！　　

注文完了かどうかの判定はスプレットシートの4列目を下の画像のように変化させることで出来ます！

<img width="280" alt="image" src="https://github.com/ogane0112/mac_system/assets/120627734/ce3795db-8ec6-409b-84d9-cb7e9e641b46">

<img width="899" alt="image" src="https://github.com/ogane0112/mac_system/assets/120627734/b5cc0e75-4c1f-4163-a70c-9378a2fcd466">

スプレットシートを注文完了に変更することでこのように画面が変更されます！

# フロントエンド側の処理(GASのソースコードについて)
GASのソースコードはファイルとしてGithubに投稿できないので↓に示します！(スプレットシートのidやURLはセキュリティ上の問題から削除してあります)  
```javascript
function doPost(e) {
  // JSON形式で受け取る
  var json = JSON.parse(e.postData.contents);
  console.log(json);
  
  // スプレッドシートを開く
  var ss = SpreadsheetApp.openById('スプレットシートのid');
  var sheet = ss.getSheets()[0]; 

  // データを行に追加
  for (var i = 0; i < json.orders.length; i++) {
    var a = json.orderId;
    var b = json.orders[i].product;
    var c = json.orders[i].quantity;
    sheet.appendRow([a, b, c]);
  }
  
  return ContentService.createTextOutput('Order recorded')
    .setMimeType(ContentService.MimeType.TEXT)
    .setAllowedDomains(['*']);
}

  
 
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}
````
**上のコードではスプレットシートに注文情報が書き込まれる処理が書かれています**
```html
<!DOCTYPE html>
<html>
<head>
  <title>Order Form</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f0f0f0;
    }

    .order-container {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 20px;
      width: 90%;
      max-width: 400px;
      text-align: center;
    }

    .modal {
      display: none;
      position: fixed;
      z-index: 1;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.4);
      align-items: center;
      justify-content: center;
    }

    .modal-content {
      background-color: #fefefe;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      padding: 20px;
      text-align: center;
      max-width: 80%;
    }

    .close {
      color: #aaaaaa;
      float: right;
      font-size: 28px;
      font-weight: bold;
    }

    .close:hover,
    .close:focus {
      color: #000;
      text-decoration: none;
      cursor: pointer;
    }

    .product-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15px;
    }

    .product-name {
      flex: 1;
      text-align: left;
    }

    .product-button {
      flex: 1;
      text-align: right;
    }

    .quantity-select {
      width: 50px;
    }
  </style>
</head>
<!DOCTYPE html>
<html>
<head>
  <title>Order Form</title>

</head>
<body>

  <div class="order-container">
    <h1>注文フォーム</h1>

    <form id="orderForm">
      <div class="product-container">
        <span class="product-name">シナモンチュロス</span>
        <span class="product-button">
          <select class="quantity-select" name="シナモンチュロス">
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </span>
      </div>

      <div class="product-container">
        <span class="product-name">抹茶チュロス</span>
        <span class="product-button">
          <select class="quantity-select" name="抹茶チュロス">
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </span>
      </div>

      <div class="product-container">
        <span class="product-name">チョコチョロス</span>
        <span class="product-button">
          <select class="quantity-select" name="チョコチョロス">
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </span>
      </div>
        <form id="orderForm">
      <div class="product-container">
        <span class="product-name">キャラメルチュロス</span>
        <span class="product-button">
          <select class="quantity-select" name="キャラメルチュロス">
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </span>
      </div>
        <form id="orderForm">
      <div class="product-container">
        <span class="product-name">トッピング</span>
        <span class="product-button">
          <select class="quantity-select" name="トッピング">
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </span>
      </div>

      <button type="submit">注文確定</button>
    </form>
  </div>

  <div id="orderModal" class="modal">
    <div class="modal-content">
      <span class="close">&times;</span>
      <p>Your Order ID is: <span id="modalOrderId"></span></p>
    </div>
  </div>

  <script>
    document.addEventListener("DOMContentLoaded", function() {
      const orderForm = document.getElementById("orderForm");

      orderForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const products = ["シナモンチュロス", "抹茶チュロス", "チョコチョロス","キャラメルチュロス","トッピング"];
        const orders = [];

        products.forEach(function(product) {
          const quantitySelect = orderForm.querySelector(`select[name="${product}"]`);
          const quantity = parseInt(quantitySelect.value);

          if (quantity > 0) {
            orders.push({ product: product, quantity: quantity });
          }
        });

        if (orders.length === 0) {
          alert("Please select at least one product to order.");
          return;
        }

        const orderId = Math.floor(Math.random() * 1000000);
        var formData = {
          orderId: orderId,
          orders: orders
        };

        document.getElementById("modalOrderId").innerText = orderId;

        const modal = document.getElementById("orderModal");
        modal.style.display = "flex";

        const closeBtn = document.getElementsByClassName("close")[0];
        closeBtn.onclick = function() {
          modal.style.display = "none";
        };

        fetch("GASのデプロイした時のURL", {
          mode: 'no-cors',
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.text())
        .then(text => alert(text))
        .catch(error => console.error('Error:', error));
      });
    });
    
  </script>

</body>


</html>

```
**CORSの問題とサーバーを自分で準備するのが面倒だったのでフロントエンドのhtml表示画面もＧＡＳで実装しました！**
