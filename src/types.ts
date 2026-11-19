export type UserRole = 'customer' | 'merchant' | 'delivery'

export type FoodCategory = 'thali' | 'pickle' | 'papad' | 'snack'

export interface MenuItem {
  id: string
  name: string
  price: number
  category: FoodCategory
  isVeg: boolean
  cookName: string
  kitchenZone: string
  portionsLeft?: number
  dabbaCodePrefix: string
}

export type OrderStatus = 'placed' | 'cooking' | 'packed' | 'picked_up' | 'delivered'

export interface OrderItem {
  item: MenuItem
  quantity: number
}

export interface Order {
  id: string
  orderCode: string // e.g., 'SM-12-B-4'
  customerName: string
  customerPhone: string
  deliveryAddress: string
  deliveryZone: string
  deliverySlot: string
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  pickupOtp: string
  deliveryOtp: string
  placedAt: string
  cookName: string
  partnerName?: string
  paymentStatus: 'paid_upi'
}

export interface DeliveryZone {
  id: string
  code: string
  nameHi: string
  nameEn: string
}
