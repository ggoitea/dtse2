# DTSE

Es una aplicación dedicada al turismo, en la que tendremos marcado sitios (lugares de interese) dentro de nodos (básicamente los departamentos de la provincia de santiago del estero)

- Un sitio: puede ser una plaza, un hotel , una universidad,
- Un evento: es un acontecimiento que se realizara puede realizar en un sitio o si no tiene sitio el mismo evento es un sitio temporal hasta que paso el evento
- Paquetes turístico: para los eventos se pueden crear paquetes turísticos (esta es la parte comercial donde ofrecemos por ejemplo estadias con cierto recorridos)

Roles de usuario

- Administrador: Acceso total
- Colaborador: perteneces a nodos en particular
- visitante: usuarios registrados, que tienen un privilegeio mas como mas consultas con la IA , o puede haber contratado un pack de mensajes con la IA

## Estructura

### Archivos

> Modelo para relacionar los modelos que necesitan archivos adjuntar
> model: Archivo
> table: archivos

| columna        | tipo              | descripcion                                                                                                                   |
| -------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| id             | bigint            |                                                                                                                               |
| modelable_type | nullable morph    | nullable morph                                                                                                                |
| modelable_id   | nullable morph    |                                                                                                                               |
| nombre         | string            |                                                                                                                               |
| path           | string            |                                                                                                                               |
| mime_tipe      | string \|nullable |                                                                                                                               |
| default        | bool              | Se utiliza para cuando un modelo tiene multiples, la default seria la que se utiliza como portada por ejemplo si fuera imagen |
|                |                   |                                                                                                                               |

#### extras

- Crear un trait para manejar estas relaciones de los otros modelos con este, tiene uq haber dos relaciones, una que traiga toda la colección y otra relación que solo recupera la default

### Geo

> model: Departamento
> table: departamentos

| columna         | tipo   | descripcion |
| --------------- | ------ | ----------- |
| id              |        |             |
| asentamiento_id | string |             |
| nombre          | string |             |
|                 |        |             |

> model: Localidad
> table: localidades

| columna         | tipo                         | descripcion |
| --------------- | ---------------------------- | ----------- |
| id              | bigint                       |             |
| asentamiento_id | string                       |             |
| departamento_id | foreign \| delete on cascade |             |
| es_paraje       | boolean                      |             |
| nombre          | string                       |             |
| latitud         | string                       |             |
| longitud        | string                       |             |
|                 |                              |             |

### Sitios

> los sitios pertenecen a las localidades (Conocidas como nodos)
> model: Sitio
> table: sitios

| columna            | tipo                                                                                                                                                                                                                                                                                            | descripcion |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| id                 |                                                                                                                                                                                                                                                                                                 |             |
| localidad_id       | foreignId \| cascade ondelete                                                                                                                                                                                                                                                                   |             |
| nombre             | string                                                                                                                                                                                                                                                                                          |             |
| domicilio_calle    | string                                                                                                                                                                                                                                                                                          |             |
| domicilio_numero   | string                                                                                                                                                                                                                                                                                          |             |
| contacto_telefono  | string\|nullable                                                                                                                                                                                                                                                                                |             |
| contacto_email     | string\|nullable                                                                                                                                                                                                                                                                                |             |
| latitud            | string                                                                                                                                                                                                                                                                                          |             |
| longitud           | string                                                                                                                                                                                                                                                                                          |             |
| descripcion        | longtext \| nullable                                                                                                                                                                                                                                                                            |             |
| estado             | enum [ pendiente \| activo \| suspendido \| rechazado]                                                                                                                                                                                                                                          |             |
| creado_por_user_id | foreignId \| nullable \| null on delete                                                                                                                                                                                                                                                         |             |
| categoria          | enum [ interes_turistico \| alojamiento \| gastronomia \| estacion_servicio \| servicio_automotriz \| salud \| seguridad y emergencia \| terminales y transporte \| nformacion turistica \| compras \| recreacion y entretenimiento \| deporte \| naturaleza \| eventos \| servicios publicos ] |             |

