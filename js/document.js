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


// Remote session 


function findremote() {
  var remotesave = $("#remotesave");
  // There is a configured server
  if (config.storageServer) {

    sessionID = window.crate_model.signalingOptions.session;


    $.ajax({
      type: "GET",
      url: config.storageServer + "/exist/" + sessionID,
      success: function(data, status) {
        data = JSON.parse(data);
        if (data.results == 0) {
          unpin(remotesave);
        } else {
          pin(remotesave);
          return false;
        }
      },
      async: false
    });
  }

}


$("#remotesave").click(function() {

  if (jQuery("#remotesave").hasClass('PIN')) {
    kill();
  } else {
    join();
  }
});



function pin(remotesave) {
  remotesave.css('color', 'green');
  remotesave.removeClass('UNPIN');
  remotesave.addClass('PIN');
  console.log("PIN");

}

function unpin(remotesave) {
  remotesave.css('color', 'red');
  remotesave.removeClass('PIN');
  remotesave.addClass('UNPIN');
  console.log("UNPIN");
}



function join() {
  sessionID = window.crate_model.signalingOptions.session;
  $.ajax({
    type: "GET",
    url: config.storageServer + "/join/" + sessionID,
    success: function(data, status) {

      console.log("This is success");
      //TODO: chANGE IT LATER
      setTimeout(function() {
          crate_model.csh.startJoining(crate_model.signalingOptions);
          crate_model.rps.updateState();
        },
        3000);

      findremote();
    },
    async: true
  });
}

function kill() {
  var r = confirm("Do you want remove document from remote server!");
  if (r == true) {
    sessionID = window.crate_model.signalingOptions.session;
    $.ajax({
      type: "GET",
      url: config.storageServer + "/kill/" + sessionID,
      success: function(data, status) {
        findremote();
      },
      async: false
    });



  } else {
    txt = "You have Cancel the remove!";
  }


}