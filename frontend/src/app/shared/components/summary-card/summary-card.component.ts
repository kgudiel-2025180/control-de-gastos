import { Component, input } from '@angular/core';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';
import { iconPaths } from '../../icons';

@Component({
  selector: 'app-summary-card',
  imports: [CurrencyFormatPipe],
  templateUrl: './summary-card.component.html',
  styleUrl: './summary-card.component.css',
})
export class SummaryCardComponent {
  readonly title = input.required<string>();
  readonly value = input.required<number>();
  readonly icon = input('wallet');
  readonly color = input('#6366f1');

  protected readonly iconPaths = iconPaths;
}