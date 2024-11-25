import { Component, inject,  } from '@angular/core';

import { NgIf, NgFor, CurrencyPipe, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { catchError, EMPTY,  } from 'rxjs';
import { CartService } from 'src/app/cart/cart.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor, CurrencyPipe],
})
export class ProductDetailComponent {
  // Just enough here for the template to compile
  errorMessage = '';
  private productService = inject(ProductService);
  private cartService=inject(CartService);
  product$=this.productService.product$.pipe(
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    }))
  pageTitle =
  // this.product
  //   ? `Product Detail for: ${this.product.productName}`
     'Product Detail';
 
  addToCart(product: Product) {
    this.cartService.addToCart(product)
  }
}
