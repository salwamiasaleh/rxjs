import { Component, inject,OnDestroy,OnInit } from '@angular/core';

import { NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';
import { catchError, EMPTY, pipe, Subscription, tap } from 'rxjs';

@Component({
    selector: 'pm-product-list',
    templateUrl: './product-list.component.html',
    standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent, AsyncPipe]
})
export class ProductListComponent {
  pageTitle = 'Products';
  errorMessage = '';
  sub!:Subscription;
  private productService = inject(ProductService)
  // Products
 readonly products$=this.productService.products$.pipe(
  tap(()=>console.log('in the component pipeline')),
  catchError(err=>{
    this.errorMessage=err;
    return EMPTY;
  })
);
  selectedProductId: number = 0;

  readonly selectedProductId$=this.productService.productSelected$;
  
  onSelected(productId: number): void {
    this.productService.productSelected(productId)
  }
}
