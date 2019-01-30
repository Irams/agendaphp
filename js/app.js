const formularioContactos = document.querySelector('#contacto'),
      listadoContactos    = document.querySelector('#listado-contactos tbody');

eventListeners();

function eventListeners(){
    //Cuando el formulario de crear o editar se ejecuta
    formularioContactos.addEventListener('submit', leerFormulario);

    //Listener para eliminar contacto
    listadoContactos.addEventListener('click', eliminarContacto);
}

function leerFormulario(e){
    e.preventDefault(); //Previene la ejecición por default

    //Leer los datos de los inputs
    const nombre = document.querySelector('#nombre').value,
          empresa = document.querySelector('#empresa').value,
          telefono = document.querySelector('#telefono').value,
          accion = document.querySelector('#accion').value;

    //validando los campos
    if(nombre === '' || empresa === '' || telefono ===''){
        //Dosparámetros: texto y clase
        mostrarNotificacion('Todos los campos  son obligatorios', 'error');
        
    }else {
        //Pasa la validadción, crear llamada a Ajax
        const infoContacto = new FormData();
        infoContacto.append('nombre', nombre);
        infoContacto.append('empresa', empresa);
        infoContacto.append('telefono', telefono);
        infoContacto.append('accion', accion);

        if(accion === 'crear'){
            //Crearemos un nuevo contacto
            insertarBD(infoContacto);
        }else{
            //Editar contacto
        }
    }  
}
//Inserta en la BD vía AJAX
function insertarBD(datos){
    //Llamado a ajax
    

    //Crear el objeto
    const xhr = new XMLHttpRequest();
    

    //Abrir la conexión
    xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);

    //pasar los datos
    xhr.onload = function(){
        if(this.status === 200){
            console.log(JSON.parse(xhr.responseText) );
            //Leemos la respuesta de PHP
            const respuesta = JSON.parse(xhr.responseText);

            //Inserta un nuevo elemento en la tabla
            const nuevoContacto = document.createElement('tr');

            nuevoContacto.innerHTML = `
                <td>${respuesta.datos.nombre}</td>
                <td>${respuesta.datos.empresa}</td>
                <td>${respuesta.datos.telefono }</td>
            `;
            //Crear contenedor para los botones
            const contenedorAcciones = document.createElement('td');

            //Crear el icono de editar
            const iconoEditar = document.createElement('i');
            iconoEditar.classList.add('far', 'fa-edit');

            //Crea el enlace para editar
            const btnEditar = document.createElement('a');
            btnEditar.appendChild(iconoEditar);
            btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
            btnEditar.classList.add('btn', 'btn-editar');

            //Agregando todo al padre (td)
            contenedorAcciones.appendChild(btnEditar);

            //Crear icono de eliminar
            const iconoEliminar = document.createElement('i');
            iconoEliminar.classList.add('fas', 'fa-trash-alt');
        
            //Crear el botón de eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.appendChild(iconoEliminar);
            btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
            btnEliminar.classList.add('btn', 'btn-borrar');

            //Agregarlo al padre
            contenedorAcciones.appendChild(btnEliminar);

             //Agregarlo al tr
             nuevoContacto.appendChild(contenedorAcciones);

             //Agregarlo con los contactos
             listadoContactos.appendChild(nuevoContacto); 

             //Resetear el formulario
            document.querySelector('form').reset();

             //Mostrar la notificación
             mostrarNotificacion('Contacto creado correctamente', 'correcto');
             
        }
    }

    //Enviar los datos
    xhr.send(datos);
}
//Eliminar el contacto
function eliminarContacto(e){
    if (e.target.parentElement.classList.contains('btn-borrar') ) {
    //console.log('Diste click');
    //tomar Id
    const id = e.target.parentElement.getAttribute('data-id');
    //console.log(id);
    //Preguntamos al usuario
    const respuesta = confirm('¿Estás seguro(a)?');
    if(respuesta){
        //Llamado a Ajax
        //Crear el objeto
        const xhrEliminar = new XMLHttpRequest();

        //Abrir la conexión
        xhrEliminar.open('GET', `inc/modelos/modelo-contactos.php?id=${id}&accion=borrar`, true);

        //Leer la respuesta
        xhrEliminar.onload = function() {
            if(this.status === 200){
                const resultado = JSON.parse(xhrEliminar.responseText);

                //console.log(resultado);
                if(resultado.respuesta === 'correcto'){
                    //Eliminar el registro del DOM
                    console.log(e.target.parentElement.parentElement.parentElement);
                    e.target.parentElement.parentElement.parentElement.remove();
                    //Mostrar notificación de eliminado
                    mostrarNotificacion('Contacto eliminado', 'correcto');
                } else{
                    //Mostramos una notificación
                    mostrarNotificacion('Hubo un error...', 'error');
                }
                
            }
        }

        //Enviar los datos
        xhrEliminar.send();
    }
    
    }
    
    
}


//Notificación en pantalla
function mostrarNotificacion(mensaje, clase){
    const notificacion = document.createElement('div');                  //Crea un div
    notificacion.classList.add(clase, 'notificacion', 'sombra');         //Agrega las clases al div creado
    notificacion.textContent = mensaje;         

    //Formulario
    formularioContactos.insertBefore(notificacion, document.querySelector('form legend')); //posiciona el div creado antes del <legend>

    //Ocultar y mostrar la notificacion
    setTimeout(() => {
        notificacion.classList.add('visible');

        setTimeout(() => {
            notificacion.classList.remove('visible');
            setTimeout(() => {
                notificacion.remove();
            }, 500);
        }, 3000);
    }, 100);
}