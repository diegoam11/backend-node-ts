## ✅ Conocimientos Aplicados

* ✅ MongoDB
* ✅ TypeScript
* ✅ ExpressJS
* ✅ GraphQL

También:

* ✅ React
* ✅ Tailwind
* ✅ Jest
* ✅ Nginx
* ✅ PM2

---

## ✅ Descripción

Los usuarios cliente pueden cargar productos vinculados a sus cuentas. Luego, pueden listar y/o buscar productos, visualizando también el detalle de la cuenta asociada a cada producto.

Este proyecto está conectado a dos bases de datos: **eiAccounts** y **eiProducts**.

---

## ✅ Tareas Completadas

### A. Cuentas

* ✅ Mutación para agregar una cuenta cliente.
* ✅ Query para listar cuentas con **paginación** y **búsqueda por nombre/email** utilizando `aggregate` de Mongoose.

### B. Productos

* ✅ Mutación para agregar un array de productos (asociados a una cuenta cliente).
* ✅ Query para listar productos con **paginación** y **búsqueda por nombre/sku** utilizando `aggregate` de Mongoose.
* ✅ Campo `account` agregado al schema de Producto para retornar el detalle de la cuenta asociada.

> 💡 Se utilizaron **enums**, **types en root**, **validaciones** en queries y mutaciones, y se estructuró el proyecto con carpetas **utils** y **helpers**.

## ✅ Mejoras Implementadas

* ✅ ESLint integrado.
* ✅ Prettier integrado.
* ✅ Tests unitarios agregados.

> 🧪 Se crearon bases de datos separadas para testing (`eiAccountsTest` y `eiProductsTest`). Se usó `Jest` como framework de testing, y las variables de entorno se colocaron en el archivo `.env.test`. Para ejecutar los tests se utiliza el siguiente comando:

```bash
npm run test
```

Tener en cuenta que el archivo `env.test` actualmente está con las URLs de las bases de datos de test que están desplegadas:

```env
MONGODB_URL_ACCOUNTS_TEST=mongodb://equip:BackendChallenge@damdev.site:27017/eiAccountsTest
MONGODB_URL_PRODUCTS_TEST=mongodb://equip:BackendChallenge@damdev.site:27017/eiProductsTest
```

Para ejecutarlas utilizando una base de datos local, las URLs deberían ser:

```env
MONGODB_URL_ACCOUNTS_TEST=mongodb://equip:BackendChallenge@localhost:27017/eiAccountsTest
MONGODB_URL_PRODUCTS_TEST=mongodb://equip:BackendChallenge@localhost:27017/eiProductsTest
```

Al ejecutar `npm run test`, se muestra por consola el resultado, pero también se genera un reporte en `.html` que se guarda en la raíz del proyecto como `test-report.html`. Se puede abrir este archivo y visualizar de mejor manera los resultados de los tests.

---

## 🛠 Cómo Correr el Proyecto Localmente

### Backend (API GraphQL)

1. Clonar el repositorio y posicionarse en la raíz del proyecto.

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Debes asegurarte de que el archivo `.env` esté configurado con las variables locales:

   ```env
   MONGODB_URL_ACCOUNTS=mongodb://equip:BackendChallenge@localhost:27017/eiAccounts
   MONGODB_URL_PRODUCTS=mongodb://equip:BackendChallenge@localhost:27017/eiProducts

   MONGODB_URL_ACCOUNTS_TEST=mongodb://equip:BackendChallenge@localhost:27017/eiAccountsTest
   MONGODB_URL_PRODUCTS_TEST=mongodb://equip:BackendChallenge@localhost:27017/eiProductsTest
   ```

   Actualmente el archivo `.env` contiene URLs del entorno desplegado:

   ```env
   MONGODB_URL_ACCOUNTS=mongodb://equip:BackendChallenge@damdev.site:27017/eiAccounts
   MONGODB_URL_PRODUCTS=mongodb://equip:BackendChallenge@damdev.site:27017/eiProducts
   MONGODB_URL_ACCOUNTS_TEST=mongodb://equip:BackendChallenge@damdev.site:27017/eiAccountsTest
   MONGODB_URL_PRODUCTS_TEST=mongodb://equip:BackendChallenge@damdev.site:27017/eiProductsTest
   ```

