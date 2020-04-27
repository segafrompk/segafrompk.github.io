var form = document.querySelector('.formular-celi');
var fileSelect = document.getElementById('cvdokument');
var statusDiv = document.getElementById('cvstatus');
var formular = {
    ime: document.getElementById('ime'),
    prezime: document.getElementById('prezime'),
    broj: document.getElementById('broj'),
    email: document.getElementById('email'),
    zasto: document.getElementById('zasto')
}

var submitDugme = document.querySelector('.posaljiFormular');

var resetFormular;
var poljaZaPopunjavanje = document.querySelector('.formular');

// Get the modal
var modal = document.getElementById("posaljiCV");

// Get the button that opens the modal
var btn = document.querySelector(".modalButton");

// Get the <span> element that closes the modal
var span = document.querySelector(".zatvori");

var modalSadrzaj = modal.querySelector('.modal-sadrzaj');

// When the user clicks the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modalSadrzaj.classList.add('modal-sadrzaj-izlaz');
    modal.classList.add('modal-izlaz');
    setTimeout(() => {
        modal.style.display = "none";
        modalSadrzaj.classList.remove('modal-sadrzaj-izlaz');
        modal.classList.remove('modal-izlaz');
    }, 350);

    if (resetFormular) {
        poljaZaPopunjavanje.style = "";
        submitDugme.style = "";
        statusDiv.className = "";
        statusDiv.innerHTML = "";
        formular.ime.value = "";
        formular.prezime.value = "";
        formular.broj.value = "";
        formular.email.value = "";
        formular.zasto.value = "";
        fileSelect.value = "";
    }
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    // modalSadrzaj.classList.add('modal-sadrzaj-izlaz');
    // modal.classList.add('modal-izlaz');
    // setTimeout(() => {
    //   modal.style.display = "none";
    //   modalSadrzaj.classList.remove('modal-sadrzaj-izlaz');
    //   modal.classList.remove('modal-izlaz');
    // }, 350);
    this.span.click();
  }
}

document.addEventListener("DOMContentLoaded", function() {
  var elements = document.querySelectorAll(".formularPolja");
  for (var i = 0; i < elements.length; i++) {
    elements[i].oninvalid = function(e) {
      e.target.setCustomValidity("");
      if (!e.target.validity.valid) {
        switch(e.target.id) {
          case "ime":
            e.target.setCustomValidity("Molimo unesite Vaše ime (latinicom, samo slova su dozvoljena)");
            break;
          case "prezime":
            e.target.setCustomValidity("Molimo unesite Vaše prezime (latinicom, samo slova su dozvoljena)");
            break;
          case "broj":
            e.target.setCustomValidity("Molimo unesite Vaš broj telefona bez razmaka ili crtica u formatu: +381631111111, 381631111111 ili 0631111111");
            break;
          case "email":
            e.target.setCustomValidity("Molimo unesite Vašu validnu e-mail adresu");
            break;
          case "cvdokument":
            e.target.setCustomValidity("Molimo priložite Vaš CV u obliku pdf, doc ili docx fajla");
            break;
          case "zasto":
            e.target.setCustomValidity("Molimo napišite zašto smatrate da treba da dobijete posao");
            break;
          default:
            e.target.setCustomValidity("Ovo polje ne sme ostati prazno!");
            break;
        }
      }
    };
    elements[i].oninput = function(e) {
      e.target.setCustomValidity("");
    };
  }
})

form.onsubmit = function(event) {
    event.preventDefault();
    
    statusDiv.className = 'show-cv-status';
    statusDiv.innerHTML = 'Slanje u toku . . . ';

    var file = fileSelect.files[0];

    // Create a FormData object.
    var formData = new FormData();

    var acceptedFileTypes = /(application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document|application\/pdf)/;
    //Check the file type.
    if (file) {
        if (!file.type.match(acceptedFileTypes)) {
            statusDiv.classList.add('cvstatus-error');
            statusDiv.innerHTML = 'Greška! Priloženi fajl nije u formatu PDF, DOC ili DOCX.';
            return;
        }

        var extension;

        switch(file.type) {
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                extension = ".docx";
                break;
            case "application/msword":
                extension = ".doc";
                break;
            case "application/pdf":
                extension = ".pdf";
                break;
            default:
                break;
        }

        if (file.size >= 2097152) {
            statusDiv.classList.add('cvstatus-error');
            statusDiv.innerHTML = 'Priloženi fajl ne sme biti veći od 2 MB.';
            return;
        }

        formData.append('mojCV', file, formular.ime.value+formular.prezime.value+extension);
    }

        // Add the file to the AJAX request.
    formData.append('ime', formular.ime.value);
    formData.append('prezime', formular.prezime.value);
    formData.append('broj', formular.broj.value);
    formData.append('email', formular.email.value);
    formData.append('zasto', formular.zasto.value);

    // Set up the request.
    var xhr = new XMLHttpRequest();

    // Open the connection.
    xhr.open('POST', 'karijera.php', true);


    // Set up a handler for when the task for the request is complete.
    xhr.onload = () => {
        if (xhr.status === 200) {
            statusDiv.classList.add('cvstatus-success');
            statusDiv.innerHTML = 'Slanje je bilo uspešno!';

            poljaZaPopunjavanje.classList.add('fomularIzlaz');
            submitDugme.classList.add('fomularIzlaz');
            setTimeout(() => {
                poljaZaPopunjavanje.style.display = "none";
                submitDugme.style.display = "none";
                poljaZaPopunjavanje.classList.remove('fomularIzlaz');
                submitDugme.classList.remove('fomularIzlaz');
            }, 350);
            resetFormular = true;
        } else {
            var responseObject = null;
            statusDiv.classList.add('cvstatus-error');

            try {
                responseObject = JSON.parse(xhr.responseText);

                statusDiv.innerHTML = '';
                let spisakGresaka = document.createElement('ul');
                for (let i = 0; i < responseObject.length; i++) {
                    let greska = document.createElement('li');
                    greska.textContent = responseObject[i];
                    spisakGresaka.appendChild(greska);
                }

                statusDiv.appendChild(spisakGresaka);
            } catch (e) {
                statusDiv.innerHTML = "Desila se greška pri obradi odgovora servera. Neka od polja koja ste popunili nisu validna.";
            }
        }
    };

    // Send the data.
    xhr.send(formData);
}