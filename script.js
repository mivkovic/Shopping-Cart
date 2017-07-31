
    let shoppingCart = (() => {
      let cart = [],
          adds = $('.add'),
          save = $('.save'),
          form = $('form'),
          circle = $('.circle'),
          searchBtn = $('.search'),
          searchBar = $('.search-bar')
          cartBtn = $('.cartBtn');

      function Item(name,price,count) {
        this.name = name;
        this.price = price;
        this.count = count;
      }

      function addItem(name,price,count) {
        for(let i in cart){
          let item = cart[i];
          if(item.name === name){
            item.count += count;
            return;
          }
        }
        let item = new Item(name,price,count);
        cart.push(item);
      }

      function removeItem(name) {
        for(let i in cart){
          let item = cart[i];
          if(item.name === name){
            item.count --;
            if(item.count <= 0){
              cart.splice(i,1);
            }
            return;
          }
        }
      }

      function clearCart() {
        cart = [];
        circle.removeClass('open');
        displayCart();
      }

      function totalCount() {
        if(cart.length === 0){
          alert('empty cart');
          return;
        }
        return cart.reduce((prev,next) => prev.count + next.count);
      }

      function totalPrize() {
        if(cart.length === 0){
          alert('empty cart');
          return;
        }
        let result = 0;
        for(let i in cart){
          result += cart[i].price * cart[i].count;
        }
        return result.toFixed(2);
      }

      function cartList() {
        return JSON.parse(JSON.stringify(cart));
      }

      function saveCart(e) {
        e.preventDefault();
        let customer = $('.customer');

          if(customer.val() === ''){
            $('.err').html('You must type your name!')
          }else{
            $('.err').html('');
            localStorage.setItem(customer.val(),JSON.stringify(cart));
            customer.val('');
            clearCart()
            exitBtn();
          }
      }

      function loadCart(e) {
        let customer = $('.last');
        let result;
        if(!localStorage.getItem(customer.val()) || customer.val() === ''){
          alert('Kupovina s tim imenom nije sacuvana');
          customer.val('');
          return;
        }
        result = JSON.parse(localStorage.getItem(customer.val()));
        console.log(result);
        customer.val('');
        e.preventDefault();
      }

      function buyBtn(e) {
          setTimeout(function () {
            $('.table').removeClass('back').addClass('open');
          },300);
          $('.table').addClass('up');

          $('.buyTable').addClass('open');
        e.preventDefault();
      }


      function exitBtn(e) {
          $('.table').removeClass('up').addClass('back');

          setTimeout(function () {
              $('.table').removeClass('open');
          },1000);

          $('.buyTable').removeClass('open');
          $('.customer').val('');
          $('.err').html('');
          if(e){
              e.preventDefault();
          }
      }



      function searching() {
        let text = $(this).val();
        let carts = $('.cart').find('h2');

        $.each(carts,function (index,val) {
          let txt = val.innerHTML;
          if(txt.toLowerCase().includes(text.toLowerCase()) || txt.includes(text)){
            val.parentElement.parentElement.style.display = '';
          }else{
            val.parentElement.parentElement.style.display = 'none';
          }
        })


      }


      function displayCart() {
        let result = '';

        if(cart.length === 0){
          $('.output').html('');
          result = `<p class='sh'>Shopping List</p>
                    <p class='empty'>Empty cart</p>`;
          $('.output').html(result);
          $('.output').removeClass('open');
          circle.removeClass('open');
          return;
        }
        circle.addClass('open');
        result += `<p class='sh'>Shopping List</p>`;
        cart.forEach((val) => {
          result += `<li>
                      <img class='fruit-img' src='${val.name}.png'>
                      <h3 class='nm'>${val.name}</h3>
                      <p>Price: $${val.price}</p>
                      <p>Count: ${val.count}</p>
                      <a href="#" class='clearItem'>x</a>
                     </li>`;
        })

        result += ` <a href="#" class='buyBtn'>Buy</a>
                    <a href="#" class='clearAll'>Clear All Cart</a>
                      <h4 class='total-price'>
                        <span>Total:</span>$${totalPrize()}
                      </h4>`;

        $('.output').html(result);

        $('.clearItem').on('click',function (e) {
          let x = $(this).siblings('.nm').text();
          removeItem(x);
          displayCart();
          e.preventDefault();
        })

        $('.clearAll').on('click',function (e) {
          console.log('sda');
          clearCart();
          displayCart();
          e.preventDefault();
        })



        $('.buyBtn').on('click',buyBtn);

        $('.exit-table').on('click',exitBtn);

      }

      function handlers() {

        searchBar.on('keyup',searching);
        form.on('submit',loadCart);

        adds.on('click',function (e) {
          let item = $(this);
          let name = item.data('name');
          let price = item.data('price');
          let count = item.prev('input');

          addItem(name,price,+count.val());
          displayCart();
          count.val(1);
          e.preventDefault();
        })

        save.on('click',saveCart);

        searchBtn.on('click',function () {
          $('.search-bar').toggleClass('open').focus();

        })

        cartBtn.on('click',function () {
          $('.output').toggleClass('open');
        })
      }

      return{
        handlers
      }

    })();

    shoppingCart.handlers();
