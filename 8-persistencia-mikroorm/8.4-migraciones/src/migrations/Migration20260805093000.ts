import { Migration } from '@mikro-orm/migrations';

// ============================================================================
// MIGRACIÓN 2 - agregar una columna a una tabla que ya tiene datos
// ============================================================================
// Este es el caso que justifica todo el mecanismo.
//
// Se agregó `stock: number` a la entidad. La tabla `producto` ya existe en
// producción con filas adentro. Un `alter table producto add stock int not
// null` a secas FALLA: MySQL no sabe qué stock ponerle a las filas que ya
// están.
//
// La migración resuelve eso con un default. Es una decisión de negocio ("los
// productos que ya existían arrancan con stock 0") que ninguna herramienta
// puede tomar por vos — y por eso el archivo se revisa antes de aplicarlo,
// aunque lo haya generado la CLI.
// ============================================================================

export class Migration20260805093000 extends Migration {

  override name = 'Migration20260805093000';

  override up(): void | Promise<void> {
    this.addSql('alter table `producto` add `stock` int not null default 0;');
  }

  override down(): void | Promise<void> {
    this.addSql('alter table `producto` drop column `stock`;');
  }

}
