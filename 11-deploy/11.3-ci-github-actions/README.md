# 11.3 - El portero: tests antes de publicar

Render conectado a GitHub deploya solo en cada push a `main`. Es cómodo y tiene un agujero: **deploya aunque los tests estén rojos**.

Este ejemplo cierra ese agujero. Es donde la unidad 10 termina de pagarse: una suite de tests que corre en tu máquina cuando te acordás sirve bastante; una que corre sola y **frena el deploy** sirve mucho más.

## Correrlo

```bash
npm install
npm run check     # tipos
npm test          # 12 tests, dos archivos
npm run build     # compila a dist/, sin los tests
npm run dev       # levanta la API en :3000
```

La API es de adorno: dos rutas, para que el workflow tenga algo que buildear y algo que testear. El tema del ejemplo está en [workflows/](workflows/).

## Dónde van los archivos

Los dos YAML de [workflows/](workflows/) son **plantillas**. En el repositorio del TP van en:

```
tu-repo/
└── .github/
    └── workflows/
        ├── ci.yml
        └── deploy.yml
```

**En la raíz del repositorio, no en la del proyecto.** GitHub solo mira `.github/workflows/` de la raíz: un workflow adentro de una subcarpeta no se ejecuta nunca y no avisa. (Por eso acá están en `workflows/` a secas — si estuvieran en `.github/`, se dispararían con cada push a este repositorio de ejemplos.)

Si el proyecto no está en la raíz, hace falta el `working-directory` que está en los dos archivos. En el TP, donde el proyecto suele estar solo, esas líneas se borran.

## Qué es GitHub Actions

Un servidor que GitHub te presta. Ante un evento que vos elegís —un push, un pull request, un horario— levanta una máquina virtual **vacía**, corre los pasos que le pediste y la tira.

Que empiece vacía es la mitad del valor. Es una máquina que no tiene tu `node_modules`, ni tu `.env`, ni esa librería que instalaste global hace tres meses y te olvidaste. Si el proyecto anda ahí, anda en cualquier lado. Es *"anda en mi máquina"* verificado por alguien que no es tu máquina.

Para repositorios públicos es gratis y sin límite.

## [ci.yml](workflows/ci.yml) — el tilde verde

Corre en cada push a `main` y en cada pull request. Cuatro pasos, en este orden:

| Paso | Por qué está |
| --- | --- |
| `npm ci` | Instalación exacta, desde el `package-lock.json`. Falla si no coincide con el `package.json` |
| `npm run check` | **En desarrollo corremos con `tsx`, que no chequea tipos.** Este es el único lugar donde se garantiza que el proyecto todavía compila |
| `npm test` | Los 12 tests |
| `npm run build` | Que los tests pasen no garantiza que compile: ts-jest transpila archivo por archivo. Mejor que falle acá que en el deploy |

El resultado queda pegado al commit: el tilde verde o la cruz roja que aparece en la lista de commits y arriba de cada pull request.

El de los pull requests es el que más rinde en un TP de equipo. La rama se testea **antes** de mezclarse con `main`, y el resultado se ve en la pantalla del pull request sin que nadie tenga que acordarse de correr nada. Se puede además marcar el check como obligatorio (Settings > Branches > Branch protection rules) y GitHub directamente no deja mergear con la cruz roja.

## [deploy.yml](workflows/deploy.yml) — el portero

El archivo entero existe por una línea:

```yaml
publicar:
  needs: verificar
```

`needs` significa "no arranques hasta que `verificar` haya terminado **bien**". Si un test falla, el job de publicar no corre y la versión rota se queda en GitHub sin llegar a producción.

Sin esa línea, los dos jobs corren en paralelo y el deploy sale igual: el pipeline mira los tests fallar y publica de todos modos.

Para que funcione hay que sacarle el volante a Render:

1. En Render: **Settings > Build & Deploy > Auto-Deploy: OFF**.
2. Copiar el **Deploy Hook** (una URL secreta que dispara un deploy).
3. En GitHub: **Settings > Secrets and variables > Actions > New repository secret**, con el nombre `RENDER_DEPLOY_HOOK`.

A partir de ahí, el único camino a producción pasa por los tests.

El hook va como *secret* y no escrito en el YAML porque es una URL que dispara deploys: cualquiera que vea el repositorio podría usarla. Los secrets de GitHub no se pueden leer una vez guardados y quedan tapados con asteriscos si algo intenta imprimirlos en el log.

## Los dos `tsconfig`

Un detalle chico que evita un error silencioso. El build usa [tsconfig.build.json](tsconfig.build.json), que hereda del [tsconfig.json](tsconfig.json) y **saca los tests**.

Sin eso, `npm run build` compila los `.test.ts` adentro de `dist/` y los tests viajan a producción: importan `@jest/globals` y `supertest`, que son `devDependencies`, y de paso le cuentan las reglas del sistema a cualquiera que tenga acceso al build.

¿Y por qué dos archivos en vez de un `exclude` en el `tsconfig.json`? Porque ese `exclude` también sacaría los tests del `npm run check` y de ts-jest. El chequeo de tipos dejaría de mirar los tests justo cuando el workflow dice que los está mirando, y **un paso verde que no verifica nada es peor que no tener el paso**.

## Probarlo

La mejor forma de entenderlo es romperlo a propósito:

1. Cambiar el `toBe(800)` de [src/precios.test.ts](src/precios.test.ts) por `toBe(900)`.
2. Commitear y pushear.
3. Mirar la pestaña **Actions** del repositorio.

El job se pone rojo, el commit queda con la cruz, y el deploy no sale. Después revertir y ver el tilde verde.

## Lo que este ejemplo no hace

- **No verifica que el deploy haya salido bien.** El `curl` dispara el deploy y el job termina contento. Un pipeline serio sigue con un *smoke test* contra la URL de producción y vuelve atrás si falla.
- **No tiene ambiente de staging.** Una copia igual a producción donde probar antes. En un TP no hace falta; con usuarios de verdad es lo primero que se agrega.
- **No corre los tests contra una base real.** Se puede: GitHub Actions levanta un MySQL como *service container* para el job. Es el escalón que quedó pendiente de la unidad 10.
