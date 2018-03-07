// intialise the interface 

  var toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            // custom button values
      [{ 'align': [] }],      
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    //  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    // [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      ['blockquote', 'code-block'],
      ['formula','image','video','link'],
      ['clean'],                                    // remove formatting button
      ['subdocument'],
      ['comments-toggle'], // comment color on/off
      ['comments-add'] // comment add
          
    ];

    Quill.register('modules/cursors', QuillCursors);
    
    var quill = new Quill("#editor", {
     modules: {
        formula: true,
        toolbar: {
                container: toolbarOptions,
                handlers: {
                subdocument:function(value) {
                 let range = this.quill.getSelection();
                 // let preview = this.quill.getText(range);
                 let preview = window.location.href.split('?')[0]+'?'+GUID2();
                 let tooltip = this.quill.theme.tooltip;
                 tooltip.edit('link', preview);
                },
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
$(".ql-subdocument .ql-comments-toggle .ql-comments-add").attr('data-toggle','tooltip');
$(".ql-comments-toggle,.ql-comments-add").css({"position":"relative","top":"-5px"});

$(".ql-subdocument").html('<strong>SUB</strong>');
$(".ql-subdocument").attr('title','Add subdocument');

$('.ql-comments-toggle').html('<i class="fa fa-comments"></i>');
$(".ql-comments-toggle").attr('title','Show/hide comments');


$('.ql-comments-add').html('<i class="fa fa-comment"></i>');
$(".ql-comments-add").attr('title','Add comment');

