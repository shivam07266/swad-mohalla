import type { MenuItem, Order, DeliveryZone } from './types'

export interface MerchantProfile {
  id: string
  name: string
  specialty: string
  zone: string
  code: string
  avatarEmoji: string
}

export const AVAILABLE_MERCHANTS: MerchantProfile[] = [
  { id: 'm-1', name: 'सुनीता देवी', specialty: 'दाल मखनी व स्पेशल थाली', zone: 'Zone B', code: 'SM-12', avatarEmoji: '👩‍🍳' },
  { id: 'm-2', name: 'मीना शर्मा', specialty: 'गर्मागर्म आलू-प्याज पराठे', zone: 'Zone A', code: 'SM-05', avatarEmoji: '🫓' },
  { id: 'm-3', name: 'कमला देवी', specialty: 'पारंपरिक आम का देसी अचार', zone: 'Zone B', code: 'SM-08', avatarEmoji: '🥭' },
  { id: 'm-4', name: 'रेखा पाटिल', specialty: 'हाथ के बेले मूंग दाल पापड़', zone: 'Zone A', code: 'SM-14', avatarEmoji: '🍘' },
  { id: 'm-5', name: 'उषा वर्मा', specialty: 'शुद्ध देसी घी मूंग दाल हलवा', zone: 'Zone C', code: 'SM-09', avatarEmoji: '🍯' },
]

export const INITIAL_ZONES: DeliveryZone[] = [
  { id: 'zone-a', code: 'Zone A', nameHi: 'गांधी नगर', nameEn: 'Gandhi Nagar' },
  { id: 'zone-b', code: 'Zone B', nameHi: 'शास्त्री नगर', nameEn: 'Shastri Nagar' },
  { id: 'zone-c', code: 'Zone C', nameHi: 'मॉडल टाउन', nameEn: 'Model Town' },
]

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-1',
    name: 'दाल-मखनी थाली (4 रोटी + चावल + रायता)',
    price: 90,
    category: 'thali',
    isVeg: true,
    portionsLeft: 7,
    cookName: 'सुनीता देवी',
    kitchenZone: 'Zone B',
    dabbaCodePrefix: 'SM-12',
  },
  {
    id: 'item-2',
    name: 'गर्मागर्म आलू-प्याज पराठे (2 पीस + दही)',
    price: 65,
    category: 'thali',
    isVeg: true,
    portionsLeft: 12,
    cookName: 'मीना शर्मा',
    kitchenZone: 'Zone A',
    dabbaCodePrefix: 'SM-05',
  },
  {
    id: 'item-3',
    name: 'पारंपरिक आम का देसी अचार (500g)',
    price: 140,
    category: 'pickle',
    isVeg: true,
    portionsLeft: 15,
    cookName: 'कमला देवी',
    kitchenZone: 'Zone B',
    dabbaCodePrefix: 'SM-08',
  },
  {
    id: 'item-4',
    name: 'कुरकुरे मूंग दाल पापड़ (200g पैकेट)',
    price: 75,
    category: 'papad',
    isVeg: true,
    portionsLeft: 20,
    cookName: 'रेखा पाटिल',
    kitchenZone: 'Zone A',
    dabbaCodePrefix: 'SM-14',
  },
  {
    id: 'item-5',
    name: 'शुद्ध देसी घी मूंग दाल हलवा (250g)',
    price: 110,
    category: 'snack',
    isVeg: true,
    portionsLeft: 5,
    cookName: 'उषा वर्मा',
    kitchenZone: 'Zone C',
    dabbaCodePrefix: 'SM-09',
  },
  {
    id: 'item-6',
    name: 'कढ़ी-पकोड़ा चावल दोपहर थाली',
    price: 80,
    category: 'thali',
    isVeg: true,
    portionsLeft: 9,
    cookName: 'सुनीता देवी',
    kitchenZone: 'Zone B',
    dabbaCodePrefix: 'SM-12',
  },
]

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderCode: 'SM-12-B-4',
    customerName: 'अमित कुमार',
    customerPhone: '9876543210',
    deliveryAddress: 'मकान नं. 42, गली नंबर 3, शास्त्री नगर',
    deliveryZone: 'Zone B',
    deliverySlot: '1:00 - 2:00 PM',
    cookName: 'सुनीता देवी',
    items: [
      { item: INITIAL_MENU_ITEMS[0], quantity: 2 },
    ],
    totalAmount: 180,
    status: 'cooking',
    pickupOtp: '4821',
    deliveryOtp: '7290',
    placedAt: '12:45 PM',
    paymentStatus: 'paid_upi',
  },
  {
    id: 'ord-102',
    orderCode: 'SM-12-B-5',
    customerName: 'सुमन वर्मा',
    customerPhone: '9812345678',
    deliveryAddress: 'फ्लैट 201, साईं अपार्टमेंट, शास्त्री नगर',
    deliveryZone: 'Zone B',
    deliverySlot: '1:30 - 2:30 PM',
    cookName: 'सुनीता देवी',
    items: [
      { item: INITIAL_MENU_ITEMS[5], quantity: 1 },
      { item: INITIAL_MENU_ITEMS[2], quantity: 1 },
    ],
    totalAmount: 220,
    status: 'packed',
    pickupOtp: '6139',
    deliveryOtp: '8402',
    placedAt: '12:50 PM',
    paymentStatus: 'paid_upi',
  },
  {
    id: 'ord-103',
    orderCode: 'SM-05-A-4',
    customerName: 'दीपक सिंह',
    customerPhone: '9822334455',
    deliveryAddress: 'गली नं. 1, गांधी नगर',
    deliveryZone: 'Zone A',
    deliverySlot: '1:00 - 2:00 PM',
    cookName: 'मीना शर्मा',
    items: [
      { item: INITIAL_MENU_ITEMS[1], quantity: 2 },
    ],
    totalAmount: 130,
    status: 'placed',
    pickupOtp: '5129',
    deliveryOtp: '3941',
    placedAt: '1:05 PM',
    paymentStatus: 'paid_upi',
  },
]
