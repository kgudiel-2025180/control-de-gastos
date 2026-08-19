import { Directive, HostListener } from '@angular/core';

@Directive({ selector: '[moneyInput]' })
export class MoneyInputDirective {
  private readonly allowedKeys = [
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Tab',
    'Home',
    'End',
    '.',
    ',',
  ];

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }
    if (this.allowedKeys.includes(event.key)) {
      return;
    }
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const normalized = input.value.replace(',', '.').replace(/[^0-9.]/g, '');
    const [whole, ...decimals] = normalized.split('.');
    input.value =
      decimals.length > 0
        ? `${whole}.${decimals.join('').slice(0, 2)}`
        : whole;
  }
}
