this.addEventListener('message', function(e) {
  var data = e.data;
  switch (data.command) {
    case 'start':
      console.log('this STARTED: ' + data.data);
      this.postMessage('this STARTED: ' + data.data);
      break;
    case 'stop':
      console.log('this STOPPED: ' + data.data + '. (buttons will no longer work)');
      this.postMessage('this STOPPED: ' + data.data + '. (buttons will no longer work)');
      this.close(); // Terminates the this.
      break;
    default:
      console.log('Unknown command: ' + data.data);
      this.postMessage('Unknown command: ' + data.data);
  };
}, false); 
