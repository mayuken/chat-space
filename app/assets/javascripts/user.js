$(function() {

  function  appendUser(user){
    var html = `
              <div class="chat-group-user clearfix">
                <p class="chat-group-user__name">${user.name}</p>
                <div class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id="${user.id}" data-user-name="${user.name}">追加</div>
              </div>
              `;
    $('#user-search-result').append(html);
  }

  function  appendErrMsgToHTML(Msg){
    var html = `
               <div class="chat-group-user clearfix">
                <p class="chat-group-user__name">${Msg}</p>
               </div>`;
    $('#user-search-result').append(html);
  }

  function addDeleteUser(name, id) {
    var html = `
            <div class="chat-group-user clearfix" id="${id}">
              <p class="chat-group-user__name">${name}</p>
              <div class="user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn" data-user-id="${id}" data-user-name="${name}">削除</div>
            </div>
            `;
    $(".js-add-user").append(html);
  }
  
  function addMember(userId) {

    //userのidをinputタグの初期値としそれをnameを使ってgroupsコントローラ内のparamsで受け取る準備
    let html = `<input value="${userId}" name="group[user_ids][]" type="hidden" id="group_user_ids_${userId}" />`;
    
    //作ったinputタグをaddDeleteUser内で作ったhtml内にぶち込む
    $(`#${userId}`).append(html);
  }
  
  $("#user-search-field").on("keyup", function() {
    let input = $("#user-search-field").val();    //フォームの値を取得して変数に代入する
    $.ajax({
      type: 'GET',    //HTTPメソッド
      url: '/users',       //users_controllerの、indexアクションにリクエストの送信先を設定する
      dataType: 'json',
      data: { keyword: input }   //テキストフィールドに入力された文字を設定する
    })
      .done(function(users) {
        $("#user-search-result").empty();//emptyメソッドで一度検索結果を空にする
        if (users.length !== 0) { //usersが空かどうかで条件分岐
          users.forEach(function(user) {
            appendUser(user);
          });//配列オブジェクト１つ１つに対する処理
        }
        else if (input.length == 0) {
          return false;
        }
        else {
          appendErrMsgToHTML("ユーザーが見つかりません")
        }
      })
      .fail(function() {
        alert("通信エラーです。ユーザーが表示できません。");
      });
  });
  $(document).on('click', '.chat-group-user__btn--add', function() {
    const userName = $(this).attr("data-user-name");
    const userId = $(this).attr("data-user-id");
    $(this)
      .parent()
      .remove();
    addDeleteUser(userName, userId);
    addMember(userId);
  });
  $(document).on('click', '.chat-group-user__btn--remove', function() {
    $(this)
      .parent()
      .remove();
  });
});
