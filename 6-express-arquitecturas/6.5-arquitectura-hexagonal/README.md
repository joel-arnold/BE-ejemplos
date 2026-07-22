# 6.5 - Hexagonal / Ports & Adapters (versión light)

> Clase "Arquitecturas en APIs de Node.js" · **Bloque 5**

La misma API, ahora con la idea de **Hexagonal** (también Clean, Onion) formalizada: la lógica de negocio en el centro, sin depender de frameworks ni de la base de datos, conectada al mundo por **puertos** (interfaces que el dominio define) y **adaptadores** (implementaciones concretas).

## La regla: las dependencias apuntan hacia adentro

```
Adaptadores  →  Express (controller), repositorio en memoria
    │              (lo concreto y reemplazable)
    ▼
Puertos      →  ProductoRepository (interface)
    │              (lo que el dominio necesita)
    ▼
Dominio      →  Producto, ProductoService
                   (entidades y reglas; no conoce nada de afuera)
```

## Cómo se ve en el código

```
src/producto/
├── domain/                          ← el centro, sin dependencias externas
│   ├── producto.repository.js       PUERTO (clase base abstracta)
│   └── producto.service.js          caso de uso (depende del puerto)
└── infrastructure/                  ← el borde, reemplazable
    ├── producto.controller.js       adaptador de ENTRADA (Express)
    ├── producto.memory.repository.js adaptador de SALIDA (implementa el puerto)
    └── producto.routes.js           composición: enchufa los adaptadores
```

Como JS no tiene interfaces, el **puerto** se expresa como una **clase base abstracta** (`ProductoRepository`) cuyos métodos lanzan "No implementado"; el adaptador de salida la `extends` e implementa de verdad.

La pieza clave es la **inversión de dependencias**: `ProductoService` no conoce al repositorio en memoria; recibe por el constructor **cualquier implementación** del puerto `ProductoRepository`. Quién es la implementación concreta se decide en un solo lugar (`producto.routes.js`).

```js
const repository = new MemoryProductoRepository() // ← cambiar por MongoProductoRepository
const service = new ProductoService(repository)   //   y nada más se toca
const controller = new ProductoController(service)
```

## Relación con las capas (6.3)

Con las capas de [6.3](../6.3-arquitectura-capas/) ya había una **versión light** de esto: el service no conocía Express y no sabía cómo se guardaban los datos. Hexagonal formaliza esa intuición con un **puerto explícito** e inyección de dependencias.

**El trade-off**: a cambio de máxima testabilidad e independencia tecnológica, se pagan más archivos, más abstracción y más andamiaje. Para una API chica suele ser sobre-ingeniería; en dominios complejos o sistemas de larga vida, es donde brilla. Lo importante es **reconocer la idea**, no aplicarla siempre.

## Cómo ejecutar

```bash
npm install
npm run dev       # con recarga automática (nodemon)
# o bien: npm start
```
