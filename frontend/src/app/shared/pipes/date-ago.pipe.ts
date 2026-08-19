import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateAgo' })
export class DateAgoPipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) {
      return '';
    }
    const date = typeof value === 'string' ? new Date(value) : value;
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) {
      return 'hace un momento';
    }
    const intervals: Array<[number, string]> = [
      [31536000, 'año'],
      [2592000, 'mes'],
      [604800, 'semana'],
      [86400, 'día'],
      [3600, 'hora'],
      [60, 'minuto'],
    ];
    for (const [secs, unit] of intervals) {
      const count = Math.floor(seconds / secs);
      if (count >= 1) {
        return `hace ${count} ${unit}${count > 1 ? 's' : ''}`;
      }
    }
    return 'hace un momento';
  }
}
