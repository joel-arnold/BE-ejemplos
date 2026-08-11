import { Migration } from '@mikro-orm/migrations';

// ============================================================================
// MIGRACIÓN 1 - el esquema inicial
// ============================================================================
// Generada con: npm run orm -- migration:create
//
// La CLI la escribió sola comparando las entidades contra la base vacía. Está
// versionada en git como cualquier otro archivo del proyecto: eso es todo el
// truco. El esquema deja de ser un estado que cada uno tiene distinto en su
// máquina y pasa a ser una secuencia de cambios que todos aplican en el mismo
// orden.
// ============================================================================

export class Migration20260801100000 extends Migration {

  override name = 'Migration20260801100000';

  override up(): void | Promise<void> {
    this.addSql(
      'create table `producto` (`id` int unsigned not null auto_increment primary key, ' +
        '`nombre` varchar(100) not null, `precio` int not null, ' +
        '`descripcion` varchar(255) null, `creado_en` datetime not null) ' +
        'default character set utf8mb4 engine = InnoDB;',
    );
    this.addSql('alter table `producto` add unique `producto_nombre_unique` (`nombre`);');
  }

  // El down deshace lo que hizo el up. Sirve para volver atrás un deploy que
  // salió mal, y además obliga a pensar si el cambio es reversible: muchos no
  // lo son sin perder datos, y darse cuenta acá es mejor que darse cuenta en
  // producción.
  override down(): void | Promise<void> {
    this.addSql('drop table if exists `producto`;');
  }

}
