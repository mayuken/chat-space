$(function(){

  function buildHTML(message){
    if (message.image) {
      var html =`<div class="message__list">
                  <ul class="message__info">
                    <li class="user__name">
                      ${message.user_name}
                    </li>
                    <li class="date">
                      ${message.created_at}
                    </li>
                    </ul>
                    <p class="message">
                    </p><p class="lower-message__content">
                      ${message.content}
                    </p>
                    <img class="lower-message__image" src="${message.image}">
                    <p></p> 
                </div>`
    } 
    else {
      var html = `<div class="message__list">
                    <ul class="message__info">
                      <li class="user__name">
                        ${message.user_name}
                      </li>
                      <li class="date">
                        ${message.created_at}
                      </li>
                      </ul>
                      <p class="message">
                      </p><p class="lower-message__content">
                        ${message.content}
                      </p>
                      
                      <p></p>
                  </div>`
    }
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
})
