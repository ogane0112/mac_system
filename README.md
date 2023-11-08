# mac_system
学祭で使用するためのマックの注文システムのようなものを実装してみました.  
フロントエンド側の処理とスプレットシートに書き込む処理はGASで実装しています。  
なのでコピペするだけでは動作しないです。
# システムの説明をする時に使用した資料
https://docs.google.com/presentation/d/e/2PACX-1vRzXtbTyDKgN1jacXFj1DqP9dqD81IRALKSFNjPScYyBXLsg8dMe-5LTyyeJCkYhNeuDdGykfKR8UvS/pub?start=false&loop=false&delayms=3000
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
**上のコードではスプレットシートに注文情報が書き込まれる処理が書かれています **
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
    
   /* タブレットとモバイルデバイスのためのスタイル */
  @media screen and (max-width: 1000px) {
    .order-container {
      width: 95%;
    }

   .modal-content {
      width: 100%;
      padding: 100px;
      font-size: 100px; /* モーダルのテキストサイズを増加 */
    }
    h1 {
      font-size: 50px;
    }

    .product-name, .product-button {
      font-size: 34px;
    }

    .close {
      font-size: 50px;
    }

    button {
      padding: 20px 40px;
      font-size: 36px;
    }

    .quantity-select {
      font-size: 64px;
      padding: 0px;
      width: 400px;
    }
  }

  /* モバイルデバイスのためのスタイル */
  @media screen and (max-width: 1000px) {
    .product-container {
      flex-direction: column;
      margin-top: 10px;
    }

    .product-name, .product-button {
      text-align: center;
      margin-bottom: 10px;
    }
  }
  </style>
</head>
<!DOCTYPE html>
<html>
<head>
  <title>Order Form</title>
  <style>
    /* スタイルは前回のコードと同様です */
  </style>
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
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="19">19</option>
            <option value="20">20</option>

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
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="19">19</option>
            <option value="20">20</option>
          </select>
        </span>
      </div>
        <form id="orderForm">
      <div class="product-container">
        <span class="product-name">はちみつチュロス</span>
        <span class="product-button">
          <select class="quantity-select" name="はちみつチュロス">
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="19">19</option>
            <option value="20">20</option>
          </select>
        </span>
      </div>
       

      <button type="submit">注文確定</button>
    </form>
  </div>

  <div id="orderModal" class="modal">

    <div class="modal-content">

      <span class="close">&times;</span>

      <p>整理券: <span id="modalOrderId"></span></p>

    </div>

  </div>

 <script>
    document.addEventListener("DOMContentLoaded", function() {

      const orderForm = document.getElementById("orderForm");

      // ローカルストレージからorderIdCounterを取得、もしなければ1を設定
      let orderIdCounter = parseInt(localStorage.getItem('orderIdCounter')) || 1;

      orderForm.addEventListener("submit", function(e) {
        
        e.preventDefault();
        //チュロスの種類を格納するための配列
        const products = ["シナモンチュロス","チョコチョロス","はちみつチュロス"];
        //データを送信するときに使う配列,
        const orders = [];

        //整理券(色)を入れておくための配列
        const ticket_list = [

          "赤", "リンゴ", "緑", "スイカ", "水", "黄",
        "紫", "金", "マゼンタ", "白", "オレンジ", "茶",
        "黒", "チョコレート", "桃", "銀", "ベージュ"
        
        ];

        //要素数をカウントするためのフラグ+ローカルストレージ(currentIndex)から値を取得orできない場合-1を取得
        let ticket_count = localStorage.getItem('currentIndex') ? parseInt(localStorage.getItem('currentIndex')) : 0;       
        ticket_count++;
        if (ticket_count >= ticket_list.length) {

            ticket_count = 0;

        }

        // currentIndexをローカルストレージに保存
        localStorage.setItem('currentIndex',ticket_count);

        products.forEach(function(product) {

          const quantitySelect = orderForm.querySelector(`select[name="${product}"]`);
          const quantity = parseInt(quantitySelect.value);

          if (quantity > 0) {
            orders.push({ product: product, quantity: quantity });
          }
        });

        if (orders.length === 0) {

          alert("最低一個以上注文してください.");
          return;

        }

        // 注文IDをローカルストレージから取得、もしなければ1を設定

        const orderId = orderIdCounter;

        orderIdCounter += 1; 

        if (orderIdCounter > 1200) {

          orderIdCounter = 0; 
          
        }

        // 更新したorderIdCounterをローカルストレージに保存
        localStorage.setItem('orderIdCounter', orderIdCounter);

        var formData = {
          orderId: orderId,

          ticket_list: ticket_list[ticket_count],

          orders: orders

        };
      

        console.log(ticket_list[ticket_count])
        
        console.log(formData)

        document.getElementById("modalOrderId").innerText = ticket_list[ticket_count] ;

        const modal = document.getElementById("orderModal");
        modal.style.display = "flex";

        //注文確定ボタンを押した後表示される画面を消すための処理
        const closeBtn = document.getElementsByClassName("close")[0];
        closeBtn.onclick = function() {

          modal.style.display = "none";

        };

        //データをスプレットシートに送信する処理
        fetch("https://script.google.com/macros/s/AKfycbz2t-ad8Waohy1MW648MAG2oTKj-LEE6zbKD2vfNx5N0dXAawGW6W8bcUVWI_9mVZ_IVg/exec", {
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
**CORSの問題とサーバーを自分で準備するのが面倒だったのでフロントエンドのhtml表示画面もＧＡＳで実装しました！　スマホでも操作しやすいようにレスポンシブ対応させました。(2023/11/08追記)**
