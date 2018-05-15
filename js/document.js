  if (!store.get("config4")) {
    var config = {
      signalingServer: "https://carteserver.herokuapp.com",
      storageServer: "https://storagecrate.herokuapp.com",
      stun: '23.21.150.121' // default google ones if xirsys not
    };
  } else {
    var config = store.get("config4");
  }


  let editingSession = null
  if ( (document.URL.split("?")).length > 1) {
    editingSession = (window.location.href.split('?')[1]).split('&');
  }

  if (!store.get('myId')) {
    loadID()
  }


// default settings 
  session.config = {
    signalingServer: config.signalingServer,
    storageServer: config.storageServer,
    stun: config.stun, // default google ones if xirsys not
    containerID: 'content-default'
  }

  var Session = new session({editingSession: editingSession});


  function startTour() {
    var intro = introJs();
    intro.setOptions({
      steps: [{
        intro: "CRATE Document"
      }, {
        element: '.activeEditor',
        intro: "This is a crate editor. In the case of multi editors you can use CTRL + arrow left/right to move from one to another"
      }, {
        element: '.activeEditor #title',
        intro: "The title of your document. When you change the title, all the participants in the editing session will see it."
      }, {
        element: '.activeEditor #shareicon',
        intro: "Click her to get a sharable link"
      }, {
        element: '.activeEditor #saveicon',
        intro: "Click her to save locally the document (in local storage)"
      }, {
        element: '.activeEditor #remotesave',
        intro: `Click her to save the document in a storage server to make available 
                all the time. <br><br>
                <strong style="color:red">*RED:</strong> not connected to a storage server, 
                or not saved there. <br><br>
    
                <strong style="color:gray">*GRAY:</strong>: the document is saved in 
                the storage server but is not activated. <br><br>

                <strong style="color:green">*GREEN:</strong>: the document 
                is saved and activated in the storage server.`
      }, {
        element: '.activeEditor #state',
        intro: `The state of connection to the network
                <br><br>
                <strong style="color:red">*RED:</strong> not connected to the network<br><br>
    
                <strong style="color:green">*GREEN:</strong>: connected to network.`
      }, {
        element: '.activeEditor #users',
        intro: "the avatars of the different users that are on the document"
      }, {
        element: '.activeEditor .ql-toolbar',
        intro: "CRATE editor toolbar"
      }, {
        element: '.activeEditor .ql-subdocument',
        intro: "this is to create a subdocument easily. Subdocuments are created on the same page of the main document."
      }, {
        element: '.activeEditor .fa-comments',
        intro: "this is to see the different comments on the document"
      }, {
        element: '.activeEditor .fa-comment',
        intro: "select a text then comment it using this icon"
      }, {
        element: '.activeEditor .ql-editor',
        intro: "Start editing your document her"
      }]
    });

    intro.onchange((targetElement) => {

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