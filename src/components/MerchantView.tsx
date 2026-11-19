import React, { useState } from 'react'
import type { MenuItem, Order, FoodCategory } from '../types'
import { AVAILABLE_MERCHANTS } from '../demoData'
import { PlusCircle, Package, ArrowRight, ChevronDown, Check, TrendingUp, Sparkles, ChefHat } from 'lucide-react'
import { speakHindi } from '../utils/audio'

interface MerchantViewProps {
  orders: Order[]
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void
  onAddNewDish: (dish: Omit<MenuItem, 'id'>) => void
  menuItems: MenuItem[]
  currentMerchant: string
  onSetMerchant: (name: string) => void
}

export const MerchantView: React.FC<MerchantViewProps> = ({
  orders,
  onUpdateOrderStatus,
  onAddNewDish,
  menuItems,
  currentMerchant,
  onSetMerchant,
}) => {
  const [showMerchantPicker, setShowMerchantPicker] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  // Add Dish form fields
  const [dishName, setDishName] = useState('')
  const [dishPrice, setDishPrice] = useState(80)
  const [dishCategory, setDishCategory] = useState<FoodCategory>('thali')

  // Find active merchant profile
  const activeProfile = AVAILABLE_MERCHANTS.find(m => m.name === currentMerchant) || AVAILABLE_MERCHANTS[0]

  // Safe filtering: never throw on missing cookName
  const merchantOrders = (orders || []).filter(o => {
    const cook = (o.cookName || '').toLowerCase()
    const target = (currentMerchant || activeProfile.name).toLowerCase()
    return cook.includes(target) || target.includes(cook)
  })

  const merchantDishes = (menuItems || []).filter(m => {
    const cook = (m.cookName || '').toLowerCase()
    const target = (currentMerchant || activeProfile.name).toLowerCase()
    return cook.includes(target) || target.includes(cook)
  })

  const totalSales = merchantOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  const activeOrdersCount = merchantOrders.filter(o => o.status !== 'delivered').length

  const handleAddDish = (e: React.FormEvent) => {
    e.preventDefault()
    if (!dishName.trim()) return

    onAddNewDish({
      name: dishName.trim(),
      price: Number(dishPrice),
      category: dishCategory,
      isVeg: true,
      portionsLeft: 10,
      cookName: currentMerchant || activeProfile.name,
      kitchenZone: activeProfile.zone || 'Zone B',
      dabbaCodePrefix: activeProfile.code || 'SM-12',
    })

    speakHindi(`${dishName} जोड़ दिया गया`)
    setDishName('')
    setDishPrice(80)
    setShowAddForm(false)
  }

  // If merchant is not selected, show colorful selection cards directly
  if (!currentMerchant) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 animate-fade-in">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20 mx-auto mb-3">
            👩‍🍳
          </div>
          <h2 className="text-2xl font-black text-stone-900 mb-1">
            अपनी रसोई (Merchant) चुनें
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-medium">
            Select your kitchen to view your orders and menu
          </p>
        </div>

        {/* Colorful Selection Grid */}
        <div className="space-y-3">
          {AVAILABLE_MERCHANTS.map((m) => {
            const orderCount = (orders || []).filter(o => (o.cookName || '').includes(m.name)).length
            return (
              <button
                key={m.id}
                onClick={() => {
                  onSetMerchant(m.name)
                  speakHindi(`${m.name} की रसोई`)
                }}
                className="w-full bg-white hover:bg-emerald-50/70 border-2 border-emerald-100 hover:border-emerald-500 rounded-2xl p-4 text-left transition-all shadow-xs hover:shadow-md flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-3xl p-2.5 rounded-xl bg-emerald-50 group-hover:scale-110 transition-transform">
                    {m.avatarEmoji}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-stone-900 text-base">{m.name}</h3>
                      <span className="font-mono text-[11px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                        {m.code}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 font-medium mt-0.5">
                      {m.specialty} • {m.zone}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  {orderCount > 0 ? (
                    <span className="px-2.5 py-1 bg-orange-100 text-orange-800 font-bold text-xs rounded-full">
                      {orderCount} ऑर्डर
                    </span>
                  ) : (
                    <span className="text-stone-400 text-xs font-semibold">तैयार</span>
                  )}
                  <div className="flex items-center justify-end text-emerald-600 text-xs font-bold mt-1 group-hover:translate-x-1 transition-transform">
                    <span>खोलें</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-5 pb-24">
      {/* Colorful Merchant Profile Header */}
      <div className="bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-2xl p-4 sm:p-5 text-white shadow-md shadow-emerald-700/20 mb-5 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl border border-white/30 shrink-0">
              {activeProfile.avatarEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">
                  {currentMerchant} की रसोई
                </h1>
                <span className="text-xs font-mono font-bold bg-white/20 text-white px-2 py-0.5 rounded-md border border-white/30">
                  {activeProfile.code}
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium mt-0.5">
                {activeProfile.specialty} • {activeProfile.zone}
              </p>
            </div>
          </div>

          {/* Quick Select Merchant Dropdown Trigger */}
          <button
            onClick={() => setShowMerchantPicker(!showMerchantPicker)}
            className="self-start sm:self-auto flex items-center gap-2 bg-white text-emerald-900 font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs hover:bg-emerald-50 transition-colors"
          >
            <span>रसोई बदलें (Switch)</span>
            <ChevronDown className="w-4 h-4 text-emerald-700" />
          </button>
        </div>

        {/* Merchant Picker Dropdown Modal */}
        {showMerchantPicker && (
          <div className="absolute top-full right-4 mt-2 z-50 w-72 bg-white rounded-2xl p-3 shadow-2xl border border-stone-200 text-stone-900 animate-fade-in">
            <p className="text-xs font-bold text-stone-500 mb-2 px-1">रसोई का चयन करें:</p>
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {AVAILABLE_MERCHANTS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    onSetMerchant(m.name)
                    setShowMerchantPicker(false)
                    speakHindi(`${m.name} की रसोई चुनी गई`)
                  }}
                  className={`w-full p-2 rounded-xl flex items-center justify-between text-left text-xs font-semibold transition-all ${
                    m.name === currentMerchant
                      ? 'bg-emerald-100 text-emerald-950 font-bold'
                      : 'hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{m.avatarEmoji}</span>
                    <span>{m.name}</span>
                  </div>
                  {m.name === currentMerchant && (
                    <Check className="w-4 h-4 text-emerald-700" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Colorful Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 text-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-emerald-100 uppercase tracking-wide">आज की कुल बिक्री</p>
            <p className="text-2xl font-black mt-0.5">₹{totalSales}</p>
            <p className="text-[10px] text-emerald-100 font-medium">सीधे UPI खाते में</p>
          </div>
          <TrendingUp className="w-8 h-8 text-emerald-200/80" />
        </div>

        <div className="bg-linear-to-br from-amber-500 to-orange-500 rounded-2xl p-4 text-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-amber-100 uppercase tracking-wide">सक्रिय ऑर्डर्स</p>
            <p className="text-2xl font-black mt-0.5">{activeOrdersCount} डब्बे</p>
            <p className="text-[10px] text-amber-100 font-medium">पैक व पिकअप हेतु</p>
          </div>
          <Package className="w-8 h-8 text-amber-200/80" />
        </div>

        <div className="bg-linear-to-br from-violet-600 to-purple-600 rounded-2xl p-4 text-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-purple-100 uppercase tracking-wide">वित्त साथी शुद्ध लाभ</p>
            <p className="text-2xl font-black mt-0.5">₹{Math.round(totalSales * 0.65)}</p>
            <p className="text-[10px] text-purple-100 font-medium">लागत काटकर बचत (~65%)</p>
          </div>
          <Sparkles className="w-8 h-8 text-purple-200/80" />
        </div>
      </div>

      {/* Orders List Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            <span>ऑर्डर सूची ({merchantOrders.length})</span>
          </h2>
        </div>

        {merchantOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border-2 border-dashed border-stone-200 text-center">
            <p className="font-bold text-stone-700 text-sm mb-1">इस रसोई के लिए अभी कोई ऑर्डर नहीं है</p>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              ऊपर 'ग्राहक' टैब पर जाकर {currentMerchant} का खाना ऑर्डर करें, वह तुरंत यहाँ दिखाई देगा।
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {merchantOrders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-3.5"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono font-black text-xs px-2.5 py-1 bg-amber-100 text-amber-950 rounded-lg border border-amber-200">
                      📦 {order.orderCode}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                      order.status === 'picked_up' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'packed' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {order.status === 'placed' && 'नया ऑर्डर मिला'}
                      {order.status === 'cooking' && '🍲 पक रहा है'}
                      {order.status === 'packed' && '📦 डब्बा पैक (Awaiting Pickup)'}
                      {order.status === 'picked_up' && '🛵 डिलीवरी साथी ले गया'}
                      {order.status === 'delivered' && '✓ डिलीवर हुआ'}
                    </span>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      UPI Paid ₹{order.totalAmount}
                    </span>
                  </div>

                  <p className="font-bold text-stone-900 text-sm">
                    {order.items.map(i => `${i.item?.name || 'व्यंजन'} (x${i.quantity})`).join(', ')}
                  </p>
                  <p className="text-xs text-stone-600 mt-0.5">
                    ग्राहक: <strong className="text-stone-800">{order.customerName}</strong> • {order.deliveryAddress}
                  </p>
                  <p className="text-[11px] text-stone-500 font-medium">
                    स्लॉट: {order.deliverySlot}
                  </p>
                </div>

                {/* Status Progression Controls */}
                <div className="shrink-0 flex items-center gap-2">
                  {order.status === 'placed' && (
                    <button
                      onClick={() => {
                        onUpdateOrderStatus(order.id, 'cooking')
                        speakHindi('स्वीकार किया गया')
                      }}
                      className="px-4 py-2 bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95"
                    >
                      स्वीकार करें व बनाएं
                    </button>
                  )}

                  {order.status === 'cooking' && (
                    <button
                      onClick={() => {
                        onUpdateOrderStatus(order.id, 'packed')
                        speakHindi('डब्बा पैक हो गया')
                      }}
                      className="px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <Package className="w-4 h-4" />
                      <span>डब्बा पैक हो गया</span>
                    </button>
                  )}

                  {order.status === 'packed' && (
                    <div className="bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-xl text-right">
                      <p className="text-[10px] text-blue-800 font-bold">डिलीवरी साथी को पिकअप OTP दें:</p>
                      <p className="font-mono font-black text-base text-blue-700">{order.pickupOtp}</p>
                    </div>
                  )}

                  {order.status === 'picked_up' && (
                    <div className="bg-purple-50 border border-purple-200 px-3.5 py-1.5 rounded-xl text-purple-800 font-bold text-xs">
                      रास्ते में है 🛵
                    </div>
                  )}

                  {order.status === 'delivered' && (
                    <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-emerald-800 font-bold text-xs">
                      डिलीवरी पूरी ✓
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dishes Management */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-amber-600" />
            <span>आपकी दुकान के व्यंजन ({merchantDishes.length})</span>
          </h2>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3.5 py-2 rounded-xl transition-all"
          >
            <PlusCircle className="w-4 h-4 text-emerald-700" />
            <span>{showAddForm ? 'बंद करें' : '+ नया व्यंजन जोड़ें'}</span>
          </button>
        </div>

        {/* Add Dish Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddDish}
            className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-emerald-300 shadow-sm mb-4 space-y-3 text-xs animate-fade-in"
          >
            <div>
              <label className="block font-bold text-stone-800 mb-1">व्यंजन का नाम:</label>
              <input
                type="text"
                required
                placeholder="उदा. स्पेशल पनीर भुर्जी थाली"
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-emerald-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-800 mb-1">कीमत (₹):</label>
                <input
                  type="number"
                  required
                  min={10}
                  value={dishPrice}
                  onChange={(e) => setDishPrice(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-emerald-500 font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">श्रेणी:</label>
                <select
                  value={dishCategory}
                  onChange={(e) => setDishCategory(e.target.value as FoodCategory)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white focus:outline-emerald-500 font-medium"
                >
                  <option value="thali">थाली / भोजन</option>
                  <option value="pickle">अचार</option>
                  <option value="papad">पापड़</option>
                  <option value="snack">नाश्ता / मिठाई</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-2 text-stone-600 hover:text-stone-900 font-semibold"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-all active:scale-95"
              >
                दुकान में जोड़ें
              </button>
            </div>
          </form>
        )}

        {/* Existing Dishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {merchantDishes.map(dish => (
            <div
              key={dish.id}
              className="bg-white p-3 rounded-xl border border-stone-200 flex items-center justify-between text-xs shadow-2xs"
            >
              <div className="truncate">
                <span className="font-bold text-stone-900 text-sm block truncate">{dish.name}</span>
                <span className="text-emerald-700 font-black text-sm">₹{dish.price}</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                लाइव मेनू
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
