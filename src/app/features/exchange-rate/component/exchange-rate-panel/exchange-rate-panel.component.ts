import { Component, Input, OnInit } from '@angular/core';
import { CurrencyTable, ExchangeRate } from '../../models/exchange-rate.model';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CurrencyViewService } from '../../services/currency-view.service';
import { exchangeValidator } from '../../../../shared/validators/exchange-validator';
import { CommonModule } from '@angular/common';
import { LoadingState } from '../../../../core/models/loading-state.model';
import { error } from 'console';
import { HttpErrorResponse } from '@angular/common/http';

interface ExchangeForm {
  amount: FormControl<number>;
  currencyFrom: FormControl<string>;
  currencyTo: FormControl<string>;
}

@Component({
  selector: 'app-exchange-rate-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './exchange-rate-panel.component.html',
  styleUrl: './exchange-rate-panel.component.css',
})
export default class ExchangeRatePanelComponent implements OnInit {
  exchangeForm!: FormGroup<ExchangeForm>;
  exchangeResult!: number;
  exchangeFrom!: string;
  exchangeTo!: string;
  exchangeAmount!: number;
  loading = LoadingState.LOADED;
  LoadingState = LoadingState;
  error: HttpErrorResponse | undefined;

  @Input() optionsCurrency!: CurrencyTable;

  constructor(private currencyViewService: CurrencyViewService) {}

  ngOnInit(): void {
    this.exchangeForm = new FormGroup<ExchangeForm>({
      amount: new FormControl(1.0, {
        validators: [Validators.required, exchangeValidator()],
        nonNullable: true,
      }),
      currencyFrom: new FormControl('USD', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      currencyTo: new FormControl('EUR', {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
  }

  exchangeSubmit(): void {
    this.loading = LoadingState.LOADING;
    forkJoin({
      exchangeFrom: this.currencyViewService.getExchangeRate(
        this.exchangeForm.controls.currencyFrom.value
      ),
      exchangeTo: this.currencyViewService.getExchangeRate(
        this.exchangeForm.controls.currencyTo.value
      ),
    }).subscribe({
      next: (res) => {
        this.countExchange(res.exchangeFrom.rates[0], res.exchangeTo.rates[0]);
        this.loading = LoadingState.LOADED;
      },
      error: (err) => {
        this.error = err;
        this.loading = LoadingState.LOADED;
      },
    });
  }

  exchangeCurrency(): void {
    const currencyFrom = this.exchangeForm.controls.currencyFrom.value;
    const currencyTo = this.exchangeForm.controls.currencyTo.value;

    this.exchangeForm.controls.currencyFrom.setValue(currencyTo);
    this.exchangeForm.controls.currencyTo.setValue(currencyFrom);
  }

  countExchange(exchangeFrom: ExchangeRate, exchangeTo: ExchangeRate): void {
    if (exchangeFrom.mid) {
      this.exchangeResult =
        (this.exchangeForm.controls.amount.value * exchangeFrom.mid) /
        exchangeTo.mid!;
    } else {
      this.exchangeResult =
        (this.exchangeForm.controls.amount.value * exchangeFrom.bid!) /
        exchangeTo.ask!;
    }
    this.exchangeFrom = this.exchangeForm.controls.currencyFrom.value;
    this.exchangeTo = this.exchangeForm.controls.currencyTo.value;
    this.exchangeAmount = this.exchangeForm.controls.amount.value;
  }
}
