# 10.4 - Tests de integración con supertest

La API entera —rutas, middleware de autenticación, controller y `errorHandler`— probada con requests de verdad. **Sin base de datos y sin ocupar el puerto 3000.**

```bash
npm install
npm test                 # once tests de integración
npm run test:cobertura   # los mismos, con el reporte de cobertura
npm run dev              # la API a mano, para comparar con productos.http
```

## Qué agrega sobre el 10.2

El [10.2](../10.2-service-inyeccion/) probó el service aislado. Quedaron afuera cosas que ningún test de service puede ver, porque no viven en el service:

- ¿La ruta quedó registrada en `/api/productos` o en `/api/producto`?
- ¿El `POST` pide token? ¿El `GET` lo pide sin querer?
- ¿El `ForbiddenError` sale como **403** o como **500**?
- ¿El body llega parseado, o alguien se olvidó `express.json()`?
- ¿El `DELETE` contesta 204 y sin cuerpo?
- ¿El `id` de la URL llega al service como número o como el string `"42"`?

Todo eso es **cableado**, y el cableado se rompe seguido. Un `errorHandler` al que le falta una rama devuelve 500 con la suite de services entera en verde.

## Las dos modificaciones que pide supertest

**1. `app.ts` no llama a `listen()`.** Define la app y la exporta; el `listen` vive en [server.ts](src/server.ts). supertest levanta el servidor él mismo en un puerto libre por request y lo cierra al terminar. Si `app.ts` ya estuviera escuchando en el 3000, dos tests en paralelo chocarían con `EADDRINUSE`.

**2. La app se construye, no se importa.** `crearApp(service)` recibe el service, que en el test es falso. Es la misma inyección del 10.2, un piso más arriba.

Las dos son buenas ideas aunque no testees: separar *definir* de *escuchar* sirve igual en producción.

## Lo que sí es real en estos tests

El middleware de autenticación **no está mockeado**. El test firma un token de verdad con `emitirToken` y lo manda en el header, igual que lo haría el front:

```ts
const tokenDeJuan = emitirToken({ sub: '7', email: 'juan@utn.edu.ar', rol: 'usuario' });

const res = await request(app)
  .post('/api/productos')
  .set('Authorization', `Bearer ${tokenDeJuan}`)
  .send({ nombre: 'Mate', precio: 5000 });

expect(res.status).toBe(201);
```

Por eso hay un test con un token firmado con **otro secret**, que tiene que dar 401. Ese es el ataque, no el olvido: verifica que se chequee la firma y no solamente que el header exista.

## La cobertura, y por qué el número miente

`npm run test:cobertura` sobre estos once tests:

```
--------------------------|---------|----------|---------|---------|-------------------
File                      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------------|---------|----------|---------|---------|-------------------
All files                 |   94.23 |    91.66 |     100 |   94.23 |
  app.ts                  |     100 |      100 |     100 |     100 |
  productos.controller.ts |   93.33 |      100 |     100 |   93.33 | 12
  autenticar.ts           |     100 |      100 |     100 |     100 |
  productos.routes.ts     |     100 |      100 |     100 |     100 |
  errorHandler.ts         |   86.66 |     87.5 |     100 |   86.66 | 44-45
  jwt.ts                  |     100 |      100 |     100 |     100 |
--------------------------|---------|----------|---------|---------|-------------------
```

94% suena a mucho. Dos lecturas, y la segunda es la importante.

**Las líneas que faltan son las correctas.** La 44-45 del `errorHandler` es la rama del 500: el error que no reconocemos. Provocarla adrede pide fabricar un fallo inesperado, y como test aporta poco. Está bien que ese 6% quede sin cubrir, y saber *cuál* es el 6% vale mucho más que el 94.

**Faltan archivos enteros en la tabla.** No están `productos.service.ts`, ni `productos.repository.ts`, ni `server.ts`. Jest solo mide los archivos que los tests **importaron**, y estos usan un service falso. O sea: un archivo sin ningún test no baja el porcentaje — directamente no aparece.

Es el motivo por el que la cobertura sirve para **encontrar lo que no probaste**, leyendo la columna de líneas descubiertas, y no como nota. Un 100% se consigue ejecutando todas las líneas sin afirmar nada:

```ts
it('anda', async () => {
  await request(app).get('/api/productos');   // 100% de cobertura, cero valor
});
```

Ese test pasa aunque la API devuelva basura. La cobertura mide qué código **se ejecutó**, no qué código **se verificó**.

## La comparación que cierra la unidad

Abrí [productos.http](productos.http) al lado de [src/app.test.ts](src/app.test.ts). Son los mismos casos:

| | `.http` | `app.test.ts` |
| --- | --- | --- |
| Cómo corre | uno por uno, con el mouse | `npm test` |
| Quién verifica | vos, mirando | `expect` |
| Cuánto tarda | unos minutos | dos segundos |
| Qué pasa dentro de tres meses | nadie se acuerda de correrlo | corre igual, y avisa |

El `.http` no desaparece: sigue siendo lo mejor para explorar mientras escribís. Lo que cambia es que deja de ser **la única prueba de que la API anda**.

## Lo que este ejemplo no hace

Los tests siguen sin tocar la base. El escalón que falta —levantar un MySQL de prueba, correr la API contra él y limpiarlo entre test y test— existe, es lo que se llama *test de integración con base real*, y necesita Docker y un rato de configuración. Con lo de esta unidad ya se cubre lo que rompe el 90% de las veces.
