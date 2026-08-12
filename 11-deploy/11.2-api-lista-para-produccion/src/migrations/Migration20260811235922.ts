import { Migration } from '@mikro-orm/migrations';

// ============================================================================
// EL ESQUEMA INICIAL
// ============================================================================
// Generada con: npm run orm -- migration:create
//
// Es el mismo esquema que en las unidades 8 y 9 armaba `schema.update()` al
// arrancar. La diferencia no es el SQL: es que ahora está escrito, versionado
// y se aplica igual en tu máquina y en la base de producción.
//
// Contra una base con datos de usuarios reales, `schema.update()` deja de ser
// cómodo y pasa a ser peligroso: renombrar un campo en una entidad le parece
// "sobra una columna" y genera un DROP COLUMN, sin preguntar y sin Ctrl+Z.
//
// Este archivo se aplica solo, al arrancar (ver db.ts), y la tabla
// mikro_orm_migrations lleva la cuenta de cuáles ya corrieron en cada base.
// ============================================================================

export class Migration20260811235922 extends Migration {

  override name = 'Migration20260811235922';

  override up(): void | Promise<void> {
    this.addSql(`create table \`usuario\` (\`id\` int unsigned not null auto_increment primary key, \`email\` varchar(120) not null, \`password_hash\` varchar(60) not null, \`rol\` varchar(20) not null default 'usuario', \`creado_en\` datetime not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`usuario\` add unique \`usuario_email_unique\` (\`email\`);`);

    this.addSql(`create table \`producto\` (\`id\` int unsigned not null auto_increment primary key, \`nombre\` varchar(100) not null, \`precio\` int not null, \`descripcion\` varchar(255) null, \`creado_por_id\` int unsigned not null, \`creado_en\` datetime not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`producto\` add unique \`producto_nombre_unique\` (\`nombre\`);`);
    this.addSql(`alter table \`producto\` add index \`producto_creado_por_id_index\` (\`creado_por_id\`);`);

    this.addSql(`alter table \`producto\` add constraint \`producto_creado_por_id_foreign\` foreign key (\`creado_por_id\`) references \`usuario\` (\`id\`);`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table \`producto\` drop foreign key \`producto_creado_por_id_foreign\`;`);

    this.addSql(`drop table if exists \`usuario\`;`);
    this.addSql(`drop table if exists \`producto\`;`);
  }

}
