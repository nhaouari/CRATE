let commentCallback;
$('.ql-editor').removeClass('ql-comments');

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
  if ($('#comments').is(":visible")) {


    if($('.ql-editor').hasClass('ql-comments')) {$('.ql-editor').removeClass('ql-comments');}
    

    $('#comments').hide();
    $('#comments').css('width','0%');
    $('.editor').css('width','100%');
   // $('.ql-editor .ql-comment').removeAttr('style');
  } else 
  {
      $('.ql-comments').addClass('comment');
    if(!$('.ql-editor').hasClass('ql-comments')) {$('.ql-editor').addClass('ql-comments');}
    
    $('#comments').css('width','30%');
    $('.editor').css('width','70%');
    $('#comments').show();

  }
}

function addCommentToList(comment,idAuthor,pseudo,name,color, currentTimestamp) {
  let utcSeconds = currentTimestamp;
  let d = new Date(); // The 0 there is the key, which sets the date to the epoch
  date = dateFormat(d, "dddd, mmmm dS, yyyy, h:MM:ss TT");

  let id = 'ql-comment-'+idAuthor+'-'+utcSeconds;

  let cmtbox = $(
    `<div class='comment-box ${id}' onfocus="commentBoxFocus('${id}')" onfocusout="commentBoxFocus('${id}', 'out')" tabindex="1">
      <div class='comment-head'>
        <div id="${id}"style="background-color:${color};width: 40px;" ><img class="imageuser" src="./icons/${pseudo}.png" alt="${name}"></div>
    
        <div class='comment-details'>
          <div class='comment-author'>${name}</div>
          <div class='comment-date'>${date}</div>
        </div>
      </div>
      <div class='comment-body'>${comment}</div>
  
    </div>`
  );
  
  $('#comments').append(cmtbox);
}


window.commentSave = () => {
  let comment = $('#commentInput').val();
  commentCallback(comment);


  let name = quill.options.modules.comment.commentAddOn ;

  let id = quill.options.modules.comment.commentAuthorId ; 

  let color= quill.options.modules.comment.color; 


  m=new Marker(id);

  addCommentToList(comment,id,name,store.get('myId').pseudo,color,currentTimestamp)
  //jQuery('.ql-clean').click() ;
}

window.commentBoxFocus = function(id, type) {
 
if (type!=='out') {
  $('.ql-comments #'+id).addClass('commentFocus');
  $('#comments .'+id).css('border-color', 'red');
  } else {
  $('.ql-comments #'+id).removeClass('commentFocus');
  $('#comments .comment-box').css('border-color', '#F0F0F0');
  }
  
}
