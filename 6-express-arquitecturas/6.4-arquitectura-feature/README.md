# 6.4 - Arquitectura por feature (recurso)

> Clase "Arquitecturas en APIs de Node.js" · **Bloque 4** (organización por feature)

**Las mismas cuatro capas** que [6.3](../6.3-arquitectura-capas/), pero agrupadas con otro criterio: en vez de una carpeta por rol técnico, **una carpeta por recurso**. Todo lo que hace a "productos" (sus routes, controller, service, repository y modelo) vive junto.

Para que se note la diferencia, este ejemplo tiene **dos features**: `productos` y `usuarios`.

## Por rol técnico vs. por feature

```
POR ROL TÉCNICO (6.3)          POR FEATURE (este ejemplo)
src/                           src/
├── routes/                    ├── productos/
│   ├── productos.routes.js    │   ├── productos.routes.js
│   └── usuarios.routes.js     │   ├── productos.controller.js
├── controllers/              │   ├── productos.service.js
│   ├── productos...          │   └── productos.repository.js
│   └── usuarios...           ├── usuarios/
├── services/         →       │   ├── usuarios.routes.js
│   └── ...                   │   ├── usuarios.controller.js
├── repositories/             │   ├── usuarios.service.js
│   └── ...                   │   └── usuarios.repository.js
└── app.js                    ├── shared/   (errores, middleware)
                              └── app.js
```

**Las capas no desaparecen**: son las mismas. Lo único que cambia es el criterio para agrupar los archivos en carpetas.

## Por qué escala mejor

- **Alta cohesión**: lo que cambia junto, está junto. Para tocar "productos" no saltás entre cuatro carpetas.
- **Equipo**: cada integrante trabaja en su carpeta sin pisarse.
- **Extraer o borrar** un feature completo es mover/eliminar una carpeta.
- Lo **transversal** (middleware, errores, conexión a la base) va a `shared/`.

Regla práctica: con pocos recursos, cualquiera de las dos sirve — elegí una y sé consistente. Con muchos recursos o varios integrantes, **por feature**.

## Cómo ejecutar

```bash
npm install
npm run dev       # con recarga automática (nodemon)
# o bien: npm start
```

Probá los endpoints con `productos.http` y `usuarios.http`.
