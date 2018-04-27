function initialize(connOptions) {

  connectionOptions = connOptions;
  // #A check the url if the editor must create documents already
  if ((document.URL.split("?")).length > 1) {
    var editingSessions = (window.location.href.split('?')[1]).split('&');
    justDoIt({
      server: config.signalingServer,
      session: editingSessions[0]
    });
  } else {
    justDoIt(null);

  }
};


function justDoIt(signalingOptions, name, importFromJSON) {

  options = {
    webRTCOptions: connectionOptions
  };

  options.webRTCOptions.trickle = true;

  if (signalingOptions) {
    options.signalingOptions = signalingOptions;

    if (store.get("CRATE2-" + signalingOptions.session)) {
      options.signalingOptions = {};
      options.importFromJSON = store.get("CRATE2-" + signalingOptions.session);
      options.signalingOptions.connect = true; // (TODO) may change this val
    };

  };


  if (name) {
    options.name = name;
  };

  // #1 add a cell into the list of editors

  //var editorContainer = $("#editor");
  if (!store.get('myId')) {
    generateID()
    jQuery('#save-profile').click()
  }

  options.user = store.get('myId')

  let newSession = new session(options);

  loadID()

};


// custom prev next page event polifill
(function(codes, code, evt) {

  document.addEventListener && // Modern browsers only
    document.addEventListener("keydown", function(e) {
      code = codes[e.keyCode];
      if ((e.ctrlKey || e.metaKey) && code) {
        evt = document.createEvent("Event")
        evt.initEvent(code, true, false);
        e.target.dispatchEvent(evt); // dispatch on current target. Event will bubble up to window
        e.preventDefault(); // opera defaut fix
      }
    }, false);

}({
  37: "prev",
  39: "next"
}));

// or using jQuery

$(document).on('next', () => {
  session.actualSession.moveToNext()
})

$(document).on('prev', () => {
  session.actualSession.moveToPrevious()
})

function openIn() {
  // get all links 
  // change the links function calls  
  let links = $('a')

  for (var link of links) {
    if (link.href.includes(window.location.href.split('?')[0])) {

      link.onclick = function() {
        console.log("click event")

        var sessionId = this.href.split('?')[1]
        var s = session.getCrateSession(sessionId)
        if (s._previous) {
          sessionId = s._previous.options.signalingOptions.session
        }

        if (jQuery(`#container-${sessionId}`).length) {
            session.focusOnSession(sessionId,this.href.split('?')[1])
        } else {
          justDoIt({
            server: config.signalingServer,
            session: this.href.split('?')[1]
          })

        }

      }
    }
  }

}


function startTour() {
  var intro = introJs();
  intro.setOptions({
            steps: [
              { 
                intro: "CRATE Document"
              },
              {
                element: '.activeEditor',
                intro: "This is a crate editor. In the case of multi editors you can use CTRL + arrow left/right to move from one to another"
              },
              {
                element: '.activeEditor #title',
                intro: "The title of your document. When you change the title, all the participants in the editing session will see it."
              },
               {
                element: '.activeEditor #shareicon',
                intro: "Click her to get a sharable link"
              },
                {
                element: '.activeEditor #saveicon',
                intro: "Click her to save locally the document (in local storage)"
              }
              ,
                {
                element: '.activeEditor #remotesave',
                intro: `Click her to save the document in a storage server to make available 
                all the time. <br><br>
                <strong style="color:red">*RED:</strong> not connected to a storage server, 
                or not saved there. <br><br>
    
                <strong style="color:gray">*GRAY:</strong>: the document is saved in 
                the storage server but is not activated. <br><br>

                <strong style="color:green">*GREEN:</strong>: the document 
                is saved and activated in the storage server.`
              }
              ,
                {
                element: '.activeEditor #state',
                intro: `The state of connection to the network
                <br><br>
                <strong style="color:red">*RED:</strong> not connected to the network<br><br>
    
                <strong style="color:green">*GREEN:</strong>: connected to network.`
              }
               ,
                {
                element: '.activeEditor #users',
                intro: "the avatars of the different users that are on the document"
              },
                {
                element: '.activeEditor .ql-toolbar',
                intro: "CRATE editor toolbar"
              },
                {
                element: '.activeEditor .ql-subdocument',
                intro: "this is to create a subdocument easily. Subdocuments are created on the same page of the main document."
              },
                {
                element: '.activeEditor .fa-comments',
                intro: "this is to see the different comments on the document"
              }
              ,
                {
                element: '.activeEditor .fa-comment',
                intro: "select a text then comment it using this icon"
              }
               ,
                {
                element: '.activeEditor .ql-editor',
                intro: "Start editing your document her"
              }
            ]
          });

  intro.onchange((targetElement)=>{
  
   // console.log(targetElement.id)
  
  /* switch (targetElement.id) {
      case "icon-profile":
       loadID()
      $('#profile').collapse('toggle')
        break;
      case "documents":
       $('#profile').collapse('toggle')
        break;
    }*/
  }).start();

  }