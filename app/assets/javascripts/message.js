$(function(){

  var reloadMessages = function() {
    last_message_id = $('.message__list:last').data("message-id");
    $.ajax({
      url: "api/messages",
      type: 'get',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0) {
        var insertHTML = '';
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        $('.chat-main__message--list').append(insertHTML);
        $('.chat-main__message--list').animate({ scrollTop: $('.chat-main__message--list')[0].scrollHeight});
      }
    })
    .fail(function() {
      alert("自動更新に失敗しました");
    });
  };

  function buildHTML(message){
    if (message.content && message.image) {
      var html = `<div class="message__list" data-message-id=${message.id}>
                    <div class="message__info">
                      <div class="user__name">
                        ${message.user_name}
                      </div>
                      <div class="date">
                        ${message.created_at}
                      </div>
                    </div>
                    <div class="message">
                      <p class="lower-message__content">
                        ${message.content}
                      </p>
                      <img src=${message.image} class="lower-message__image" >
                    </div>
                  </div>`
    } else if (message.content) {
      var html = `<div class="message__list" data-message-id=${message.id}>
                    <div class="message__info">
                      <div class="user__name">
                        ${message.user_name}
                      </div>
                      <div class="date">
                        ${message.created_at}
                      </div>
                    </div>
                    <div class="message">
                      <p class="lower-message__content">
                        ${message.content}
                      </p>
                    </div>
                  </div>`
    } else if (message.image) {
      var html = `<div class="message__list" data-message-id=${message.id}>
                    <div class="message__info">
                      <div class="user__name">
                        ${message.user_name}
                      </div>
                      <div class="date">
                        ${message.created_at}
                      </div>
                    </div>
                    <div class="message">
                      <img src=${message.image} class="lower-message__image" >
                    </div>
                  </div>`
    };
    return html;
  }

  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: 'POST',
      data: formData,  
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.chat-main__message--list').append(html);
      $('.chat-main__message--list').animate({ scrollTop: $('.chat-main__message--list')[0].scrollHeight});
      $('form')[0].reset();
      $('.send__btn').prop('disabled', false);
    })
    .fail(function() {
      alert("メッセージ送信に失敗しました");
      $('.send__btn').prop('disabled', false);
    });
  })
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
})