4. Levantar el servidor local:

   ```bash
   npm run dev
   ```
   
   [`http://localhost:3000/api/graphql`](http://localhost:3000/api/graphql)

### Frontend (Vite + React)

1. Clonar el repositorio y posicionarse en la raíz del proyecto.

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Debes asegurarte de que el archivo `.env` esté apuntando al backend local:

   ```env
   VITE_GRAPHQL_API_URL=http://localhost:3000/api/graphql
   ```

   Actualmente el archivo `.env` contiene URLs del entorno desplegado:

   ```env
   VITE_GRAPHQL_API_URL=https://damdev.site/equip/api/graphql
   ```

4. Levantar el servidor de desarrollo:

   ```bash
   npm run dev
   ```
   [`http://localhost:3001/`](http://localhost:3001/)

---

## Diagrama de Contenedores (Diagrama General de la Solución)

![Diagrama de arquitectura](./diagramaEquip.drawio.png)


## 🚀 Despliegue

El sistema fue desplegado en un servidor Ubuntu (Droplet en DigitalOcean), utilizando **Nginx** como proxy inverso para servir tanto el frontend como el backend bajo un mismo dominio con HTTPS, gracias a **Certbot** (Let's Encrypt).

### 🔧 Infraestructura

* **Sistema operativo:** Ubuntu 22.04 LTS
* **Servidor web:** Nginx
* **SSL:** Certbot (Let's Encrypt)
* **Dominio principal:** `https://www.damdev.site`
* **Puerto expuesto:** 443 (HTTPS)

---

### 🌐 URLs del Proyecto

| Servicio                  | URL                                                                                                             |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Frontend                  | [`https://www.damdev.site/equip/`](https://www.damdev.site/equip/)                                              |
| Backend API/GraphQL Playground               | [`https://www.damdev.site/equip/api/graphql`](https://www.damdev.site/equip/api/graphql)                        |
| MongoDB eiAccounts        | `mongodb://equip:BackendChallenge@damdev.site:27017/eiAccounts`                                                 |
| MongoDB eiProducts        | `mongodb://equip:BackendChallenge@damdev.site:27017/eiProducts`                                                 |
| MongoDB eiAccounts (test) | `mongodb://equip:BackendChallenge@damdev.site:27017/eiAccountsTest`                                             |
| MongoDB eiProducts (test) | `mongodb://equip:BackendChallenge@damdev.site:27017/eiProductsTest`                                             |

---

### 📦 Pasos de Despliegue

De forma general, se siguieron los siguientes pasos:

1. Se creó un servidor Ubuntu 22.04 (Droplet en DigitalOcean) y se instalaron las herramientas necesarias, incluyendo `Node.js`, `npm` y `MongoDB (versión 7.0.20)`, junto con `mongosh (versión 2.5.0)`.
2. Se configuraron las bases de datos MongoDB en el servidor, creando cuatro instancias: dos para producción (eiAccounts y eiProducts) y dos para testing (eiAccountsTest y eiProductsTest). Se creó un usuario llamado `equip` con la contraseña `BackendChallenge`, al cual se le asignaron los roles `readWrite` y `dbAdmin` sobre cada una de estas bases de datos.
3. Se clonaron los repositorios del backend y frontend en el servidor, dentro del directorio `/var/www/`.
4. Se instalaron las dependencias para ambos proyectos, tanto backend como frontend.
5. Se construyeron tanto el backend como el frontend en modo producción.
6. Se configuró un archivo de `Nginx` que permite servir el frontend desde la ruta `/equip/` y redirige las solicitudes a `/equip/api/` hacia el backend (Express).
7. Se utilizó `Certbot (Let's Encrypt)` para habilitar HTTPS sobre el dominio `damdev.site`.
8. El backend fue levantado y mantenido en segundo plano usando `PM2`, asegurando su persistencia ante reinicios.
9. Finalmente, se validó la conexión de las aplicaciones con las bases de datos MongoDB desplegadas, asegurando que tanto en producción como en testing los entornos funcionaran correctamente.
