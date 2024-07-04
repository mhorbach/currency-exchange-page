import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CurrencyViewService } from '../../services/currency-view.service';
import { CurrencyTable } from '../../models/exchange-rate.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import ExchangeRatePanelComponent from '../../component/exchange-rate-panel/exchange-rate-panel.component';
import { FormsModule } from '@angular/forms';
import { LoadingState } from '../../../../core/models/loading-state.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-currency-view',
  standalone: true,
  imports: [CommonModule, FormsModule, ExchangeRatePanelComponent],
  templateUrl: './currency-view.component.html',
  styleUrls: ['./currency-view.component.css'],
  providers: [DatePipe],
})
export default class CurrencyViewComponent implements OnInit {
  currencyTable!: CurrencyTable;
  currencyDate: string = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
  currentDate: string = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
  loading: LoadingState = LoadingState.NOT_LOADED;
  LoadingState = LoadingState;
  destroyRef = inject(DestroyRef);
  errors: HttpErrorResponse | undefined;

  constructor(
    private readonly currencyViewService: CurrencyViewService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.changeDate();
  }

  changeDate(): void {
    this.loading = LoadingState.LOADING;
    this.errors = undefined;
    this.currencyViewService
      .getCurrencyView(this.currencyDate)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (table: CurrencyTable) => {
          this.currencyTable = table;
          this.loading = LoadingState.LOADED;
        },
        error: (err) => {
          console.log(err);
          this.errors = err;
          this.loading = LoadingState.LOADED;
        },
      });
  }
}
