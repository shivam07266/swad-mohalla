import { useState, useEffect } from 'react'
import type { UserRole, MenuItem, Order, OrderItem } from './types'
import { INITIAL_MENU_ITEMS, INITIAL_ORDERS, INITIAL_ZONES } from './demoData'
import { Navbar } from './components/Navbar'
import { RoleSelectScreen } from './components/RoleSelectScreen'
import { CustomerView } from './components/CustomerView'
import { MerchantView } from './components/MerchantView'
import { DeliveryView } from './components/DeliveryView'
import { ErrorBoundary } from './components/ErrorBoundary'
import { RefreshCw } from 'lucide-react'
import { speakHindi } from './utils/audio'

export default function App() {
  // Current active role
  const [currentRole, setCurrentRole] = useState<UserRole | 'select'>('select')

  // Merchant login state
  const [currentMerchant, setCurrentMerchant] = useState<string>(() => {
    return localStorage.getItem('sm_current_merchant') || 'सुनीता देवी'
  })

  // Cart modal state
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Menu items state
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('sm_menu_items')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed.filter(Boolean)
      } catch {
        return INITIAL_MENU_ITEMS
      }
    }
    return INITIAL_MENU_ITEMS
  })

  // Orders state - with bulletproof sanitizer against missing or malformed fields
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('sm_orders')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
            .filter(Boolean)
            .map((o: any) => ({
              id: o.id || `ord-${Math.random()}`,
              orderCode: o.orderCode || 'SM-12-B-1',
              customerName: o.customerName || 'ग्राहक',
              customerPhone: o.customerPhone || '9876543210',
              deliveryAddress: o.deliveryAddress || 'शास्त्री नगर',
              deliveryZone: o.deliveryZone || 'Zone B',
              deliverySlot: o.deliverySlot || '1:00 - 2:00 PM',
              items: Array.isArray(o.items) ? o.items : [],
              totalAmount: Number(o.totalAmount) || 100,
              status: o.status || 'placed',
              pickupOtp: o.pickupOtp || '1234',
              deliveryOtp: o.deliveryOtp || '5678',
              placedAt: o.placedAt || '12:00 PM',
              cookName: o.cookName || o.items?.[0]?.item?.cookName || 'सुनीता देवी',
              partnerName: o.partnerName,
              paymentStatus: o.paymentStatus || 'paid_upi',
            }))
        }
      } catch {
        return INITIAL_ORDERS
      }
    }
    return INITIAL_ORDERS
  })

  // Cart state
  const [cart, setCart] = useState<{ [itemId: string]: number }>(() => {
    const saved = localStorage.getItem('sm_cart')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return {}
      }
    }
    return {}
  })

  // LocalStorage sync
  useEffect(() => {
    localStorage.setItem('sm_current_merchant', currentMerchant)
  }, [currentMerchant])

  useEffect(() => {
    localStorage.setItem('sm_menu_items', JSON.stringify(menuItems))
  }, [menuItems])

  useEffect(() => {
    localStorage.setItem('sm_orders', JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    localStorage.setItem('sm_cart', JSON.stringify(cart))
  }, [cart])

  // Cart Handlers
  const handleAddToCart = (item: MenuItem) => {
    if (!item || !item.id) return
    setCart(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }))
  }

  const handleRemoveFromCart = (itemId: string) => {
    setCart(prev => {
      const updated = { ...prev }
      if (updated[itemId] > 1) {
        updated[itemId] -= 1
      } else {
        delete updated[itemId]
      }
      return updated
    })
  }

  // Cart Counts
  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0)
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menuItems.find(m => m && m.id === id)
    return sum + (item ? item.price * qty : 0)
  }, 0)

  // Order Placement
  const handlePlaceOrder = (details: {
    customerName: string
    customerPhone: string
    deliveryAddress: string
    deliveryZone: string
    deliverySlot: string
    items: OrderItem[]
    totalAmount: number
    cookName: string
  }): Order => {
    const zoneStr = details.deliveryZone || 'Zone B'
    const zoneLetter = zoneStr.replace('Zone ', '').trim() || 'B'
    const randomKitchen = details.items[0]?.item?.dabbaCodePrefix || 'SM-12'
    const orderCode = `${randomKitchen}-${zoneLetter}-${Math.floor(1 + Math.random() * 9)}`

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderCode,
      customerName: details.customerName || 'ग्राहक',
      customerPhone: details.customerPhone || '9876543210',
      deliveryAddress: details.deliveryAddress || 'शास्त्री नगर',
      deliveryZone: zoneStr,
      deliverySlot: details.deliverySlot || '1:00 - 2:00 PM',
      items: details.items || [],
      totalAmount: details.totalAmount || 100,
      cookName: details.cookName || details.items[0]?.item?.cookName || 'सुनीता देवी',
      status: 'placed',
      pickupOtp: String(Math.floor(1000 + Math.random() * 9000)),
      deliveryOtp: String(Math.floor(1000 + Math.random() * 9000)),
      placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      paymentStatus: 'paid_upi',
    }

    setOrders(prev => [newOrder, ...(prev || [])])
    setCart({})
    return newOrder
  }

  // Merchant Status Updates
  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev =>
      (prev || []).map(o => (o && o.id === orderId ? { ...o, status: newStatus } : o))
    )
  }

  // Merchant Add Dish
  const handleAddNewDish = (dishData: Omit<MenuItem, 'id'>) => {
    const newDish: MenuItem = {
      ...dishData,
      id: `item-${Date.now()}`,
    }
    setMenuItems(prev => [newDish, ...(prev || [])])
  }

  // Delivery Handlers
  const handleAcceptDelivery = (orderId: string, partnerName: string) => {
    setOrders(prev =>
      (prev || []).map(o => (o && o.id === orderId ? { ...o, partnerName } : o))
    )
  }

  const handleConfirmPickup = (orderId: string, _enteredOtp: string) => {
    setOrders(prev =>
      (prev || []).map(o => (o && o.id === orderId ? { ...o, status: 'picked_up' } : o))
    )
    return true
  }

  const handleConfirmDelivery = (orderId: string, _enteredOtp: string) => {
    setOrders(prev =>
      (prev || []).map(o => (o && o.id === orderId ? { ...o, status: 'delivered' } : o))
    )
    return true
  }

  // Reset Demo Data
  const handleResetDemoData = () => {
    localStorage.removeItem('sm_menu_items')
    localStorage.removeItem('sm_orders')
    localStorage.removeItem('sm_cart')
    localStorage.removeItem('sm_current_merchant')
    setMenuItems(INITIAL_MENU_ITEMS)
    setOrders(INITIAL_ORDERS)
    setCart({})
    setCurrentMerchant('सुनीता देवी')
    speakHindi('डेमो डेटा रीसेट किया गया')
  }

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-[#fffbf5] via-[#fff8ef] to-[#fef6e7] text-stone-900">
      {/* Navigation */}
      <Navbar
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        currentMerchant={currentMerchant}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => {
          if (currentRole !== 'customer') setCurrentRole('customer')
          setIsCartOpen(true)
        }}
      />

      {/* Main View based on role with ErrorBoundary */}
      <main className="flex-1">
        <ErrorBoundary onReset={handleResetDemoData}>
          {currentRole === 'select' && (
            <RoleSelectScreen onSelectRole={setCurrentRole} />
          )}

          {currentRole === 'customer' && (
            <CustomerView
              menuItems={menuItems}
              cart={cart}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              onPlaceOrder={handlePlaceOrder}
              customerOrders={orders}
              isCartOpen={isCartOpen}
              onCloseCart={() => setIsCartOpen(false)}
            />
          )}

          {currentRole === 'merchant' && (
            <MerchantView
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onAddNewDish={handleAddNewDish}
              menuItems={menuItems}
              currentMerchant={currentMerchant}
              onSetMerchant={setCurrentMerchant}
            />
          )}

          {currentRole === 'delivery' && (
            <DeliveryView
              orders={orders}
              zones={INITIAL_ZONES}
              onAcceptDelivery={handleAcceptDelivery}
              onConfirmPickup={handleConfirmPickup}
              onConfirmDelivery={handleConfirmDelivery}
            />
          )}
        </ErrorBoundary>
      </main>

      {/* Footer & Demo Reset */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-amber-100 py-3 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-stone-600">
          <span className="font-bold text-stone-900">स्वाद मोहल्ला (Swad Mohalla)</span>
          <button
            onClick={handleResetDemoData}
            className="inline-flex items-center gap-1.5 text-stone-700 hover:text-orange-700 bg-stone-100 hover:bg-orange-50 px-3 py-1 rounded-lg border border-stone-200 transition-colors font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5 text-stone-600" />
            <span>डेमो रीसेट करें</span>
          </button>
        </div>
      </footer>
    </div>
  )
}
