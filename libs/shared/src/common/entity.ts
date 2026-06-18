import { EventBase } from './domain-event';
import { Id } from './vo/id.vo';

export abstract class Entity<T> {
  id: Id;
  private events: EventBase[] = [];

  abstract equalsTo(entity: T): boolean;

  record(event: EventBase) {
    this.events.push(event);
  }

  pullEvents() {
    const domainEvents = this.events.slice();
    this.events = [];
    return domainEvents;
  }
}
