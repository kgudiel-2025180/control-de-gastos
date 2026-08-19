import { Injectable, signal } from '@angular/core';
import { Category } from '../models/category.model';

/** Mapa de migración: iconos emoji antiguos -> claves SVG nuevas. */
const LEGACY_ICON_MAP: Record<string, string> = {
  '🍔': 'food',
  '🚌': 'bus',
  '🎬': 'film',
  '🏠': 'home',
  '💼': 'briefcase',
  '🛒': 'cart',
  '💊': 'pill',
  '✈️': 'plane',
  '🎮': 'trophy',
  '☕': 'coffee',
  '📱': 'phone',
  '⚽': 'trophy',
};

/** Devuelve el nombre del icono "limpio" o icono por defecto si trae emoji. */
function normalizeIcon(icon: string): string {
  if (LEGACY_ICON_MAP[icon]) {
    return LEGACY_ICON_MAP[icon];
  }
  if (/[\u{1F000}-\u{1FAFF}\u2600-\u27BF\u2B00-\u2BFF\uFE0F\u2190-\u21FF]/u.test(icon)) {
    return 'tag';
  }
  return icon;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly storageKey = 'cdg-categories';
  private readonly _categories = signal<Category[]>(this.load());

  readonly categories = this._categories.asReadonly();

  getById(id: string): Category | undefined {
    return this._categories().find((c) => c.id === id);
  }

  add(category: Omit<Category, 'id'>): void {
    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID(),
    };
    this._categories.update((list) => [...list, newCategory]);
    this.save();
  }

  update(id: string, changes: Partial<Category>): void {
    this._categories.update((list) =>
      list.map((c) => (c.id === id ? { ...c, ...changes, id } : c)),
    );
    this.save();
  }

  remove(id: string): void {
    this._categories.update((list) => list.filter((c) => c.id !== id));
    this.save();
  }

  private load(): Category[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return this.seed();
    }
    try {
      return (JSON.parse(raw) as Category[]).map((c) => ({
        ...c,
        icon: normalizeIcon(c.icon),
      }));
    } catch {
      return this.seed();
    }
  }

  private seed(): Category[] {
    return [
      { id: 'cat-comida', name: 'Comida', icon: 'food', color: '#fb923c', budgetLimit: 300 },
      { id: 'cat-transporte', name: 'Transporte', icon: 'bus', color: '#60a5fa', budgetLimit: 120 },
      { id: 'cat-ocio', name: 'Ocio', icon: 'film', color: '#a78bfa', budgetLimit: 80 },
      { id: 'cat-hogar', name: 'Hogar', icon: 'home', color: '#34d399', budgetLimit: 250 },
      { id: 'cat-salario', name: 'Salario', icon: 'briefcase', color: '#2dd4bf', budgetLimit: 0 },
    ];
  }

  private save(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this._categories()));
  }
}