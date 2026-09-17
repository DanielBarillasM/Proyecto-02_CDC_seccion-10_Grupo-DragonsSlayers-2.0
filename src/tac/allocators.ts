import type { SemanticType } from "../semantic/semanticTypes";
export interface Temporary { name: string; type: SemanticType; }
export class TemporaryAllocator {
  private nextId = 0;
  private free: Temporary[] = [];
  private live = new Set<string>();
  created = 0;
  reused = 0;
  peak = 0;

  acquire(type: SemanticType): Temporary {
    const recycled = this.free.pop();
    const temp = recycled ?? { name: `t${this.nextId++}`, type };
    if (recycled) this.reused++;
    temp.type = type;
    this.live.add(temp.name);
    this.created = Math.max(this.created, this.nextId);
    this.peak = Math.max(this.peak, this.live.size);
    return temp;
  }

  release(temp: Temporary): void {
    if (this.live.delete(temp.name)) this.free.push(temp);
  }

  reset(): void {
    this.nextId = 0;
    this.free = [];
    this.live.clear();
    this.created = 0;
    this.reused = 0;
    this.peak = 0;
  }
}
export class LabelFactory { private counters = new Map<string, number>(); next(prefix: string): string { const value = this.counters.get(prefix) ?? 0; this.counters.set(prefix, value + 1); return `L_${prefix}_${value}`; } reset(): void { this.counters.clear(); } }
