# 10.3 - Mockear el módulo, sin tocar el service

Los mismos tests del [10.2](../10.2-service-inyeccion/), sobre el service **exactamente como está escrito en el 9.3**: con su `import * as repo` soldado arriba de todo.

```bash
npm install
npm test
```

## Cuándo se usa esto

El 10.2 pide cambiar el código de producción. Es la mejor opción cuando se puede, pero no siempre se puede:

- El TP ya está escrito así y faltan dos semanas para la entrega.
- El código es de otro equipo, o de una librería.
- Hay que testear algo que se importa en veinte archivos y refactorizar es un proyecto aparte.

En esos casos se deja el service quieto y se le cambia el repository **por debajo**: cuando pida ese módulo, Jest le entrega otro.

## Los tres pasos, en este orden

```ts
// 1. El módulo falso: las mismas claves que exporta el original.
const repo = {
  findById: jest.fn<typeof RepoModule.findById>(),
  // ...
};

// 2. Registrarlo.
jest.unstable_mockModule('../repositories/productos.repository.js', () => repo);

// 3. RECIÉN AHORA importar el service. Dinámico, nunca arriba del archivo.
const { crearProducto, eliminarProducto } = await import('./productos.service.js');
```

El paso 3 es el que sorprende, y tiene una explicación que vale entender porque es la misma razón por la que ESM se comporta distinto en todo lo demás:

**En CommonJS**, `jest.mock()` se *hoistea*: Jest reescribe el archivo al compilarlo y mueve esa llamada arriba de todos los `require`. Por eso en los tutoriales aparece en el medio del archivo y funciona igual.

**En ESM eso es imposible.** Los `import` se resuelven *antes* de que corra la primera línea del archivo — es parte de la definición del formato. Si el service estuviera importado arriba con un `import` normal, ya se habría cargado con el repository de verdad y el mock llegaría tarde. Por eso la importación tiene que ser dinámica y estar *después* del registro.

El `await` suelto en el cuerpo del archivo (top-level await) funciona porque esto es un módulo ESM. Es la misma razón por la que venimos escribiendo `.js` en los imports desde la unidad 7.

## El error que vas a cometer

Copiar de un tutorial esto:

```ts
jest.mock('../repositories/productos.repository.js', () => ({ /* ... */ }));
import { crearProducto } from './productos.service.js';
```

En un proyecto ESM, **`jest.mock()` no intercepta nada**. Y no avisa: no tira error, no imprime un warning. El test corre contra el repository de verdad, que en el 9.3 significa contra MySQL. Si la base no está andando, el mensaje que ves es:

```
● crearProducto › guarda el producto cuando el nombre está libre

  connect ECONNREFUSED 127.0.0.1:3306
```

Un error de conexión en un test que "estaba mockeado". Cuando veas eso, el problema no es la base: es que el mock nunca se aplicó.

## Sobre el nombre `unstable_`

Es del propio Jest y significa que la API puede cambiar. Está así desde 2021 y es la forma oficial de mockear módulos ESM, así que se usa igual. Que el nombre incomode es apropiado: **el 10.2 es el camino recomendado**, y este es la salida cuando el otro no está disponible.

## La comparación, que es el punto de la unidad

| | [10.2](../10.2-service-inyeccion/) — inyección | 10.3 — mock de módulo |
| --- | --- | --- |
| Código de producción | hay que cambiarlo | queda igual |
| El test | se lee solo | tres pasos de andamiaje, y el orden importa |
| Si cambia la firma del repo | no compila, te enterás al toque | compila, y el mock queda mintiendo |
| Acoplamiento | el service no sabe quién lo cumple | el test conoce la ruta interna del import |
| Cuándo | siempre que se pueda | cuando no se puede tocar el código |

La última fila del medio es la que más duele en la práctica: un mock de módulo puede quedar **desactualizado en silencio**. Si el repository real pasa a devolver otra cosa, el falso sigue devolviendo lo de antes, los tests siguen verdes y la aplicación está rota. Con la inyección del 10.2, el tipo no cierra y TypeScript lo canta.

Notá que los tests en sí son **idénticos** en los dos ejemplos. Todo lo que cambia es cómo se pone el repository falso en su lugar. Esa dificultad es andamiaje, no testing.

## Lo que sigue

Los dos ejemplos anteriores testean el service aislado. El [10.4](../10.4-api-supertest/) sube un nivel: la API entera, con rutas y códigos HTTP, todavía sin base de datos.
