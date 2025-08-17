import {
  DialectAdapterBase,
  type Kysely,
  type MigrationLockOptions,
} from "kysely";

export class DuckDbAdapter extends DialectAdapterBase {
  get supportsTransactionalDdl() {
    return false;
  }

  get supportsReturning() {
    return true;
  }

  async acquireMigrationLock(
    _db: Kysely<any>,
    _opt: MigrationLockOptions
  ): Promise<void> {}

  async releaseMigrationLock(
    _db: Kysely<any>,
    _opt: MigrationLockOptions
  ): Promise<void> {}
}
