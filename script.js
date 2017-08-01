'use strict';

var app = function () {

  var cart = [],
      adds = $('.add'),
      save = $('.save'),
      form = $('form'),
      circle = $('.circle'),
      searchBtn = $('.search'),
      searchBar = $('.search-bar'),
      cartBtn = $('.cartBtn');

  function Item(name, price, count) {
    this.name = name;
    this.price = price;
    this.count = count;
  }

  function addItem(name, price, count) {
    for (var i in cart) {
      var item = cart[i];
      if (item.name === name) {
        item.count += count;
        return;
      }
    }
    var item = new Item(name, price, count);
    cart.push(item);
  }

  function removeItem(name) {
    for (var i in cart) {
      var item = cart[i];
      if (item.name === name) {
        item.count--;
        if (item.count <= 0) {
          cart.splice(i, 1);
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
    if (cart.length === 0) {
      alert('empty cart');
      return;
    }
    return cart.reduce(function (prev, next) {
      return prev.count + next.count;
    });
  }

  function totalPrize() {
    if (cart.length === 0) {
      alert('empty cart');
      return;
    }
    var result = 0;
    for (var i in cart) {
      result += cart[i].price * cart[i].count;
    }
    return result.toFixed(2);
  }

  function cartList() {
    return JSON.parse(JSON.stringify(cart));
  }

  function saveCart(e) {
    e.preventDefault();
    var customer = $('.customer');

    if (customer.val() === '') {
      $('.err').html('You must type your name!');
    } else {
      $('.err').html('');
      localStorage.setItem(customer.val(), JSON.stringify(cart));
      customer.val('');
      clearCart();
      exitBtn();
    }
  }

  function loadCart(e) {
    var customer = $('.last');
    var result;
    if (!localStorage.getItem(customer.val()) || customer.val() === '') {
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
    }, 300);
    $('.table').addClass('up');

    $('.buyTable').addClass('open');
    e.preventDefault();
  }

  function exitBtn(e) {
    $('.table').removeClass('up').addClass('back');

    setTimeout(function () {
      $('.table').removeClass('open');
    }, 1000);

    $('.buyTable').removeClass('open');
    $('.customer').val('');
    $('.err').html('');
    if (e) {
      e.preventDefault();
    }
  }

  function searching() {
    var text = $(this).val();
    var carts = $('.cart').find('h2');

    $.each(carts, function (index, val) {
      var txt = val.innerHTML;
      if (txt.toLowerCase().indexOf(text.toLowerCase()) > -1 || txt.indexOf(text) > -1) {
        val.parentElement.parentElement.style.display = '';
      } else {
        val.parentElement.parentElement.style.display = 'none';
      }
    });
  }

  function displayCart() {
    var result = '';

    if (cart.length === 0) {
      $('.output').html('');
      result = '<p class=\'sh\'>Shopping List</p>\n                    <p class=\'empty\'>Empty cart</p>';
      $('.output').html(result);
      $('.output').removeClass('open');
      circle.removeClass('open');
      return;
    }
    circle.addClass('open');
    result += '<p class=\'sh\'>Shopping List</p>';
    cart.forEach(function (val) {
      result += '<li>\n                      <img class=\'fruit-img\' src=\'img/' + val.name + '.png\'>\n                      <h3 class=\'nm\'>' + val.name + '</h3>\n                      <p>Price: $' + val.price + '</p>\n                      <p>Count: ' + val.count + '</p>\n                      <a href="#" class=\'clearItem\'>x</a>\n                     </li>';
    });

    result += ' <a href="#" class=\'buyBtn\'>Buy</a>\n                    <a href="#" class=\'clearAll\'>Clear All Cart</a>\n                      <h4 class=\'total-price\'>\n                        <span>Total:</span>$' + totalPrize() + '\n                      </h4>';

    $('.output').html(result);

    $('.clearItem').on('click', function (e) {
      var x = $(this).siblings('.nm').text();
      removeItem(x);
      displayCart();
      e.preventDefault();
    });

    $('.clearAll').on('click', function (e) {
      console.log('sda');
      clearCart();
      displayCart();
      e.preventDefault();
    });

    $('.buyBtn').on('click', buyBtn);

    $('.exit-table').on('click', exitBtn);
  }

  function handlers() {

    searchBar.on('input', searching);

    form.on('submit', loadCart);

    adds.on('click', function (e) {
      var item = $(this);
      var name = item.data('name');
      var price = item.data('price');
      var count = item.prev('input');

      addItem(name, price, +count.val());
      displayCart();
      count.val(1);
      e.preventDefault();
    });

    save.on('click', saveCart);

    searchBtn.on('click', function () {
      $('.search-bar').toggleClass('open').focus();
    });

    cartBtn.on('click', function () {
      $('.output').toggleClass('open');
    });
  }

  return {
    handlers: handlers
  };
}();

app.handlers();
