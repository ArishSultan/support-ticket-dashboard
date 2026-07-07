import { NotFoundException } from '@nestjs/common';

/**
 * A pure mapping function from a persistence-layer shape `T` (typically a
 * Drizzle row inferred via `InferSelectModel`) to a domain / GraphQL shape `U`
 * (typically an `*.entity.ts` class).
 *
 * @template T  Source shape (driver row).
 * @template U  Target shape (domain entity).
 */
export type ValueTransformer<T, U> = (value: T) => U;

/**
 * Type guard for `null | undefined` that preserves falsy primitives
 * (`0`, `''`, `false`, `NaN`) as valid values.
 */
const isNullish = <T>(value: T | null | undefined): value is null | undefined =>
  value === null || value === undefined;

/**
 * Throws a `NotFoundException` with a consistent message format.
 * Declared as returning `never` so call sites can narrow types after invoking.
 *
 * @param resourceName  Human-readable resource label (e.g. `'User'`).
 *                      Defaults to `'Resource'` when omitted.
 */
const throwNotFound = (resourceName?: string): never => {
  throw new NotFoundException(`${resourceName ?? 'Resource'} not found`);
};

/**
 * Map a single nullable driver row to a domain object, or throw `404` if absent.
 *
 * Use for query-builder calls that resolve to `T | undefined`, such as
 * Drizzle's relational `findFirst`, or `select().limit(1).then(rows => rows[0])`.
 *
 * @param transformer   Mapping function from row → domain object.
 * @param value         The nullable row returned by the driver.
 * @param resourceName  Resource label used in the `NotFoundException` message.
 * @returns The mapped domain object.
 * @throws  {NotFoundException} when `value` is `null` or `undefined`.
 *
 * @example
 *   const row = await db.query.usersTable.findFirst({ where: eq(usersTable.id, id) });
 *   return mapOneOrThrow(fromDb.user, row, 'User');
 */
export function mapOneOrThrow<T, U>(
  transformer: ValueTransformer<T, U>,
  value: T | null | undefined,
  resourceName?: string,
): U {
  if (isNullish(value)) throwNotFound(resourceName);
  return transformer(value as T);
}

/**
 * Map the first element of a result array to a domain object,
 * or throw `404` if the array is empty/absent.
 *
 * Use for the core SQL builder when you expect exactly one row, e.g.
 * `db.select().from(t).where(...).limit(1)` or `insert().returning()`
 * for a single-row insert.
 *
 * @param transformer   Mapping function from row → domain object.
 * @param value         The array returned by the driver.
 * @param resourceName  Resource label used in the `NotFoundException` message.
 * @returns The mapped domain object from the first row.
 * @throws  {NotFoundException} when the array is nullish or empty.
 *
 * @example
 *   const rows = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
 *   return mapFirstOrThrow(fromDb.user, rows, 'User');
 */
export function mapFirstOrThrow<T, U>(
  transformer: ValueTransformer<T, U>,
  value: T[] | null | undefined,
  resourceName?: string,
): U {
  if (isNullish(value) || value.length === 0) throwNotFound(resourceName);
  return transformer((value as T[])[0]);
}

/**
 * Map a single nullable value, returning `null` when the source is absent.
 *
 * Unlike a naive `value ? transform(value) : null`, this preserves falsy
 * primitives (`0`, `''`, `false`) and only treats `null`/`undefined` as absent.
 *
 * @param transformer  Mapping function from row → domain object.
 * @param value        The nullable row returned by the driver.
 * @returns The mapped domain object, or `null`.
 *
 * @example
 *   const row = await db.query.usersTable.findFirst({ where: eq(usersTable.id, id) });
 *   return mapOneOrNull(fromDb.user, row); // UserEntity | null
 */
export function mapOneOrNull<T, U>(
  transformer: ValueTransformer<T, U>,
  value: T | null | undefined,
): U | null {
  return isNullish(value) ? null : transformer(value);
}

/**
 * Map the first element of a result array, returning `null` when the array
 * is empty/absent. Array counterpart of {@link mapOneOrNull}.
 *
 * @param transformer  Mapping function from row → domain object.
 * @param value        The array returned by the driver.
 * @returns The mapped domain object from the first row, or `null`.
 */
export function mapFirstOrNull<T, U>(
  transformer: ValueTransformer<T, U>,
  value: T[] | null | undefined,
): U | null {
  if (isNullish(value) || value.length === 0) return null;
  return transformer(value[0]);
}

/**
 * Map every element in a result array.
 *
 * Nullish input is coerced to `[]` so call sites never need to null-check
 * before iterating. The transformer is invoked with the row only — the
 * `(item, index, array)` signature of `Array#map` is not leaked, which lets
 * you safely pass mappers that take optional second parameters.
 *
 * @param transformer  Mapping function from row → domain object.
 * @param value        The array returned by the driver.
 * @returns An array of mapped domain objects (possibly empty).
 *
 * @example
 *   const rows = await db.select().from(usersTable);
 *   return mapMany(fromDb.user, rows); // UserEntity[]
 */
export function mapMany<T, U>(
  transformer: ValueTransformer<T, U>,
  value: T[] | null | undefined,
): U[] {
  if (isNullish(value)) return [];
  return value.map(transformer);
}

/**
 * Normalize a value, an array of values, or nothing into an array.
 *
 * Nullish input yields `[]` (not `undefined`) so downstream code can iterate
 * unconditionally. Falsy primitives (`0`, `''`, `false`) are preserved as
 * single-element arrays.
 *
 * @param value  A single value, an array, or `null`/`undefined`.
 * @returns An array (possibly empty).
 *
 * @example
 *   toArray('a');         // ['a']
 *   toArray(['a', 'b']);  // ['a', 'b']
 *   toArray(0);           // [0]
 *   toArray(null);        // []
 */
export function toArray<T>(value: T | T[] | null | undefined): T[] {
  if (isNullish(value)) return [];
  return Array.isArray(value) ? value : [value];
}

/**
 * Returns whether a write statement affected at least one row, without throwing.
 *
 * @param affectedRows  The driver-reported affected row count.
 * @returns `true` if `affectedRows > 0`, otherwise `false`.
 *
 * @example
 *   const result = await db.delete(usersTable).where(eq(usersTable.id, id));
 *   return wasAffected(result.rowCount); // boolean, no throw
 */
export function wasAffected(affectedRows: number | null | undefined): boolean {
  return !isNullish(affectedRows) && affectedRows > 0;
}

/**
 * Asserts that a write statement affected at least one row, throwing `404` otherwise.
 *
 * Use this for "delete by id" mutations where attempting to delete a
 * non-existent resource should surface as a `NotFoundException` to the
 * GraphQL client. The return type is the literal `true` so the function
 * plays nicely with `Boolean!` GraphQL resolvers.
 *
 * @param affectedRows  The driver-reported affected row count.
 * @param resourceName  Resource label used in the `NotFoundException` message.
 * @returns The literal value `true`.
 * @throws  {NotFoundException} when no rows were affected.
 *
 * @example
 *   const result = await db.delete(usersTable).where(eq(usersTable.id, id));
 *   return assertAffected(result.rowCount, 'User');
 */
export function assertAffected(
  affectedRows: number | null | undefined,
  resourceName?: string,
): true {
  if (!wasAffected(affectedRows)) throwNotFound(resourceName);
  return true;
}
