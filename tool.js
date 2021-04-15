console.info('★★★★★実行中！★★★★★');

const c_Continuous = 3; // 連続入力判定回数

// APUのURL情報
const c_apuUrlData = {
  protocol_http: 'http',
  protocol_https: 'https',
  hostname_n: 'www.apu.ac.jp',
  hostname_e: 'en.apu.ac.jp',
  hostname_cms: 'cms.apu.ac.jp',
  hostname_n_secure: 'secure.apu.ac.jp',
  hostname_e_secure: 'en.apu.ac.jp',
  mode_preview: 'preview',
  mode_admin: 'admin',
  version_english: 'english',
}

var c_isThisRun = true; // このスクリプト実行有効化フラグ
var c_inputList = []; // 連続キー入力リスト

// キー入力
document.addEventListener('keypress', (event) => {
  var keyName = event.key;

  // セキュア認証画面判断
  if (c_isWebSecure()) { return };

  // スクリプト実行有効判断
  if (event.ctrlKey) {
    // [ctrl]キー
    c_inputList.push('ctrl+' + keyName);

  } else if (event.shiftKey) {
    // [sift]キー
    c_inputList.push('shift+' + keyName);

    // [sift]+[Z]
    if (keyName == 'Z' && c_isThisRun) {
      // チュートリアル
      let msg = '\
      ✧٩(ˊωˋ*)و✧ キー入力ありがとう！\n\
      [sift]+[J] → 日本語言語切り替え\n\
      [sift]+[E] → 英語語言語切り替え\n\
      [sift]+[P] → 「mode=preview」切り替え\n\
      [sift]+[O] → 公開状態切り替え\n\
      [sift]+[A] → 「mode=admin」切り替え\n\
      [sift]+[S] → 表示ページのファイル名検索\n\
      [sift]+[K] → 要素指定aタグhref表示　※未完成\n\
      [sift]+[Q] → この機能の停止（再実行）\n\
      [sift]+[Z] → チュートリアル表示　※これ\n\
      ';
      alert(msg);
      console.log('✧٩(ˊωˋ*)و✧ キー入力ありがとう！');
    }

    // [sift]+[J]
    if (keyName == 'J' && c_isThisRun) {
      if (c_isWebAdmin()) { return };  // HC編集画面回避
      window.open(c_getUpdateUrlParam(location.href, 'version', ''));  // 日本語言語切り替え
    }

    // [sift]+[E]
    if (keyName == 'E' && c_isThisRun) {
      if (c_isWebAdmin()) { return };  // HC編集画面回避
      window.open(c_getUpdateUrlParam(location.href, 'version', 'english'));  // 英語語言語切り替え
    }

    // [sift]+[P]
    if (keyName == 'P' && c_isThisRun) {
      if (c_isWebAdmin()) { return };  // HC編集画面回避
      window.open(c_getChangeModeURL(location.href, 'preview')); // 「mode=preview」切り替え
    }

    // [sift]+[O]
    if (keyName == 'O' && c_isThisRun) {
      if (c_isWebAdmin()) { return };  // HC編集画面回避
      window.open(c_getChangeModeURL(location.href, ''));  // 公開状態切り替え
    }

    // [sift]+[A]
    if (keyName == 'A' && c_isThisRun) {
      if (c_isWebAdmin()) { return };  // HC編集画面回避
      window.open(c_getChangeModeURL(location.href, 'admin'));  // 「mode=admin」切り替え
    }

    // [sift]+[S]
    if (keyName == 'S' && c_isThisRun) {
      if (c_isWebAdmin()) { return };  // HC編集画面回避
      let url = 'https://cms.apu.ac.jp/webadmin/content/searchadvanced.jsp?id=&section=+&class=+&bundle=&group=&type=&version=&device=&status=&search_datetime_attribute=&search_datetime=&search=&';
      let filename = location.pathname;
      if (filename.slice(0, 1) == '/') {
        filename = filename.slice(1);
      }
      if (filename.slice(-1) == '/') {
        filename = filename.slice(0, -1);
      }
      window.open(c_getUpdateUrlParam(url, 'filename', filename));  // ページファイル名検索
    }

    // [sift]+[K]
    if (keyName == 'K' && c_isThisRun) {
      if (c_isWebAdmin()) { return };  // HC編集画面回避
      let msg = '範囲内の全てのaタグを開きます。範囲のセレクタを指定してください。';
      let selecter = c_dispAlertInput(msg);
      if (selecter) {
        if ($(selecter).length != 0) {
          // 指定セレクター内の全クリック
          $(selecter).find('a').each(function (i, elem) {
            let href = $(elem).attr('href');
            window.alert(href);
          })
        } else {
          alert('指定のセレクターが存在しません。');
        }
      } else {
        alert('キャンセルされました。');
      }
    }

    // [sift]+[V]
    if (keyName == 'V' && c_isThisRun) {
      if (!c_isWebAdmin()) { return };  // HC編集画面回避
      c_viewSource(); // ハートコアのソースコードを編集可能にする
    }

    // [sift]+[C]
    if (keyName == 'C' && c_isThisRun) {
      if (!c_isWebAdminDB()) { alert('このページはハートコアのデータベース編集画面ではありません。'); return; };  // HC編集画面回避
      c_copyDBData(); // コンテンツデータベース情報コピー
    }

    // [sift]+[D]
    if (keyName == 'D' && c_isThisRun) {
      if (!c_isWebAdminDB()) { alert('このページはハートコアのデータベース編集画面ではありません。'); return; };  // HC編集画面回避
      let dbData = prompt('データベースデータを貼り付けてください！');
    }

  } else {
    // キー単体
    c_inputList.push(keyName);
  }

  // 連続キー入力判断
  if (c_isContinuous(c_Continuous)) {
    let keyVal = c_inputList[c_inputList.length - 2];
    console.log('連続入力：' + keyVal);

    // 連続 [sift]+[Q]
    if (keyVal == 'shift+Q') {
      c_toggleRun();  // スクリプトの実行有効化切り替え
    }

    // スクリプト実行有効判断
    if (c_isThisRun) {

    }
  }
});

