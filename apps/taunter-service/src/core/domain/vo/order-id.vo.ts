import { ValueObject } from '@app/shared';
import { ORDER_ID_REGEX } from './constants/order-id.regex';

import crypto from 'crypto';
/**
 * Value Object que encapsula el identificador único de un usuario autenticado.
 *
 * - Formato: UUID v1-v8 (RFC 4122).
 * - Inmutable: una vez creado, el ID no puede cambiar.
 * - Generado por la capa de dominio al crear el usuario autenticado (randomUUID).
 */
export class OrderId extends ValueObject<string> {
  constructor(value: string) {
    super(value, 'order id must be a valid UUID');
  }

  protected validate(value: string): boolean {
    return ORDER_ID_REGEX.test(value);
  }

  static create(id: string): OrderId {
    return new OrderId(id);
  }

  static generate(): string {
    return crypto.randomUUID();
  }
}
