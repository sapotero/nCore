$ ->

  $.fn.colorTable ->
    data_table = document.getElementsByTagName("table")[3]
    cells = data_table.getElementsByTagName("td")
      

  $.fn.openWebSocket = (attempts = 0) ->
    return if attempts > get_hosts().length*2
    socket = $.fn.getSocket(attempts)
    socket.trigger 'authorize', { user_id: $("#sockets_user_id").val() }
    socket.trigger 'user_on_page', { url: window.location.href }
    socket.bind 'message', (message) ->
      eval(message.message)
      return

  $.fn.getSocket = (attempts = 0) ->
    host = $.fn.selectHost(attempts)
    return null if host == null
    socket = new WebSocketRails(host)
    socket._conn._conn.onerror = ->
      attempts += 1
      $.fn.openWebSocket(attempts)
    return socket

  $.fn.selectHost = (attempts) ->
    $hosts = get_hosts()
    return null if $hosts.length < 1
    $hosts[ attempts % $hosts.length ] + "/websocket"

  get_hosts = ->
    ($("#sockets_hosts").val() || "").split(",")

  $.fn.openWebSocket()