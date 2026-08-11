import { crearApp } from './app.js';
import { crearProductosService } from './services/productos.service.js';
import { productosRepository } from './repositories/productos.repository.js';
import { emitirToken } from './shared/jwt.js';

// El composition root: acá se junta todo con las implementaciones de verdad y
// se pone a escuchar. Es el único archivo que los tests no tocan nunca.

const app = crearApp(crearProductosService(productosRepository));

app.listen(3000, () => {
  console.log('API en http://localhost:3000');

  // Para poder probar las rutas protegidas desde productos.http sin montar un
  // login. En el 9.3 este token sale de POST /api/auth/login.
  console.log('\nToken de Juan (usuario 1, dueño del Mate):');
  console.log(emitirToken({ sub: '1', email: 'juan@utn.edu.ar', rol: 'usuario' }));
});