- Consideraciones
    - este modelo se debe poder adjuntar imágenes

> Para relacionar con las redes sociales y webs
> model: SitioSocial
> table: sitio_sociales

| columna  | tipo                                                           | descripcion |
| -------- | -------------------------------------------------------------- | ----------- |
| id       |                                                                |             |
| sitio_id | foreignid \| delete on cascade                                 |             |
| tipo     | enum [ web \| youtube \| facebook \| instagram \| x \| tiktok] |             |
| url      | string                                                         |             |

> Para relacionar con las redes sociales y webs
> model: SitioApertura
> table: sitio_aperturas

| columna  | tipo                                                                            | descripcion      |
| -------- | ------------------------------------------------------------------------------- | ---------------- |
| id       |                                                                                 |                  |
| sitio_id |                                                                                 |                  |
| dia      | enum [ lunes \| martes \| miercoles \| jueves \| viernes \| sabado \| domingo ] |                  |
| apertura |                                                                                 | horario apertura |
| cierrte  |                                                                                 | horario cierre   |

### Eventos

> Los eventos se pueden definir en relacion a un sitio, por ejemplo hotel tanto, cena show tal dia a tal hora, o puede no estar relacionado a ningun sitio entonces se comporta el evento como un sitio temporal
> model: Evento
> table: eventos

| columna          | tipo                                                   | descripcion                               |
| ---------------- | ------------------------------------------------------ | ----------------------------------------- |
| id               |                                                        |                                           |
| localidad_id     | foreignid \| delete on cascade                         |                                           |
| sitio_id         | foreigid\|nullable \| null on delete                   |                                           |
| nombre           | string                                                 |                                           |
| desripcion       | longtext \| nullable                                   |                                           |
| fecha            | date                                                   |                                           |
| inicio           | time                                                   |                                           |
| fin              | time                                                   |                                           |
| domicilio_calle  | string                                                 | si tiene sitio son los mismo que el sitio |
| domicilio_numero | string                                                 | si tiene sitio son los mismo que el sitio |
| estado           | enum [ pendiente \| activo \| suspendido \| rechazado] |                                           |

- Consideraciones
    - este modelo se debe poder adjuntar imágenes

### Paquetes

> Paquetes turisticos es la parte comercial, donde ofreceremos paquetes para eventos o sitios
> model: PaqueteTuristico
> table: paquete_turistivos

| columna        | tipo                                                                       | descripcion |
| -------------- | -------------------------------------------------------------------------- | ----------- |
| id             |                                                                            |             |
| modelable_type | nullablemorph                                                              |             |
| modelable_id   | nullablemorph                                                              |             |
| nombre         | string                                                                     |             |
| descripcion    | longtext \|nullable                                                        |             |
| categoria      | enum [ aventura \| cultura \| relax \| familiar \| romantico \| negocios ] |             |
| destino        |                                                                            |             |
| duracion       |                                                                            |             |
| estado         | enum [ activo \| agotado \| suspendido \| cancelado ]                      |             |

- Consideraciones
    - este modelo se debe poder adjuntar imágenes

## General del sitio

### Roles

- roles que deben existir
    - Administrador: toda las acciones permitidas
    - Colaborador: pueden crear eventos y sitios, pero siempre con estado pendiente
    - usuario: solo pueden ver eventos, planes, paquetes, sitios. y le sumaremos privilegios como cantidad de consultas extras con la IA
- Crear seeder para crear esto rol, tener en cuenta que si ya exste no volver a crear

### Extras

- Crearemos una tabla extra que relacione la cantidad de consultas disponible con un usuairo en particular (serian como creditos para hacer consultas a la ia)
- table user_dato_personales , model UserDatoPersonal. esta tabla tendra informacion de contacto del personal, Celular, domicilio, solicitud embajador (un bool, para saber si solicito o no ser embajador), dni, y podra adjuntar los dni frente y dorso
- en la tabla user. agregaremos las columna google_id, google_token, google_refresh_token
- DatosPersonalMiddleware: este es un midleware que deveras crear, toda las rutas autenticadas deveran verificar si para un usuario la tabla _user_dato_personales esta completa, caso contrario redirigira a un formulario cautivo para completar esto y recien poder continuar
- crearemos una tabla guest_consultas_ia, aqui capturaremos el fingerprint del navegador y cantidad de consultas echas

