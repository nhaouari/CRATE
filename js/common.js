
var IMAGE_MIME_REGEX = /^image\/(p?jpeg|gif|png)$/i;
var loadImage = function (file) {
    var reader = new FileReader();
    reader.onload = function(e){
        var img = document.createElement('img');
        img.src = e.target.result;
        var range = window.getSelection().getRangeAt(0);
        range.deleteContents();
        range.insertNode(img);
    };
    reader.readAsDataURL(file);
};

document.onpaste = function(e){
    var items = e.clipboardData.items;

    for (var i = 0; i < items.length; i++) {
        if (IMAGE_MIME_REGEX.test(items[i].type)) {
            loadImage(items[i].getAsFile());
            return;
        }
    }

    // Normal paste handling here
}



// Profile
jQuery('#generate-profile').click(function() {
  generateID()
});

function generateID() {
  const Marker=Crate.Marker
  const id = Crate.getRandomId()
  const pseudoName = Crate.Marker.getPseudoname(id)

  jQuery('#photo-profile').html(Marker.getAvatar(id));
  jQuery('#id-profile').val(id);
  jQuery('#pseudonym-profile').val(pseudoName);

  store.set('myId', {
    id: id,
    pseudo: Marker.getPseudoname(pseudoName)
  });

}

jQuery('#save-profile').click(function() {
  console.log("save-profile");
  _id = jQuery('#id-profile').val();
  _pseudo = jQuery('#pseudonym-profile').val();
  store.set('myId', {
    id: _id,
    pseudo: _pseudo
  });
$('#profile').collapse('toggle')
});

function loadID() {
  const Marker=Crate.Marker
  if (store.get('myId')) {
    my = store.get('myId');
    jQuery('#photo-profile').html(Marker.getAvatar(my.id));
    jQuery('#id-profile').val(my.id);
    jQuery('#pseudonym-profile').val(my.pseudo);
  } else {
    generateID()
  }
}

jQuery('#icon-profile').click(function() {
  loadID();
});

jQuery('#guidMe').click(function() {
 startTour()
});


jQuery('#icon-config').click(function() {
  jQuery('#signalingServer').val(configuration.signalingServer);
  jQuery('#storageServer').val(configuration.storageServer);
  jQuery('#stun').val(configuration.stun);

  $('#config').toggle();
});


jQuery('#save-config').click(function() {

  configuration.signalingServer = jQuery('#signalingServer').val();
  configuration.storageServer = jQuery('#storageServer').val();
  configuration.stun = jQuery('#stun').val();

  store.set(configName, configuration);

  $('#config').toggle();
});

// Mange content pages 
var pages = {};

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}



// Pages content
function getHTML(contentMD) {
  var converter = new showdown.Converter(),
    html = converter.makeHtml(contentMD);
  return html;
}


$(document).ready(function() {
  id = getParameterByName("id");
  $("#content").html(pages["#" + id]);
});



function addPage(id, contentMD) {
  pages[id] = `<div class="col-md-10 col-md-offset-1 text-justify markdown-body">${getHTML(contentMD)}</div>`;
}

about = `#Features



**CRATE** aims to enable collaborative editing anywhere, at anytime, whatever the
number of participants, without third party. Compared to Google Docs:
- **CRATE**  does not limit the number of simultaneous users,
- **CRATE**  does not rely on service providers, thus your documents belong to you and whom you trust.

> **Note:** **CRATE**  is still in its very early stage of development. Therefore, the
application may be buggy. Also, even basic functionalities are not implemented
yet. Feel free to [request functionalities, report issues, and ask
questions](https://github.com/nhaouari/CRATE/issues).`;



addPage("#about", about);


project = `CRATE is developed within two research projects: The CominLabs project
[DESCENT](http://www.descent.cominlabs.ueb.eu/) and the ANR project
[SocioPlug](http://socioplug.univ-nantes.fr/). 

The CRATE editor is mainly
developed by [GDD team](https://sites.google.com/site/gddlina/),
[LINA](https://www.lina.univ-nantes.fr/), [Nantes
University](http://www.univ-nantes.fr/)`;

addPage("#project", project);


publications = `
[1] Nédelec, B., Molli, P., Mostefaoui, A., & Desmontils, E. (2013,
September). [LSEQ: an adaptive structure for sequences in distributed
collaborative
editing](http://hal.univ-nantes.fr/docs/00/92/16/33/PDF/fp025-nedelec.pdf). <i>In
Proceedings of the 2013 ACM symposium on Document engineering (pp. 37-46).</i> ACM.

[2] Nédelec, B., Molli, P., Mostefaoui, A., & Desmontils,
E. (2013). [Concurrency effects over variable-size identifiers in distributed
collaborative
editing](https://hal.archives-ouvertes.fr/hal-00921655/document). <i>In
Document Changes: Modeling, Detection, Storage and Visualization (Vol. 1008,
pp. 0-7).</i>

[3] Nédelec, B., Tanke, J., Frey, D., Molli, P., Mostefaoui, A. (2015).
[Spray, an Adaptive Random Peer Sampling Protocol](https://hal.archives-ouvertes.fr/hal-01203363/file/spray.pdf). <i>Technical Report.</i>`;

addPage("#publications", publications);

contact = ``;

addPage("#contact", contact);



footer = `Developed by [**GDD team**](https://sites.google.com/site/gddlina/)

[**LS2N**](https://www.ls2n.fr) Lab

 2018
`;

$("#footer").html(getHTML(footer));


<Tippy
appendTo={el => el.parentNode}
interactive={true}
theme="light rounded"
arrow={true}
size="large"
arrowTransform="scale(2)"
distance={15}
interactiveBorder={20}
content={
  <div class="template" style={{ padding: '20px' }}>
    <img width="100" src={logo} />
    <h3>
      Look! The tippy logo is inside a <strong>tippy</strong>.
    </h3>
    <button
      class="btn"
      onclick={e => e.target.closest('.tippy-popper')._tippy.hide()}
    >
      Close
    </button>
  </div>
}
>