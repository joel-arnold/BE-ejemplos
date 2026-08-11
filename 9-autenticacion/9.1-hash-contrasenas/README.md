# 9.1 - Contraseñas: hash, salt y cost factor

> Clase "Autenticación y autorización" · **Bloque 3**

Tres archivos sin servidor y sin base de datos, para responder una sola pregunta: **¿qué se guarda en la columna de la contraseña?**

## Correrlo

No hace falta MySQL ni nada previo.

```bash
npm install
npm run plano       # 9.1.1 - texto plano, cifrado y SHA-256: las tres ideas malas
npm run hash        # 9.1.2 - bcrypt: salt y cost factor
npm run verificar   # 9.1.3 - compare() y los errores clásicos del login
```

## Recorrido

| Archivo | Qué muestra |
| --- | --- |
| [9.1.1-porQueNoTextoPlano.ts](src/9.1.1-porQueNoTextoPlano.ts) | Por qué texto plano, cifrado y hash rápido fallan — cada uno por un motivo distinto. Termina rompiendo un SHA-256 por diccionario en 0,1 ms. |
| [9.1.2-hashConBcrypt.ts](src/9.1.2-hashConBcrypt.ts) | El mismo password dando dos hashes distintos, las cuatro partes del string de 60 caracteres y el cost factor como dial. |
| [9.1.3-verificarYCostFactor.ts](src/9.1.3-verificarYCostFactor.ts) | `compare()`, por qué el login contesta siempre lo mismo cuando falla, y cómo subir el cost sin invalidar los hashes viejos. |

## Las tres ideas

**1. Cifrar no sirve, hashear sí.** Cifrar es ida y vuelta: si el sistema puede descifrar, un atacante con acceso al servidor también. Hashear es de una sola dirección — ni vos podés recuperar la contraseña. Por eso los sistemas serios ofrecen *restablecer* y nunca *recordar* la contraseña: no la tienen.

**2. El salt hace que el mismo password dé hashes distintos.** Viene adentro del string, así que no hay que guardarlo aparte ni mantenerlo en secreto. Su trabajo es que dos usuarios con la misma contraseña no compartan hash y que no se puedan precalcular tablas.

**3. Lento es la función, no el bug.** SHA-256 está diseñado para ser rápido, y eso lo hace pésimo para contraseñas: probar un diccionario entero sale casi gratis. bcrypt tiene un **cost factor** exponencial que se paga una vez por login y millones de veces por ataque.

## El string de 60 caracteres

```
$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
 │  │  └─────── salt (22) ────────┘└──────── hash (31) ───────┘
 │  └─ cost factor: 10
 └──── versión del algoritmo: 2b
```

Todo eso entra en **una** columna: en la entidad del [9.3](../9.3-api-auth/) es un `varchar(60)`.

Que el cost esté guardado adentro es lo que permite subirlo con los años sin romper nada: un hash de 2019 con cost 8 se sigue verificando con cost 8, y se puede regenerar con el cost de hoy la próxima vez que ese usuario haga login (es el único momento en que el password en texto plano vuelve a estar disponible).

## `bcryptjs`, no `bcrypt`

Son **el mismo algoritmo**, en dos implementaciones:

| | `bcrypt` | `bcryptjs` |
| --- | --- | --- |
| Implementación | C++ nativo | JavaScript puro |
| Instalación | compila con node-gyp | `npm install` y listo |
| Velocidad | ~2-3× más rápido | suficiente |

Acá usamos **`bcryptjs`** porque no necesita compilador: en una máquina sin las build tools de Windows, `npm install bcrypt` falla con un error de node-gyp que no tiene nada que ver con el tema de la clase. La API es idéntica, así que cambiar de una a la otra es cambiar el import.

En un proyecto real con mucho tráfico vale la nativa. Para el TP y para la mayoría de las APIs, no se nota.

## Un poco más lejos

- bcrypt **ignora todo lo que pase de 72 bytes**. Con contraseñas normales no molesta, pero es la razón por la que algunos sistemas hashean con SHA-256 antes de pasar por bcrypt.
- **scrypt** y **argon2** son alternativas más nuevas: además de tiempo exigen memoria, lo que complica los ataques con placas de video. `scrypt` viene en el módulo `crypto` de Node, sin instalar nada.
- `bcryptjs.hash()` devuelve una promesa, pero el cálculo corre en JavaScript: **ocupa el event loop** (unidad 3). Con cost 12 son ~350 ms en los que ese proceso de Node no atiende ningún otro request. La versión nativa no tiene ese problema — delega en el thread pool de libuv. Es un argumento más para no subir el cost de más, y el caso real donde la diferencia entre las dos implementaciones sí importa.