## como trabajaremos:

trabjaremos por modulos dentro de la ruta app/Modules/{modulo}/
dentro tendremos los UseCases como fundamental, cada controlador le pegara directamente a los casos de uso

- los casos de uso llaman al modelo eloquent, pero que pasa si mas de un caso de uso necesita hacer exactamente la misma consulta, entonces dentro del modulo al mismo nivel que UseCases, creamos Queries, aqui dentro tendremos una clase con metodos estaticos de las queries comun, estas devuelven una query builder , no devuelve la colecction
- si mas de un caso de uso necesita ejecutar una misma accion de un modulo , se crearan los Services, entre modulos comparten los services

## FrontEnd

usamos i18n todas las vistas tendran español, ingles, portuguez, y quchua (quichua de santiago del estero)
defino mis vistas a continuacion

### Landing

> ruta raiz /
> sin proteccion"

#### Hero

tendra un Hero con el mensaje "Vivi la magia de santiago del estero" como tituclo, y como resumen " Descubre el corazon digital de santiago del estero, tu guia definitiva para eventos cultura , gastronomia, y los mejores destinos de la provincia" y los botones en el mismo hero "Comenzar" y otro boton "Descargar APP (debe aparecer si no esta instalado la PWA)"

#### Contadores

los clasicos contadores

- 27 Departamentos
- 165 Nodos
-   - 800 Sitios
- Infinita experiencia

#### ¿Que es DTSE?

texto : DTSE (Destino Turístico Santiago del Estero) no es solo una app, es tu portal personal a la provincia más antigua de Argentina. Hemos digitalizado cada rincón, desde las Termas de Río Hondo hasta el Puente Carretero, para brindarte una experiencia sin fricciones.
Nuestra misión es conectar a los viajeros con la cultura vibrante de Santiago a través de tecnología de vanguardia, asegurando que cada "chacarera" y cada paisaje esté a solo un toque de distancia.
item debajo con lo siguiente:
-Guía cultural completa y actualizada.
-Integracion cultural
-Mapa interactivo

#### Viaja de forma inteligente

texto: Herramientas diseñadas para que tu única preocupación sea disfrutar del sol santiagueño.

###

#### Información en Tiempo Real

textp: Recibe alertas sobre eventos en curso, clima y disponibilidad de servicios al instante.

#### Asistente virtual

contamos con Uritu nuestro asistente virtual con todo el conocimiento de la provincia

#### Contacto

formulario de contacto, tiene que ser simple nombre , telefono y consulta, todos campos requeridos,

- crear el backen de esto, para almacenar estos mensajes

### Novedaes

> cuando precionamos en la landin comenzar nos lleva a novedades
> Este es el primer boton el la barra footer de botones
> ruta /novedades
> ruta no protegida

- tendra un Hero con el mensaje Descubre tu proxima aentura y como sub mensaje "Encuentra experiencias seleccionados que se ajusten a tu perfil de viajero y a tu curiodidad"
- lugo tendra un buscador por abajo de este hero el clasico input con el boton buscar
- luego explorar por categorias (un filtro)
    - tendremos boton para explorar por las categorias de los sitios en una misma linea que se pueda deplazar en horizontal, tienen que ser cuadrados icono y abajo el nombre de la categoria
- luego el listado de sitios y eventos, segun lo filtrado arriba
- los sitios deben mostrar la imagen default, si tiene asociado un evento mostrar un boton proximo 20dias por ejemplo
- los sitios si tienen packete turistico un boton ver paquetes

### Mapa

> Este es un mapa interactivo donde nos aparecera los sitios
> ruta no protegida
> ruta /sitios

- devemos capturar la ubicacion del dispositivo para marcar donde estamos , luego ir ampliando el radio en el que estamos hasta encontrar lso primeros 20 sitios,
- utilizaremos react-leaflet para el mapa
-
