
function initialize(connOptions){
   
    connectionOptions = connOptions;
    // #A check the url if the editor must create documents already
    if ((document.URL.split("?")).length>1){
        var editingSessions = (window.location.href.split('?')[1]).split('&');
            justDoIt({server:  'https://ancient-shelf-9067.herokuapp.com',
                          session: editingSessions[0],
                          connect: true});
        } else 
        {
            justDoIt(null);

        }
    };


function justDoIt (signalingOptions, name, importFromJSON){
    // #0 analyse the arguments
    // (TODO) fix the uglyness of this code
    var options = {webRTCOptions: connectionOptions };
    options.webRTCOptions.trickle = true;
    
    if (signalingOptions) { 
      options.signalingOptions = signalingOptions; 
      
      //Check local storage
      if (store.get("CRATE2-"+signalingOptions.session)) {
          // Import causality and vector 
           options.importFromJSON = store.get("CRATE2-"+signalingOptions.session);
      }

    };
    

    if (name) { options.name = name; };
    
    if (importFromJSON) {
        options.importFromJSON = importFromJSON;
        if (!options.signalingOptions){ options.signalingOptions = {}; };
        options.signalingOptions.connect = true; // (TODO) may change this val
    };

    // #1 add a cell into the list of editors

    var editorContainer = $("#editor");
    cratify = editorContainer.cratify(options)[0];

};
