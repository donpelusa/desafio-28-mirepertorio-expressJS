## Desafío - Mi repertorio
desafioLatam nro 28: ExpressJS. Mi Repertorio

La escuela de música “E-Sueño” está motivando a sus estudiantes de canto a presentarse en vivo y se puso en contacto con el restaurante del sector para utilizar su tarima e iniciar un calendario de presentaciones. Para conocer y gestionar las canciones que cantarán sus estudiantes, la escuela contrató a un desarrollador freelance para la creación de una aplicación tipo CRUD.

#### Descripción

En este desafío deberás desarrollar un servidor con Express que utilice el módulo File System para agregar, modificar y eliminar canciones almacenadas en un JSON local llamado repertorio.json.
El servidor deberá disponibilizar las siguientes rutas:

    ● POST /canciones : Recibe los datos correspondientes a una canción y la agrega al repertorio.
    ● GET /canciones : Devuelve un JSON con las canciones registradas en el repertorio
    ● PUT /canciones/:id : Recibe los datos de una canción que se desea editar y la actualiza manipulando el JSON local.
    ● DELETE /canciones/:id : Recibe por queryString el id de una canción y la elimina del repertorio.

Tienes a disposición un Apoyo Desafío - Mi Repertorio con la aplicación cliente que se muestra en la siguiente imagen, lista para el consumo de estas rutas, por lo que deberás enfocarte solo en el desarrollo backend.

<p style="text-align:center;">
    <img src="https://github.com/user-attachments/assets/4cd921cb-5ff8-4f87-a251-c25ea746d693"></br>
    <b>Imagen 1. Aplicación Mi repertorio</b> </br>
    <i>Fuente: Desafío Latam</i>
</p>

#### Requerimientos

    1. Levantar un servidor local usando Express Js
    2. Devolver una página web como respuesta a una consulta GET
    3. Ofrecer diferentes rutas con diferentes métodos HTTP que permitan las operaciones CRUD de datos alojados en un archivo JSON local
    4. Manipular los parámetros obtenidos en la URL
    5. Manipular el payload de una consulta HTTP al servidor


#### Forma de uso

    1. Clona el repositorio a una carpeta local a través de GIT
    2. Entra por terminal a la carpeta "backend"
    3. Instala las dependencias con "npm install"
    4. Ejecuta "npm run dev" para levantar el backend. Ambos servicios correrán en http://localhost:5000/
