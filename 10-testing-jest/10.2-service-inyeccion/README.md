# 10.2 - Testear el service inyectando el repository

El service de productos del [9.3](../../9-autenticacion/9.3-api-auth/), testeado **sin MySQL, sin servidor y sin token de verdad**. Nueve tests que corren en un par de segundos.

```bash
npm install
npm test        # el service contra un repository de mentira
npm start       # el mismo service contra el repository real
```

## El problema

El service del 9.3 empieza así:

```ts
import * as repo from '../repositories/productos.repository.js';
```

Ese import está soldado. El service **agarra** su repository solo, y el repository va a MySQL. Testear `crear` con eso significa tener la base andando, con datos conocidos, y limpiarla entre test y test. Un test que necesita todo eso es lento, falla por motivos que no tienen que ver con el código, y nadie lo corre.

## El cambio

Uno solo: el repository **entra por parámetro**.

```ts
export function crearProductosService(repo: ProductosRepository) {
  return {
    async crear(datos, autor) { /* ... */ },
    async eliminar(id, quienPide) { /* ... */ },
  };
}
```

El service ya no elige con quién habla: se lo dicen. Eso es **inyección de dependencias**, y es todo lo que hay que hacer. En [main.ts](src/main.ts) se le pasa el repository real; en [el test](src/services/productos.service.test.ts), uno falso. El service no nota la diferencia porque nunca supo cuál era cuál.

Fijate qué depende de qué:

| Archivo | Conoce | No conoce |
| --- | --- | --- |
| `productos.service.ts` | el **tipo** `ProductosRepository` | qué implementación le van a pasar |
| `productos.repository.ts` | MySQL (acá, un array) | quién lo usa |
| `main.ts` | los dos, y los junta | — |

El tipo `ProductosRepository` es la pieza clave: cinco firmas de función que un objeto de mentira puede cumplir en tres líneas.

## El repository falso

```ts
const repo = {
  findAll: jest.fn<ProductosRepository['findAll']>(),
  findById: jest.fn<ProductosRepository['findById']>(),
  // ...
};
```

`jest.fn()` devuelve una función que no hace nada pero **anota**: con qué argumentos la llamaron, cuántas veces, qué devolvió. Y se le puede decir qué contestar con `mockResolvedValue`.

El parámetro de tipo hace que TypeScript verifique que lo que le mandás contestar tenga la forma correcta. Si mañana el repository cambia su firma, este archivo deja de compilar. Es la unidad 7 trabajando para la 10.

## Los dos usos de un doble de prueba

Los tests de este ejemplo hacen las dos cosas, y conviene notar la diferencia porque la mitad de los tests que fallan mal es por confundirlas:

| | Qué se hace | Ejemplo acá |
| --- | --- | --- |
| **Preparar la respuesta** | Decirle al falso qué contestar, para poner al service en la situación que se quiere probar | `repo.findById.mockResolvedValue(mate)` |
| **Verificar la llamada** | Preguntarle al falso qué le pidieron, porque eso *es* parte de lo que el service tiene que hacer | `expect(repo.guardar).toHaveBeenCalledWith(datos, 7)` |

Lo primero es el *arrange*, lo segundo el *assert*. Si un test solo hace lo segundo y nunca mira el resultado, probablemente esté testeando la implementación y no el comportamiento — se va a poner rojo con cualquier refactor.

## Los tests que valen doble

Dos de los nueve merecen leerse aparte:

**`usa como dueño el id del token, no lo que venga en los datos`.** Es la regla de seguridad de la unidad 9. Si alguien "arregla" el service para tomar el dueño del body, el test del camino feliz sigue verde y **este** se pone rojo.

**`contesta 404 y no 403 cuando el producto no existe`.** El orden de los chequeos es una decisión de producto, no una casualidad de cómo se escribieron los `if`. Un test la deja escrita.

Los tests de un service no son solo una red de seguridad: son la **documentación de las reglas de negocio** que no puede quedar desactualizada, porque si miente se pone roja.

## Sobre `jest.clearAllMocks()`

El `beforeEach` del archivo no es decorativo. Sin él, un test ve las llamadas del anterior y `toHaveBeenCalledTimes` empieza a contar de más. Produce el bug más desconcertante que hay: la suite entera pasa, pero un test solo falla. O al revés.

## Lo que sigue

Esto requirió **tocar el código de producción**. A veces no se puede o no se quiere. El [10.3](../10.3-mock-de-modulos/) hace lo mismo sin cambiar una línea del service.
