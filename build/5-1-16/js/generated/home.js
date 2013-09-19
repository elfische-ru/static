// Generated by CoffeeScript 1.6.3
(function() {
  var Chat, Comm, Response, response;

  Comm = (function() {
    function Comm() {
      var _this = this;
      this.dispathers = [];
      this.channel = new goog.appengine.Channel(JS_DATA.user_tocken);
      this.socket = this.channel.open();
      this.socket.onmessage = function(evt) {
        var data, dispath, _i, _len, _ref, _results;
        data = JSON.parse(evt.data);
        _ref = _this.dispathers;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          dispath = _ref[_i];
          _results.push(dispath(data));
        }
        return _results;
      };
    }

    Comm.prototype.sent = function(action, data) {
      return $.ajax({
        type: 'POST',
        url: '/api/' + action,
        data: data
      });
    };

    Comm.prototype.onmessage = function(dispath) {
      return this.dispathers.push(dispath);
    };

    return Comm;

  })();

  Chat = (function() {
    function Chat() {
      var _this = this;
      this.content = $('<ul>').addClass('content');
      this.chat_input = $('.chat .input-box input');
      this.comm = new Comm();
      this.comm.onmessage(this.onmessage.bind(this));
      this.add_messages(JS_DATA.last_messages);
      this.init_sent();
      $('.chat .content-wrapper').append(this.content);
      $('body .chat .sent').click(function() {
        _this.comm.sent('chat_message', {
          msg: _this.chat_input.val()
        });
        return _this.chat_input.val('').focus();
      });
      if (!JS_DATA.is_mobile) {
        setTimeout(function() {
          _this.chat_input.focus();
          return $.injectCSS({
            '.chat .input-box input': {
              'animation': 'ma_ab1 .5s',
              '-webkit-animation': 'ma_ab1 .5s'
            }
          });
        }, 400);
      }
      this.show_users_count(JS_DATA.users_count);
    }

    Chat.prototype.highlight = function() {
      return this.chat_input.toggleClass('animate');
    };

    Chat.prototype.focus = function() {
      this.chat_input.focus();
      return this.highlight();
    };

    Chat.prototype.init_sent = function() {
      var _this = this;
      return this.chat_input.keydown(function(evt) {
        var target;
        if (evt.keyCode === 13) {
          target = $(evt.currentTarget);
          _this.comm.sent('chat_message', {
            msg: target.val()
          });
          return target.val('');
        }
      });
    };

    Chat.prototype.show_users_count = function(count) {
      return $('.chat .chat-info dd').text(count);
    };

    Chat.prototype.onmessage = function(data) {
      if (data.add_message !== void 0) {
        return this.add_messages([data.add_message]);
      } else if (data.users_count !== void 0) {
        return this.show_users_count(data.users_count);
      } else if (data.check_user !== void 0) {
        return this.comm.sent('check_user_live', {
          user_id: JS_DATA.stream_user_id
        });
      }
    };

    Chat.prototype.check_message_length_async = function(message) {
      var _this = this;
      return setTimeout(function() {
        if (!_this.check_message_length(message)) {
          return _this.check_message_length_async(message);
        }
      }, 100);
    };

    Chat.prototype.check_message_length = function(message) {
      var fold, parent,
        _this = this;
      parent = message.closest('li');
      if (message.width() > 346) {
        fold = $('<span>').addClass('fold-icon').click(function() {
          return parent.toggleClass('fold');
        });
        return parent.append(fold);
      }
    };

    Chat.prototype.add_messages = function(messages) {
      var add_items, control, first_hidden, item, itemDom, last_hidden_count, message, _i, _len;
      add_items = [];
      last_hidden_count = 0;
      first_hidden = null;
      for (_i = 0, _len = messages.length; _i < _len; _i++) {
        item = messages[_i];
        message = $('<span>').text(item.msg);
        control = $('<span>').addClass('message-control').append($('<span>').addClass('check')).append($('<span>').addClass('hide'));
        this.check_message_length_async(message);
        itemDom = $('<li>').attr('id', 'message_id-' + item.id).append($('<span>').addClass('message-wrapper').append(message)).append(control);
        if (item.hidden) {
          if (last_hidden_count === 0) {
            itemDom.addClass('first-hidden');
            first_hidden = itemDom;
          } else {
            itemDom.addClass('hidden');
          }
          last_hidden_count++;
        } else if (last_hidden_count > 0) {
          first_hidden.append($('<span>').addClass('hidden-count').append($('<span>').text(ngettext('Скрыто {0} сообщение', '', last_hidden_count).format(last_hidden_count))));
          last_hidden_count = 0;
          first_hidden = null;
        }
        this.init_message(itemDom);
        add_items.push(itemDom);
      }
      add_items.reverse();
      return this.content.append(add_items);
    };

    Chat.prototype.init_message = function(item) {
      var _this = this;
      return item.find('.message-control .hide').click(function(ev) {
        var li, message_id;
        li = $(ev.currentTarget).closest('li');
        message_id = li.attr('id').substring(11);
        _this.comm.sent('hide_message', {
          message_id: message_id,
          visitor_id: JS_DATA.visitor_id
        });
        return li.addClass('hide');
      });
    };

    return Chat;

  })();

  Response = (function() {
    function Response() {}

    Response.prototype.columns = function() {
      var first_col_height, media_height;
      first_col_height = $('body > .page-wrapper > .content > .column:eq(0)').height();
      media_height = $('.media').height();
      return $('.chat .content-wrapper').height(first_col_height - media_height - 69);
    };

    return Response;

  })();

  response = new Response();

  $(document).ready(function() {
    var set_text_size, show_size;
    new Chat();
    show_size = function() {
      var test, width;
      width = $(window).width();
      test = $('#test');
      if (!test.length) {
        test = $('<div>').attr('id', 'test');
        $('body').prepend(test);
      }
      return test.text(width);
    };
    set_text_size = function() {
      return $('.info .cover-wrapper .summary').css({
        fontSize: ($('.info .cover-wrapper .cover').width() / 200) + 'rem'
      });
    };
    set_text_size();
    $(window).resize(function() {
      set_text_size();
      return response.columns();
    });
    if (JS_DATA.is_mobile) {
      $('footer').insertAfter(".info");
    }
    return $('.chat > .chat-hidden').click(function() {
      return $('.chat').toggleClass('show-hidden');
    });
  });

  $(window).load(function() {
    return response.columns();
  });

}).call(this);
