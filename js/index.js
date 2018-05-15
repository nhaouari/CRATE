listDocuments();

// Remove document and referch the list of documents
function removeDocument(key) {
  console.log("the key is "+key);
  store.remove(key);
  listDocuments();
}



function listDocuments() {
  // body...
var documents= $('#documents');
 list = `<table class="table">
   <tbody>
`;

var i= 1;
store.each(function(value, key) {
            
if (key.includes("CRATE2"))
{
  session= key.split("-")[1];
  date = dateFormat(value.date, "dddd, mmmm dS, yyyy, h:MM:ss TT");
  title = value.title;
  row=`
  <tr>
      <td scope="row"><i class="fa fa-file"></i></td>
      <td scope="row"><a href="./document.html?${session}">${title}</a></td>
      <td scope="row">${date}</td>
      <td scope="row" onClick="removeDocument('${key}');"><i class="fa fa-trash-o" style="color:red">
        </i></td>  
    </tr>`;

 list=list+row;
 i++;
}
});


 list=list+`
  </tbody>
</table>`;

if (i==1) {
  message= `<div class="alert alert-success">
    You Have not created yet <strong>CRATEv2!</strong>  documents. click on <a href="./document.html"><i class="fa fa-plus-circle" style="
    font-size: 30px; color:gray; position: relative;
    top: 5px;
  "></i></a>  to creat your first document. 
  </div>`;
list+=message; 
}
documents.html(list);

}

function startTour() {
  introJs().onchange((targetElement)=>{
  
   console.log(targetElement.id)
  
   switch (targetElement.id) {
      case "icon-profile":
       loadID()
      $('#profile').collapse('toggle')
        break;
      case "documents":
      $('#profile').collapse('toggle')
        break;
    }
  }).start();

}