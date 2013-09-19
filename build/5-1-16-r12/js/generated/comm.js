// Generated by CoffeeScript 1.6.3
(function() {
  window.Comm = (function() {
    Comm.prototype.retry_number = 0;

    function Comm() {
      this.dispathers = {};
      this.open_channel();
    }

    Comm.prototype.open_channel = function() {
      var _this = this;
      this.channel = new goog.appengine.Channel(JS_DATA.user_tocken);
      window.user_info.add(gettext('Имя пользователя: {0}').format('<strong>' + JS_DATA.stream_user_id + '<strong>'));
      this.socket = this.channel.open();
      this.socket.onopen = function(evt) {
        return window.user_info.add(gettext('Соединение установлено'));
      };
      this.socket.onmessage = function(evt) {
        var data, dispath, name, _ref, _results;
        data = JSON.parse(evt.data);
        _ref = _this.dispathers;
        _results = [];
        for (name in _ref) {
          dispath = _ref[name];
          _results.push(dispath(data));
        }
        return _results;
      };
      this.socket.onerror = function(evt) {
        return window.user_info.add(gettext('Ошибка соединения'));
      };
      return this.socket.onclose = function(evt) {
        window.user_info.add(gettext('Соединение закрыто'));
        return _this.new_connection_delay();
      };
    };

    Comm.prototype.sent = function(action, data) {
      data.user_tocken = JS_DATA.user_tocken;
      return $.ajax({
        type: 'POST',
        url: '/api/' + action,
        data: data
      });
    };

    Comm.prototype.onmessage = function(name, dispath) {
      return this.dispathers[name] = dispath;
    };

    Comm.prototype.set_new_data = function(data) {
      JS_DATA.user_tocken = data.tocken;
      JS_DATA.stream_user_id = data.stream_user_id;
      return this.open_channel();
    };

    Comm.prototype.new_connection_delay = function() {
      return setTimeout(this.new_connection.bind(this), 1000);
    };

    Comm.prototype.new_connection = function() {
      var _this = this;
      window.user_info.add_last('new_connection', gettext('Устанавливается новое соединение, попытка: {0}').format(this.retry_number));
      return $.ajax({
        type: 'POST',
        url: '/api/new_connection',
        dataType: 'json',
        error: function(env) {
          _this.retry_number++;
          return _this.new_connection_delay();
        },
        success: function(data) {
          _this.retry_number = 0;
          return _this.set_new_data(data);
        }
      });
    };

    return Comm;

  })();

}).call(this);