window.onload = iniciar;
var datosB;
var ref;
var tablaC;
var loQueEditar;
var modo = true;

function iniciar() {
    datosB= document.getElementById("datos");
    datosB.addEventListener("submit",enviarDatos,false);
    tablaC = document.getElementById("mostrarTabla");
    ref = firebase.database().ref().child("datos");
    mostrarDatos();
}

function mostrarDatos() {
    ref.on("value",function(snap) {
        var datos = snap.val();
        var filasMostrar="";
        for (var key in datos) {
           filasMostrar += "<tr>" + 
                                "<td>" + datos[key].nombre + "</td>" +
                                "<td>" + datos[key].apellido + "</td>" +
                                "<td>" + datos[key].edad + "</td>" +
                                "<td>" +
                                  '<button class="editar" regEditar="' + key + '">' +
                                  '<i class="material-icons blue-text">edit</i>' +
                                '</button>' +
                                "</td>" +
                                '<td>' +
                                '<button class="borrar" regBorrar="' + key + '">' +
                                  '<i class="material-icons red-text">delete</i>' +
                                '</button>' +
                                '</td>' +
                            "</tr>";
            
        }
    tablaC.innerHTML= filasMostrar;
    if (filasMostrar != "") {
        var elemEditar = document.getElementsByClassName("editar");
        for (var j = 0; j < elemEditar.length; j++) {
            elemEditar[j].addEventListener("click", editarDatos, false);
        }

        var elemBorrar = document.getElementsByClassName("borrar");
        for (var i = 0; i < elemBorrar.length; i++) {
            elemBorrar[i].addEventListener("click", borrarDatos, false);
        }
    }
    });
}

function editarDatos() {
    var queEditar = this.getAttribute("regEditar");
    loQueEditar = ref.child(queEditar);
    loQueEditar.once("value", function(snap) {
       var d = snap.val();
       document.getElementById("nombre").value = d.nombre;
       document.getElementById("apellido").value = d.apellido;
       document.getElementById("edad").value = d.edad;
    });
    modo = false
}

function borrarDatos() {
    var queBorrar = this.getAttribute("regBorrar");
    var loQueBorrar = ref.child(queBorrar);
    loQueBorrar.remove();
    
}

function enviarDatos(event) {
    event.preventDefault();
    switch (modo) {
        case true:
            ref.push({
            nombre: event.target.nombre.value,
            apellido: event.target.apellido.value,
            edad: event.target.edad.value
            
            });
            modo = true;
            break;
    
        case false:
            loQueEditar.update({
            nombre: event.target.nombre.value,
            apellido: event.target.apellido.value,
            edad: event.target.edad.value

            });
            break;
    }


    datosB.reset();
}