/**
 * 連続キー入力判断
 * @param  {Number} cnt 連続回数
 * @return {Boolean} 判断結果
 */
function c_isContinuous(cnt) {
  let prev = c_inputList[c_inputList.length - 1];
  if (c_inputList.length < cnt) {
    return false;
  }
  for (let i = 0; i < cnt; i++) {
    let next = c_inputList[c_inputList.length - 1 - i];
    if (prev !== next) {
      return false;
    }
    prev = next;
  }
  c_inputList.push('non'); // 連続区切り
  return true;
}

/**
 * スクリプトの実行有効化切り替え
 */
function c_toggleRun() {
  c_isThisRun = !c_isThisRun;
  if (c_isThisRun) {
    console.info('★★★★★実行中★★★★★');
    alert('実行中！');
  } else {
    console.info('■■■■停止しました……■■■■■');
    alert('停止しました……');
  }
}

/**
 * HC編集画面（/webadmin/）判断
 * @return {Boolean} 判断結果
 */
function c_isWebAdmin() {
  let url = new URL(location.href);
  if (url.pathname.indexOf('/webadmin/') === 0) {
    return true;
  }
  return false;
}

/**
 * HC編集画面DB（/webadmin/data/）判断
 * @return {Boolean} 判断結果
 */
function c_isWebAdminDB() {
  let url = new URL(location.href);
  if (url.pathname.indexOf('/webadmin/data/update.jsp') === 0 || url.pathname.indexOf('/webadmin/data/create.jsp') === 0) {
    return true;
  }
  return false;
}

/**
 * セキュア認証画面DB（/siteminderagent/）判断
 * @return {Boolean} 判断結果
 */
function c_isWebSecure() {
  let url = new URL(location.href);
  if (url.pathname.indexOf('/siteminderagent/') === 0) {
    return true;
  }
  return false;
}

/**
 * ハートコアのソースコードを編集可能にする
 */
function c_viewSource() {
  let $target = $('#viewsource');
  $target.trigger('click');
  $target.css('background-color', 'red');
  console.log($target);
}

