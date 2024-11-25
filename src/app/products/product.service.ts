import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from './product';
import { Review } from '../reviews/review';
import { ReviewService } from '../reviews/review.service';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  filter,
  map,
  Observable,
  of,
  shareReplay,
  Subject,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { HttpErrorService } from '../utilities/http-error.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = 'api/products';
  private reviewService = inject(ReviewService);
  private errorService = inject(HttpErrorService);

  private http = inject(HttpClient);
  private productSelectedSubject = new BehaviorSubject<number | undefined>(
    undefined
  );
  readonly productSelected$ = this.productSelectedSubject.asObservable();
  readonly products$ = this.http.get<Product[]>(this.productsUrl).pipe(
    tap((p) => console.log(p)),
    shareReplay(1),
    catchError((err) => this.handleError(err))
  );

  readonly product1$ = this.productSelected$.pipe(
    filter(Boolean),
    switchMap((id) => {
      const productUrl = this.productsUrl + '/' + id;
      return this.http.get(productUrl).pipe(
        tap(() => console.log('get id pipeline')),
        switchMap((product: any) => this.getProductWithReviews(product))
      );
    })
  );
  readonly product$ = combineLatest([
    this.productSelected$,
    this.products$,
  ]).pipe(
    map(([selectedProduct, products]) =>
      products.find((prod) => prod.id === selectedProduct)
    ),
    filter(Boolean),
    switchMap((product: any) => this.getProductWithReviews(product)),
    catchError((err) => this.handleError(err))
  );
  productSelected(productId: number) {
    this.productSelectedSubject.next(productId);
  }

  private getProductWithReviews(product: Product) {
    if (product.hasReviews) {
      return this.http
        .get<Review[]>(this.reviewService.getReviewUrl(product.id))
        .pipe(map((reviews) => ({ ...product, reviews } as Product)));
    } else {
      return of(product);
    }
  }
  private handleError(err: HttpErrorResponse): Observable<never> {
    const formattedMessage = this.errorService.formatError(err);
    return throwError(() => formattedMessage);
    // throw formattedMessage;
  }
}
