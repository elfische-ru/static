// Generated by CoffeeScript 1.6.3
(function() {
  window.Chat = (function() {
    function Chat(data) {
      var _this = this;
      this.comm = data.comm;
      this.code = data.code;
      this.container = data.container;
      this.input_box = data.input_box;
      this.content = $('<ul>').addClass('content');
      this.chat_input = this.input_box.find('input.message');
      this.scroll = new window.ChatScroll(this.container, this.content);
      this.client_msg_id_count = 0;
      this.comm.onmessage('chat', this.onmessage.bind(this));
      this.add_messages(JS_DATA.last_messages);
      this.init_sent();
      this.container.append($('<div>').addClass('up_beam'));
      this.container.append(this.content);
      this.scroll.add();
      $('body .chat .sent').click(function() {
        _this.sent('chat_message', {
          msg: _this.chat_input.val()
        });
        return _this.chat_input.val('').focus();
      });
      this.show_users_count(JS_DATA.users_count);
    }

    Chat.prototype.sent = function(action, data) {
      data.code = this.code;
      return this.comm.sent(action, data);
    };

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
        var client_msg_id, msg, name, target;
        if (evt.keyCode === 13) {
          target = $(evt.currentTarget);
          msg = target.val().trim();
          if (msg) {
            client_msg_id = _this.get_client_msg_id();
            name = $('.block.chat .input-box input.name').val();
            _this.sent('chat_message', {
              msg: msg,
              name: name,
              client_msg_id: client_msg_id
            });
            target.val('');
            return _this.add_messages({
              id: 'inner-' + client_msg_id,
              msg: msg,
              name: name
            }, 'sent');
          }
        }
      });
    };

    Chat.prototype.show_users_count = function(count) {
      return window.user_info.add(gettext('Посетителей: {0}').format(count));
    };

    Chat.prototype.get_client_msg_id = function() {
      return this.client_msg_id_count++;
    };

    Chat.prototype.onmessage = function(data) {
      if (data.add_message !== void 0) {
        return this.add_messages([data.add_message]);
      } else if (data.users_count !== void 0) {
        return this.show_users_count(data.users_count);
      } else if (data.check_user !== void 0) {
        return this.sent('check_user_live', {
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

    Chat.prototype.add_messages = function(messages, action) {
      var add_items, control, first_hidden, item, itemDom, last_hidden_count, message, _i, _len;
      add_items = [];
      last_hidden_count = 0;
      first_hidden = null;
      for (_i = 0, _len = messages.length; _i < _len; _i++) {
        item = messages[_i];
        message = $('<span>').text(item.msg);
        control = $('<span>').addClass('message-control').append($('<span>').addClass('check')).append($('<span>').addClass('hide'));
        this.check_message_length_async(message);
        itemDom = $('<li>').attr('id', 'message_id-' + item.id);
        if (item.name) {
          itemDom.append($('<span>').addClass('name-wrapper').append($('<span>').text(item.name)));
        }
        itemDom.append($('<span>').addClass('message-wrapper').append(message));
        itemDom.append(control);
        if (action === 'sent') {
          itemDom.addClass('sent');
        }
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
      this.content.append(add_items);
      return this.scroll.add();
    };

    Chat.prototype.init_message = function(item) {
      var _this = this;
      return item.find('.message-control .hide').click(function(ev) {
        var li, message_id;
        li = $(ev.currentTarget).closest('li');
        message_id = li.attr('id').substring(11);
        _this.sent('hide_message', {
          message_id: message_id,
          visitor_id: JS_DATA.visitor_id
        });
        return li.addClass('hide');
      });
    };

    return Chat;

  })();

}).call(this);
