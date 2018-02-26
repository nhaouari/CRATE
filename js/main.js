// intialise the interface 


  $('#title').click(function(){
    $('#title').attr('contenteditable','true');
})


$('#title').keypress(function(e){
    if(e.which == 13){
        quill.focus();    
    }
});

  var toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      ['formula','image','video'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['contain'],
      ['comments-toggle'], // comment color on/off
      ['comments-add'], // comment add
      ['undo'],
      ['redo'],
      ['clean']                                         // remove formatting button
    ];

    Quill.register('modules/cursors', QuillCursors);
    
    var quill = new Quill("#editor", {
     modules: {
        formula: true,
        toolbar: {
                container: toolbarOptions,
                handlers: {
                undo: function(value) {
                  this.quill.history.undo();
                  
                },
                redo: function(value) {
                  this.quill.history.redo();
                }
              }
        },
        cursors: {
              autoRegisterListener: true, // default: true
              hideDelay: 500, // default: 3000
              hideSpeed: 0 // default: 400
            },
        history: {
             delay: 500,
             maxStack: 1000
         },
        comment: {
              enabled: true,
              commentAuthorId: 123,
              commentAddOn: 'Author Name', // any additional info needed
              color: 'yellow', // comment background color in the text
              commentAddClick: commentAddClick, // get called when `ADD COMMENT` btn on options bar is clicked
              commentsClick: commentsClick, // get called when you click `COMMENTS` btn on options bar for you to do additional things beside color on/off. Color on/off is already done before the callback is called.
              commentTimestamp: commentServerTimestamp,
            }
        },

     theme: 'snow'
        });


let commentCallback;

function commentAddClick(callback) {

  console.log("commentAddClick Event");
   commentCallback = callback;
  $('#inputCommentModal').modal('show');
}

let currentTimestamp;
function commentServerTimestamp() {
  return new Promise((resolve, reject) => {
    currentTimestamp = Math.round((new Date()).getTime() / 1000); // call from server

    resolve(currentTimestamp); 
  });
}

function commentsClick() {
  if (!$('.ql-editor').hasClass('ql-comments')) {
    $('.ql-editor .ql-comment').removeAttr('style');
  }
}

function addCommentToList(comment,idAuthor,name,color, currentTimestamp) {
  let utcSeconds = currentTimestamp;
  let d = new Date(0); // The 0 there is the key, which sets the date to the epoch
  d.setUTCSeconds(utcSeconds);
  console.log("currentTimestamp= "+currentTimestamp);
  console.log("d= "+d);
  let date = dateFormat(d, "dddd, mmmm dS, yyyy, h:MM:ss TT");

  let id = 'ql-comment-'+idAuthor+'-'+utcSeconds;

  let cmtbox = $(
    `<div class='comment-box ${id}' onfocus="commentBoxFocus('${id}')" onfocusout="commentBoxFocus('${id}', 'out')" tabindex="1">
      <div class='comment-head'>
        <div id="${id}"style="background-color:${color};width: 40px;" ><img class="imageuser" src="./icons/${name}.png" alt="${name}"></div>
    
        <div class='comment-details'>
          <div class='comment-author'>${name}</div>
          <div class='comment-date'>${date}</div>
        </div>
      </div>
      <div class='comment-body'>${comment}</div>
  
    </div>`
  );
  console.log('addCommentToList Event')
  $('#comments').append(cmtbox)
}


window.commentSave = () => {
  let comment = $('#commentInput').val();
  commentCallback(comment);


  let name = quill.options.modules.comment.commentAddOn ;

  let id = quill.options.modules.comment.commentAuthorId ; 

  let color= quill.options.modules.comment.color; 

  addCommentToList(comment,id,name,color, currentTimestamp)
  

}

window.commentBoxFocus = function(id, type) {
  $('.ql-comments #'+id).css('background-color', 'yellow');
  $('#comments .comment-box').css('border-color', '#F0F0F0');
  
  console.log(id+" : Focus type :"+type);
  if (type!=='out') {
    $('.ql-comments #'+id).css('background-color', 'red');
    $('#comments .'+id).css('border-color', 'red');
  }
  
}






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
