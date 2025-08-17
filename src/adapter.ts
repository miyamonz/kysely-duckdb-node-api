import {
  DialectAdapterBase,
  type Kysely,
  type MigrationLockOptions,
} from "kysely";

export class DuckDbAdapter extends DialectAdapterBase {
  override get supportsTransactionalDdl() {
    return false;
  }

  override get supportsReturning() {
    return true;
  }

  override async acquireMigrationLock(
    _db: Kysely<any>,
    _opt: MigrationLockOptions
  ) {}

  override async releaseMigrationLock(
    _db: Kysely<any>,
    _opt: MigrationLockOptions
  ) {}
}
