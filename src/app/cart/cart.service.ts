import { computed, effect, Injectable, signal,input } from '@angular/core';
import { CartItem } from './cart';
import { Product } from '../products/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems = signal<CartItem[]>([]);
  constructor() {
    effect(() => console.log(this.cartItems()));
  }

  cartCount = computed(() =>
    this.cartItems().reduce((accQty, item) => accQty + item.quantity, 0)
  );
  cartSubtotal = computed(() =>
    this.cartItems().reduce(
      (acctotal, item) => acctotal + (item.quantity * item.product.price),
      0
    )
  );
  cartDeliveryCharge = computed<number>(() =>
    this.cartSubtotal() < 50 ? 5.99 : 0
  );
  tax = computed(() => Math.round(this.cartSubtotal() * 10.75) / 100);

  total = computed(
    () => this.cartDeliveryCharge() + this.cartSubtotal() + this.tax()
  );
  addToCart(product: Product): void {
    this.cartItems.update((items) => [...items, { product, quantity: 1 }]);
  }
  updateQunatity(cartItem:CartItem,quantity:number):void{
  this.cartItems.update(item=>
    item.map(item=>item.product.id===cartItem.product.id? {...item,quantity}:item))
  }
  removeFromCart(cartItem:CartItem):void{
    this.cartItems.update(item=>item.filter(item=>item.product.id!=cartItem.product.id))
  }
}
