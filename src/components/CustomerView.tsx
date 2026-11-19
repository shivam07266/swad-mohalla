import React, { useState } from 'react'
import type { MenuItem, Order, OrderItem } from '../types'
import { Plus, Minus, ArrowRight, X, Check, QrCode, MapPin } from 'lucide-react'
import { speakHindi } from '../utils/audio'

interface CustomerViewProps {
  menuItems: MenuItem[]
  cart: { [itemId: string]: number }
  onAddToCart: (item: MenuItem) => void
  onRemoveFromCart: (itemId: string) => void
  onPlaceOrder: (orderDetails: {
    customerName: string
    customerPhone: string
    deliveryAddress: string
    deliveryZone: string
    deliverySlot: string
    items: OrderItem[]
    totalAmount: number
    cookName: string
  }) => Order
  customerOrders: Order[]
  isCartOpen?: boolean
  onCloseCart?: () => void
}

export const CustomerView: React.FC<CustomerViewProps> = ({
  menuItems,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onPlaceOrder,
  customerOrders,
  isCartOpen,
  onCloseCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false)
  const [showUpiModal, setShowUpiModal] = useState<boolean>(false)
  const [selectedUpiApp, setSelectedUpiApp] = useState<'phonepe' | 'gpay' | 'paytm'>('phonepe')
  
  // Checkout details
  const [customerName, setCustomerName] = useState('अमित कुमार')
  const [customerPhone, setCustomerPhone] = useState('9876543210')
  const [deliveryAddress, setDeliveryAddress] = useState('मकान नं. 24, गली नं. 2')
  const [selectedZone, setSelectedZone] = useState('Zone B')
  const [selectedSlot, setSelectedSlot] = useState('1:00 - 2:00 PM')
  const [isProcessing, setIsProcessing] = useState(false)
  const [latestOrder, setLatestOrder] = useState<Order | null>(null)

  // Cart calculations
  const cartItemsList: OrderItem[] = Object.entries(cart)
    .filter(([_, qty]) => qty > 0)
    .map(([id, qty]) => {
      const item = menuItems.find(m => m.id === id)!
      return { item, quantity: qty }
    })
    .filter(i => i.item !== undefined)

  const cartSubtotal = cartItemsList.reduce(
    (sum, { item, quantity }) => sum + (item.price || 0) * quantity,
    0
  )
  const deliveryFee = cartItemsList.length > 0 ? 25 : 0
  const totalAmount = cartSubtotal + deliveryFee

  // Filter items
  const filteredItems = menuItems.filter(item => {
    if (selectedCategory === 'all') return true
    return item.category === selectedCategory
  })

  // Dish emoji mapper for visual delight
  const getDishEmoji = (category: string, name: string) => {
    if (name.includes('अचार')) return '🥭'
    if (name.includes('पराठे')) return '🫓'
    if (name.includes('पापड़')) return '🍘'
    if (name.includes('हलवा')) return '🍯'
    if (name.includes('कढ़ी')) return '🍛'
    if (category === 'thali') return '🍲'
    return '🍱'
  }

  // Handle Checkout & Order Placement
  const handleConfirmUpi = () => {
    setIsProcessing(true)
    speakHindi('UPI भुगतान हो रहा है')

    setTimeout(() => {
      const primaryCook = cartItemsList[0]?.item.cookName || 'सुनीता देवी'
      const newOrder = onPlaceOrder({
        customerName,
        customerPhone,
        deliveryAddress: `${deliveryAddress}, ${selectedZone}`,
        deliveryZone: selectedZone,
        deliverySlot: selectedSlot,
        items: cartItemsList,
        totalAmount,
        cookName: primaryCook,
      })

      setIsProcessing(false)
      setShowUpiModal(false)
      setShowCheckoutModal(false)
      setLatestOrder(newOrder)
      if (onCloseCart) onCloseCart()
      speakHindi(`ऑर्डर सफल! कोड है ${newOrder.orderCode}`)
    }, 1000)
  }

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 pb-28">
      {/* Header Banner - Rich Warm Saffron Gradient */}
      <div className="bg-linear-to-r from-orange-600 via-amber-600 to-orange-500 rounded-3xl p-4 sm:p-5 text-white shadow-lg shadow-orange-600/20 mb-5 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold mb-2">
              <MapPin className="w-3.5 h-3.5 text-amber-200" />
              <span>शास्त्री नगर • वार्ड 4</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              घर का ताजा, शुद्ध भोजन
            </h1>
            <p className="text-xs text-orange-100 font-medium mt-0.5">
              मोहल्ले की गृहणियों के हाथ का स्वाद • डब्बावाला सुपरफास्ट डिलीवरी
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/25">
            <span className="text-2xl">🌱</span>
            <div className="text-xs">
              <p className="font-black">100% शुद्ध शाकाहारी</p>
              <p className="text-orange-100 text-[11px]">हाइजीनिक घर की रसोई</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Banner if an order was just placed */}
      {latestOrder && (
        <div className="mb-4 p-3.5 bg-emerald-50 border-2 border-emerald-400 rounded-2xl flex items-center justify-between gap-3 shadow-xs animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shrink-0">
              ✓
            </div>
            <div>
              <p className="text-xs font-black text-emerald-950">
                ऑर्डर बुक हुआ! डब्बा कोड: <span className="font-mono bg-emerald-200 px-1.5 py-0.5 rounded text-emerald-900">{latestOrder.orderCode}</span>
              </p>
              <p className="text-[11px] text-emerald-800 font-semibold mt-0.5">
                डिलीवरी OTP: <strong className="font-mono text-sm">{latestOrder.deliveryOtp}</strong> (डिलीवरी साथी को दें)
              </p>
            </div>
          </div>
          <button
            onClick={() => setLatestOrder(null)}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Active Orders Strip */}
      {customerOrders.length > 0 && (
        <div className="mb-5 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black text-stone-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-600 animate-ping" />
              <span>आपके सक्रिय ऑर्डर्स ({customerOrders.length}):</span>
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {customerOrders.map(order => (
              <div 
                key={order.id} 
                className="bg-white rounded-2xl p-3 border border-orange-200 shadow-xs flex items-center justify-between gap-2.5"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs bg-amber-100 text-amber-950 px-2 py-0.5 rounded-md border border-amber-300">
                      📦 {order.orderCode}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                      order.status === 'picked_up' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'packed' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {order.status === 'placed' && 'ऑर्डर मिला'}
                      {order.status === 'cooking' && '🍲 तैयार हो रहा है'}
                      {order.status === 'packed' && '📦 डब्बा पैक'}
                      {order.status === 'picked_up' && '🛵 रास्ते में'}
                      {order.status === 'delivered' && '✓ डिलीवर हुआ'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 font-semibold mt-1">
                    रसोई: <strong className="text-stone-900">{order.cookName}</strong> • ₹{order.totalAmount}
                  </p>
                </div>

                <div className="text-right shrink-0 bg-stone-50 border border-stone-200 p-1.5 rounded-xl">
                  <p className="text-[10px] text-stone-500 font-bold">डिलिवरी OTP</p>
                  <p className="font-mono font-black text-sm text-stone-900">
                    {order.deliveryOtp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Colorful Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {[
          { id: 'all', label: 'सभी', emoji: '🍽️', color: 'from-orange-500 to-amber-500' },
          { id: 'thali', label: 'थाली व भोजन', emoji: '🍲', color: 'from-amber-500 to-orange-600' },
          { id: 'pickle', label: 'घर का अचार', emoji: '🥭', color: 'from-yellow-500 to-amber-600' },
          { id: 'papad', label: 'कुरकुरे पापड़', emoji: '🍘', color: 'from-rose-500 to-orange-500' },
          { id: 'snack', label: 'नाश्ता व मिठाई', emoji: '🍯', color: 'from-purple-500 to-pink-600' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id)
              speakHindi(cat.label)
            }}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat.id
                ? `bg-linear-to-r ${cat.color} text-white shadow-md scale-102`
                : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Vibrant Dish List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredItems.map(item => {
          const qty = cart[item.id] || 0
          const emoji = getDishEmoji(item.category, item.name)

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-3.5 border border-amber-100 hover:border-orange-400 shadow-xs hover:shadow-lg transition-all duration-300 flex items-center justify-between gap-3 group"
            >
              {/* Dish Visual + Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl p-1.5 bg-amber-50 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                    {emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded border border-emerald-600 flex items-center justify-center shrink-0 p-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      </span>
                      <h3 className="font-black text-stone-900 text-sm leading-snug truncate">
                        {item.name}
                      </h3>
                    </div>

                    {/* Only Merchant Name as explicitly required */}
                    <p className="text-xs font-bold text-orange-700 mt-0.5 truncate">
                      रसोई: {item.cookName}
                    </p>
                  </div>
                </div>

                <div className="mt-1.5 pl-1 flex items-center gap-2">
                  <span className="font-black text-stone-900 text-base">₹{item.price}</span>
                  {item.portionsLeft && (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                      सिर्फ {item.portionsLeft} बचे
                    </span>
                  )}
                </div>
              </div>

              {/* Colorful Add / Quantity Button */}
              <div className="shrink-0">
                {qty === 0 ? (
                  <button
                    onClick={() => {
                      onAddToCart(item)
                      speakHindi(`${item.name} जोड़ा गया`)
                    }}
                    className="px-4 py-2 bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white font-black text-xs rounded-xl shadow-xs transition-all"
                  >
                    + जोड़ें
                  </button>
                ) : (
                  <div className="flex items-center gap-1 bg-stone-900 text-white p-1 rounded-xl shadow-sm">
                    <button
                      onClick={() => onRemoveFromCart(item.id)}
                      className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-stone-700 active:scale-90"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-black text-xs px-1 min-w-[14px] text-center">{qty}</span>
                    <button
                      onClick={() => onAddToCart(item)}
                      className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-stone-700 active:scale-90"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Floating Bottom Cart Bar */}
      {cartItemsList.length > 0 && !showCheckoutModal && (
        <div className="fixed bottom-3 left-3 right-3 max-w-md mx-auto z-30">
          <div className="bg-linear-to-r from-stone-950 via-stone-900 to-stone-950 text-white rounded-2xl p-3.5 shadow-2xl flex items-center justify-between gap-2 border border-stone-700 animate-slide-up">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-500 text-white font-black text-xs flex items-center justify-center">
                {cartItemsList.reduce((acc, curr) => acc + curr.quantity, 0)}
              </div>
              <div>
                <p className="text-[11px] text-stone-300">डब्बा कार्ट तैयार</p>
                <p className="text-base font-black text-amber-400">₹{cartSubtotal}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setShowCheckoutModal(true)
                speakHindi('ऑर्डर आगे बढ़ाएं')
              }}
              className="flex items-center gap-1.5 bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black px-4 py-2 rounded-xl text-xs shadow-md transition-all active:scale-95"
            >
              <span>ऑर्डर करें</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Checkout Drawer */}
      {(showCheckoutModal || isCartOpen) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛍️</span>
                <h3 className="font-black text-lg text-stone-900">ऑर्डर व डिलीवरी पता</h3>
              </div>
              <button 
                onClick={() => {
                  setShowCheckoutModal(false)
                  if (onCloseCart) onCloseCart()
                }}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selected Items Summary */}
            <div className="space-y-1.5 mb-3 bg-amber-50/60 p-3 rounded-2xl border border-amber-200 text-xs">
              <p className="font-bold text-amber-950 mb-1">चुने हुए व्यंजन:</p>
              {cartItemsList.map(({ item, quantity }) => (
                <div key={item.id} className="flex justify-between text-stone-800 font-semibold">
                  <span>{item.name} × {quantity}</span>
                  <span className="font-black">₹{item.price * quantity}</span>
                </div>
              ))}
            </div>

            {/* Delivery Inputs */}
            <div className="space-y-3 mb-4 text-xs">
              <div>
                <label className="block font-bold text-stone-800 mb-1">नाम व फोन</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="p-2.5 rounded-xl border border-stone-300 focus:outline-orange-500 w-full font-medium"
                    placeholder="नाम"
                  />
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="p-2.5 rounded-xl border border-stone-300 focus:outline-orange-500 w-full font-medium"
                    placeholder="फोन"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">डिलीवरी ज़ोन (Zone)</label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="p-2.5 rounded-xl border border-stone-300 bg-white focus:outline-orange-500 w-full font-bold"
                >
                  <option value="Zone B">ज़ोन B - शास्त्री नगर</option>
                  <option value="Zone A">ज़ोन A - गांधी नगर</option>
                  <option value="Zone C">ज़ोन C - मॉडल टाउन</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">मकान नंबर / पता</label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="p-2.5 rounded-xl border border-stone-300 focus:outline-orange-500 w-full font-medium"
                  placeholder="मकान नंबर, गली"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">डिलीवरी समय स्लॉट</label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="p-2.5 rounded-xl border border-stone-300 bg-white focus:outline-orange-500 w-full font-medium"
                >
                  <option value="1:00 - 2:00 PM">दोपहर 1:00 - 2:00 PM</option>
                  <option value="7:30 - 8:30 PM">शाम 7:30 - 8:30 PM</option>
                </select>
              </div>
            </div>

            {/* Bill Summary */}
            <div className="bg-stone-50 p-3 rounded-2xl mb-4 text-xs space-y-1.5 border border-stone-200">
              <div className="flex justify-between text-stone-600">
                <span>खाना मूल्य:</span>
                <span>₹{cartSubtotal}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>डब्बावाला डिलीवरी शुल्क:</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between font-black text-stone-900 pt-1.5 border-t border-stone-200 text-sm">
                <span>कुल राशि:</span>
                <span className="text-orange-600 text-base">₹{totalAmount}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowUpiModal(true)
                speakHindi(`कुल ${totalAmount} रुपये UPI से दें`)
              }}
              className="w-full py-3 bg-linear-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <QrCode className="w-4 h-4" />
              <span>UPI से भुगतान करें (₹{totalAmount})</span>
            </button>
          </div>
        </div>
      )}

      {/* Colorful UPI Payment Modal */}
      {showUpiModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center">
            <div className="w-12 h-12 bg-linear-to-tr from-emerald-500 to-teal-400 text-white rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-md shadow-emerald-500/20">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="font-black text-xl text-stone-900 mb-0.5">UPI भुगतान</h3>
            <p className="text-xs text-stone-500 mb-4">Swad Mohalla Direct Merchant UPI</p>

            {/* UPI Brand Options */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                onClick={() => setSelectedUpiApp('phonepe')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border-2 ${
                  selectedUpiApp === 'phonepe'
                    ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-xs'
                    : 'border-stone-200 text-stone-600'
                }`}
              >
                🟣 PhonePe
              </button>
              <button
                onClick={() => setSelectedUpiApp('gpay')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border-2 ${
                  selectedUpiApp === 'gpay'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xs'
                    : 'border-stone-200 text-stone-600'
                }`}
              >
                🔵 GPay
              </button>
              <button
                onClick={() => setSelectedUpiApp('paytm')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border-2 ${
                  selectedUpiApp === 'paytm'
                    ? 'border-sky-500 bg-sky-50 text-sky-900 shadow-xs'
                    : 'border-stone-200 text-stone-600'
                }`}
              >
                💠 Paytm
              </button>
            </div>

            {/* QR Mock Card */}
            <div className="bg-stone-50 p-4 rounded-2xl border-2 border-dashed border-stone-300 w-44 h-44 mx-auto mb-4 flex flex-col items-center justify-center relative">
              <QrCode className="w-28 h-28 text-stone-900 opacity-90" />
              <span className="font-black text-emerald-800 text-sm bg-white px-2 py-0.5 rounded-md border border-emerald-300 shadow-xs mt-1">
                ₹{totalAmount}
              </span>
            </div>

            <button
              disabled={isProcessing}
              onClick={handleConfirmUpi}
              className="w-full py-3 bg-linear-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              {isProcessing ? 'पेमेंट प्रोसेस हो रहा है...' : (
                <>
                  <Check className="w-4 h-4" />
                  <span>पेमेंट कन्फर्म करें (₹{totalAmount})</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowUpiModal(false)}
              className="mt-3 text-xs text-stone-500 hover:text-stone-800 font-bold"
            >
              रद्द करें (Cancel)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
