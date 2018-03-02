//$('.ql-undo').addClass('./node_modules/quill/assets/icons/undo.svg');
//$('.ql-redo').addClass('./node_modules/quill/assets/icons/redo.svg');

var connectionOptions = "";
// #2 get stun servers
$.ajax({
    type: "POST",
    url: "https://service.xirsys.com/ice",
    data: {
        ident: "chatwane",
        secret: "8105d907-564a-4213-8c91-21b0a2f7344b",
        domain: "crate.com",
        application: "crate",
        room: "default",
        secure: 1
    },
    success: function (addresses, status) {
        var connectionOptions = (addresses && addresses.d) ||
            {iceServers: [ {
                url: 'stun:23.21.150.121', // default google ones if xirsys not
                urls: 'stun:23.21.150.121' } ] }; // responding
        initialize(connectionOptions);
    },
    async: true
});




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

       //TODO: Organise this function (this is to make copy function work)
       jQuery("#copyButton").click(function(){
           jQuery("#sessionUrl").select();
            document.execCommand("Copy");
      });
    };



/// New Organization 

// 1 configuration: signaling server , delta for shuffling spray ...


// Inital the view : inital the interface 



// Joining or new document


// JustDOIT (...) 



function justDoIt (signalingOptions, name, importFromJSON){
    // #0 analyse the arguments
    // (TODO) fix the uglyness of this code
    var options = {webRTCOptions: connectionOptions };
    options.webRTCOptions.trickle = true;
    
    if (signalingOptions) { options.signalingOptions = signalingOptions; };
    
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