import { ValueObject } from '../value-object';
import { randomUUID } from 'node:crypto';

export class Id extends ValueObject<string> {
  constructor(private id: string) {
    super(id, `Invalid UUID Id:${id} `);
  }

  validate(id: string) {
    const re =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return re.test(id);
  }

  static generate() {
    return new Id(randomUUID());
  }

  static string() {
    return randomUUID();
  }
}
