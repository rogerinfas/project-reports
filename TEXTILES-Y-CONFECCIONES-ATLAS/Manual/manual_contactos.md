# Manual de Usuario Corporativo: Módulo de Contactos y Chatter en Odoo

Este manual explica detalladamente cómo buscar, organizar y comunicarse con sus clientes en Odoo. Está diseñado para personas sin experiencia previa en sistemas.

---

## 1. Módulo de Contactos: Organizar y Filtrar Clientes

El módulo **Contactos** es la agenda central del negocio. Aquí no solo guardamos datos básicos, sino que también podemos buscarlos de forma inteligente para no perder tiempo.

### 1.1 ¿Cómo Buscar Clientes rápidamente?
1. En la parte superior derecha de la pantalla de Contactos verás una barra con una pequeña lupa.
2. Haz clic dentro de esta barra de búsqueda.
3. Escribe lo que buscas (por ejemplo: el nombre de la empresa, el RUC o el teléfono).
4. Presiona **Enter** y la pantalla ocultará temporalmente a los demás clientes, mostrando solo el que escribiste.

![Barra de Búsqueda y Filtros](images/contactos_busqueda_filtros.png)
*Figura 1.1: Barra de búsqueda superior para encontrar clientes por nombre, RUC o datos de contacto.*

---

### 1.2 Uso de Filtros y Agrupadores (Ordenar a tus clientes)
Para segmentar a tu cliente rápidamente sin tener que buscar uno por uno:
1. Haz clic en el botón **Filtros** que está justo debajo de la barra de búsqueda.
   * *Ejemplo de uso:* Si solo quieres ver a las empresas registradas (personas jurídicas) y ocultar a las personas naturales, selecciona el filtro **Compañías**.
2. Haz clic en **Agrupar por**:
   * *Ejemplo de uso:* Si tienes clientes en distintos departamentos del Perú y deseas ordenarlos visualmente por su ubicación, haz clic en **País/Estado** o **Ciudad**. Odoo los dividirá de forma ordenada en bloques agrupados.

---

### 1.3 Cambiar de Vistas (Tarjetas vs. Tablas)
En la parte superior derecha verás tres pequeños botones para cambiar la forma en que se muestra la información:
* **Vista Kanban (Tarjetas):** Muestra cada cliente en un recuadro individual con su foto y datos rápidos (Ideal para uso táctil en tablets).
* **Vista Lista (Tabla):** Muestra a los clientes en una tabla compacta como una hoja de Excel. Es la mejor opción cuando necesitas comparar datos rápidamente.
* **Vista Mapa:** Muestra la ubicación geográfica del cliente en Google Maps (si rellenó la dirección correcta).

![Cambio de Vistas](images/contactos_cambio_vistas.png)
*Figura 1.2: Botones para alternar entre las vistas Kanban (tarjetas) y Lista (tabla) en Odoo.*

---

## 2. El Chatter: El Historial y Centro de Mensajería de Odoo

El **Chatter** (sección de comunicación) es una de las herramientas más importantes de Odoo. Se encuentra en el lateral derecho (o al final de la página si usa pantallas pequeñas) de **todas las fichas** de Odoo (Contactos, Ventas, Inventario, etc.).

Sirve como una bitácora o cuaderno de notas donde se registra todo lo que pasa con ese cliente para que cualquier trabajador del negocio esté enterado.

![Chatter en la Ficha del Cliente](images/contactos_chatter.png)
*Figura 2.1: Panel del Chatter en el costado derecho de la ficha del contacto.*

### 2.1 Enviar Mensaje (Comunicación Directa)
* **¿Para qué sirve?:** Para enviar correos electrónicos al cliente directamente desde Odoo, sin abrir Outlook o Gmail.
* **¿Cómo se hace?:**
  1. Haz clic en **Enviar mensaje**.
  2. Escribe tu texto.
  3. Haz clic en **Enviar**. El cliente recibirá el correo y si responde, su respuesta aparecerá automáticamente en esta misma sección.

### 2.2 Poner Nota (Bitácora Interna)
* **¿Para qué sirve?:** Para apuntar cosas importantes sobre el cliente que solo tus compañeros de trabajo deben ver (el cliente NO recibe correos de estas notas).
* **¿Cómo se hace?:**
  1. Haz clic en **Poner nota**.
  2. Escribe datos útiles como: *"Este cliente prefiere que le enviemos las cotizaciones los martes por la mañana"* o *"Llamó para quejarse sobre un retraso en la entrega"*.
  3. Haz clic en **Registrar nota**.

### 2.3 Planificar Actividad (Recordatorios)
* **¿Para qué sirve?:** Para que Odoo te recuerde hacer una tarea con el cliente (Llamarlo, enviarle una cotización, realizar una visita) en una fecha específica.
* **¿Cómo se hace?:**
  1. Haz clic en **Planificar actividad** (icono de reloj).
  2. Selecciona el tipo de actividad (ej. *Llamar*).
  3. Coloca la fecha límite y una descripción rápida.
  4. Haz clic en **Planificar**. Odoo te enviará una alerta en la mañana del día acordado para recordártelo.
