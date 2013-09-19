// Generated by CoffeeScript 1.6.3
(function() {
  window.UserInfo = (function() {
    var last_message_code;

    last_message_code = null;

    function UserInfo(data) {
      this.container = data.container;
      this.log = $('<ul>').addClass('log');
      this.container.append(this.log);
      this.scroll = new window.ChatScroll(this.log.parent(), this.log);
    }

    UserInfo.prototype.add = function(msg) {
      this.log.append($('<li>').html(msg));
      return this.scroll.add();
    };

    UserInfo.prototype.add_last = function(message_code, msg) {
      if (message_code === this.last_message_code) {
        return this.log.find('li:last-child').html(msg);
      } else {
        this.add(msg);
        return this.last_message_code = message_code;
      }
    };

    return UserInfo;

  })();

}).call(this);