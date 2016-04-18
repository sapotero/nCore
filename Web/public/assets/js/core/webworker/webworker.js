var WebWorker = function(){
  this.worker = new Worker("assets/js/core/worker/worker.js");
  this.worker.onmessage = function( e ) {
    // console.log('FROM WORKER: ', e.data);
    var data = e.data;
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        // data[key];
        switch (key) {
          case 'template:loaded':
            var templateName = Object.keys( data[key] )[0],
                data         = data[key][templateName];
            
            core.events.publish("core:template:loaded", {
              name : templateName,
              raw  : data
            });
            
            break;
          case 'reports:loaded':
            // core.events.publish("core:reports:loaded", {
            //   raw: JSON.parse( data[key] )
            // });
            console.log( 'reports:loaded --> ', data[key] );
            core.events.publish("core:reports:loaded", data[key] );
            break;
          case 'report:loaded':
            console.log( 'report:loaded --> ', data[key] );
            core.events.publish("core:report:loaded", {
              raw: data[key]
            });
            break;
          case 'criterias:loaded':
            core.events.publish("core:criterias:loaded", data[key] );
            break;
          case 'criteriaKeys:loaded':
            core.events.publish("core:criteriaKeys:loaded", data[key] );
            break;




          default:
            console.log('default');
            break;
        }

      }
    }
  };
  return this.worker;
}; 
module.exports = WebWorker;