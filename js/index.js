(function () {
  'use strict';
  window.addEventListener('load', function () {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function (form) {
      form.addEventListener('submit', function (event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
})();

$(document).ready(function () {

  $('a[data-toggle="modal"][data-dismiss="modal"]').on('click', function () {
    // console.log('click');
    // <a href="#" data-toggle="modal" data-target="#loginModal" data-dismiss="modal" class="mr-auto">切換到登入</a>
    var target = $(this).data('target');
    console.log('target ' + target);
    // 完全載入動態在body加上modal-open
    $(target).on('shown.bs.modal', function () {
      $('body').addClass('modal-open');
      $('body').css('padding-right', '0px');
    });
  });

  $(window).scroll(() => {
    let imformationHeight = $('.imformation').height();
    let scrollPos = $(window).scrollTop();

    if (scrollPos > imformationHeight) {
      $('nav.navbar').addClass('fixed-top');
    } else {
      $('nav.navbar').removeClass('fixed-top');
    }
  });
});

// gototop 點擊到最上面
// IIFE
$('#gototop, .index').click(function () {
  $('html, body').animate({
    scrollTop: 0
  }, 2000);
});

// 綁定DOM
var selectlist = document.querySelector('.select');
var title = document.querySelector('.title')
var hotbox = document.querySelector('.welcome');
var travelbox = document.querySelector('.travelbox');

// 擷取資料
var data = [];
var xhr = new XMLHttpRequest();
xhr.open('get', 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97', true);
xhr.send(null);

// 當readyState發生變動則觸發
xhr.onreadystatechange = function () {
  // console.log(xhr);
  if (this.readyState == 4 && this.status == 200) {
    // 載入成功就執行，然後清空內容初始
    myFunction();
    travelbox.innerHTML = '';
  } else {
    travelbox.innerHTML = '無法載入，status:' + xhr.status + " readyState: " + xhr.readyState;
  }
};

// 過濾出所有區域，然後show到select
function myFunction() {
  // if(xhr.status==200){
  var area = [];
  var arealist = [];
  data = JSON.parse(xhr.responseText);
  data = data.result.records;
  // console.log(data);
  for (var i = 0; data.length > i; i++) {
    arealist.push(data[i].Zone);
  }
  // console.log(data);
  // 把每個Zone跑一遍，過濾掉重覆的
  arealist.forEach(function (value) {
    if (area.indexOf(value) == -1) {
      area.push(value);
    }
  });
  // console.log(area);
  // console.log(arealist);
  areaUpdated(area);
}

selectlist.addEventListener('change', updatedList);
hotbox.addEventListener('click', hotlist);

// 剛開始長度是27
// 動態新增區域至select
function areaUpdated(items) {
  // console.log(items);
  var str = '';
  for (var i = -1; i < items.length; i++) {
    if (i == -1) {
      // 加上select預設選項
      str += '<option selected="selected" disabled="disabled" value=""> -- 請選擇行政區 -- </option>'
    } else {
      str += '<option value="' + items[i] + '">' + items[i] + '</option>'
    }
  }
  selectlist.innerHTML = str;
}

function hotlist(e) {
  // console.log(e);
  if (e.target.nodeName !== 'INPUT') { return; }
  updatedList(e);
  console.log(e);
}

// 更新內容資訊
function updatedList(e) {
  var str = '';
  // 移動至內容
  $('html,body').animate({
    scrollTop: $('.title').offset().top
  }, 1500);
  for (var i = 0; i < data.length; i++) {
    // 動態更新標題
    // 要搭配input取得value的值
    if (e.target.value == data[i].Zone) {
      title.textContent = data[i].Zone;
      // 判斷是否有免費參觀
      if (data[i].Ticketinfo == '') {
        str += `
        <li>
          <div class="pic" style="background:url(${data[i].Picture1
          }); background-size:cover; background-position:center";></div>
          <h3>${data[i].Name}</h3>
          <h2>${data[i].Zone}</h2>
          <div class="about">
            <div class="opentime">${data[i].Opentime}</div>
            <div class="address">${data[i].Add}</div>
            <div class="telephone">${data[i].Tel}</div>
          </div>
        </li>
        `
      } else {
        str += `
        <li>
          <div class="pic" style="background:url(${data[i].Picture1
          })"></div>
          <h3>${data[i].Name}</h3>
          <h2>${data[i].Zone}</h2>
          <div class="about">
            <div class="opentime">${data[i].Opentime}</div>
            <div class="address">${data[i].Add}</div>
            <div class="telephone">${data[i].Tel}</div>
            <div class="toll">${data[i].Ticketinfo}</div>
          </div>
        </li>
        `
      }
    }
    travelbox.innerHTML = str;
  }
}