/**
 * コンテンツデータベース情報コピー
 * @return {Boolean} コピー成功判断
 */
function c_copyDBData() {
  let data = {};
  let $dataName = $('.WCMinnerContentInputName');

  $dataName.each(function (i, elem) {
    let rowName = $(elem).text(); // 項目名
    let $dataElem = $(elem).parent('tr').next('tr').find('td.WCMinnerContentInputValue').children(); // 入力欄の要素
    let tagName = $dataElem.first().prop('tagName').toLowerCase();  // 入力欄の要素のタグ名

    // タグ名を判断
    switch (tagName) {
      case 'input':
        c_getDBdata_input(rowName, $dataElem);
        break;
      case 'div':
        c_getDBdata_select(rowName, $dataElem);
        break;
      case 'select':
        c_getDBdata_select(rowName, $dataElem);
        break;
    }
  });

  for (let key in data) {
    console.log(key + ' : ' + data[key]);
  }
  return true;
}

/**
 * コンテンツデータベース項目データ取得(inputタグ)
 * @param  {String} rowName 項目名
 * @param  {String} $target 取得対象
 * @return {Object} 取得データ
 */
function c_getDBdata_input(rowName, $target) {
  let type = $target.attr('type');
  let val;

  switch (type) {
    case 'text':
      val = $target.attr('value');
      break;
    case 'checkbox':
      val = $target.filter('input').prop('checked');
      break;
    case 'radio':
      break;
  }
  console.log('項目名 : ' + rowName);
  console.log('type : ' + type);
  console.log('val : ' + val);
  console.log('length : ' + $target.length);

  return { rowName: val };

}

/**
 * コンテンツデータベース項目データ取得(divタグ)
 * @param  {String} rowName 項目名
 * @param  {String} $target 取得対象
 * @return {Object} 取得データ
 */
function c_getDBdata_div(rowName, $target) {

}

/**
 * コンテンツデータベース項目データ取得(selectタグ)
 * @param  {String} rowName 項目名
 * @param  {String} $target 取得対象
 * @return {Object} 取得データ
 */
function c_getDBdata_select($rowName, $target) {

}

/**
 * URLパラメータ更新
 * @param  {String} url 更新前URL
 * @param  {String} paramName パラメータ名 
 * @param  {String} val パラメータの値
 * @return {String} 更新後URL
 */
function c_getUpdateUrlParam(url, paramName, val) {
  let newUrl = new URL(url);
  newUrl.searchParams.delete(paramName);
  newUrl.searchParams.append(paramName, val);
  return newUrl.href;
}

/**
 * URLのモード切り替え
 * @param  {String} url 更新前URL
 * @param  {String} mode 切り替え後モード
 * @return {String} 更新後URL
 */
function c_getChangeModeURL(url, mode) {
  let newUrl = new URL(url);
  newUrl.searchParams.delete('mode');
  newUrl.searchParams.append('mode', mode);

  // モード指定判断
  if (mode != '') {
    newUrl.protocol = c_apuUrlData.protocol_https;
    newUrl.hostname = c_apuUrlData.hostname_cms;
  } else {
    // セキュア判断
    if (newUrl.pathname.indexOf('/secure') == 0) {
      newUrl.protocol = c_apuUrlData.hostname_cms;
      if (newUrl.searchParams.get('version') == c_apuUrlData.version_english) {
        newUrl.hostname = c_apuUrlData.hostname_e_secure;
      } else {
        newUrl.hostname = c_apuUrlData.hostname_n_secure;
      }
    } else {
      newUrl.protocol = c_apuUrlData.protocol_http;
      if (newUrl.searchParams.get('version') == c_apuUrlData.version_english) {
        newUrl.hostname = c_apuUrlData.hostname_e;
      } else {
        newUrl.hostname = c_apuUrlData.hostname_n;
      }
    }
  }
  return newUrl.href;
}

/**
 * アラート入力の表示
 * @param  {String} msg メッセージ
 * @return {String} 入力内容
 */
function c_dispAlertInput(msg) {
  let input = window.prompt(msg, "");
  return input;
}