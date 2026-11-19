import React, { useState } from 'react'
import type { Order, DeliveryZone } from '../types'
import { INITIAL_ZONES } from '../demoData'
import { Bike, ArrowRight, MapPin, Sparkles } from 'lucide-react'
import { speakHindi } from '../utils/audio'

interface DeliveryViewProps {
  orders: Order[]
  zones?: DeliveryZone[]
  onAcceptDelivery: (orderId: string, partnerName: string) => void
  onConfirmPickup: (orderId: string, enteredOtp: string) => boolean
  onConfirmDelivery: (orderId: string, enteredOtp: string) => boolean
}

// Flexible zone matcher to avoid any string mismatch crashes
const isZoneMatch = (orderZone?: string, targetZoneCode?: string) => {
  if (!orderZone || !targetZoneCode) return false
  const z1 = String(orderZone).toLowerCase()
  const z2 = String(targetZoneCode).toLowerCase()
  if (z1 === z2 || z1.includes(z2) || z2.includes(z1)) return true
  if (z2.includes('zone a') && (z1.includes('gandhi') || z1.includes('गांधी') || z1.includes('a'))) return true
  if (z2.includes('zone b') && (z1.includes('shastri') || z1.includes('शास्त्री') || z1.includes('b'))) return true
  if (z2.includes('zone c') && (z1.includes('model') || z1.includes('मॉडल') || z1.includes('c'))) return true
  return false
}

export const DeliveryView: React.FC<DeliveryViewProps> = ({
  orders = [],
  zones = INITIAL_ZONES,
  onAcceptDelivery,
  onConfirmPickup,
  onConfirmDelivery,
}) => {
  const [selectedZoneCode, setSelectedZoneCode] = useState<string>('Zone B')
  const [partnerName] = useState('सोनू (Sonu)')
  const [earnings, setEarnings] = useState(70)
  const [trips, setTrips] = useState(2)

  // Active delivery handling
  const [enteredPickupOtp, setEnteredPickupOtp] = useState('')
  const [enteredDeliveryOtp, setEnteredDeliveryOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [showCelebration, setShowCelebration] = useState(false)

  // Safe normalized arrays
  const safeOrders: Order[] = Array.isArray(orders) ? orders.filter(Boolean) : []
  const safeZones: DeliveryZone[] = Array.isArray(zones) && zones.length > 0 ? zones.filter(Boolean) : INITIAL_ZONES

  // Currently active order assigned to partner
  const currentAssignedOrder = safeOrders.find(
    o => o && (o.status === 'packed' || o.status === 'picked_up') && o.partnerName === partnerName
  )

  // Available unassigned orders in selected zone
  const availableOrdersInZone = safeOrders.filter(o => {
    if (!o) return false
    const matchZone = isZoneMatch(o.deliveryZone, selectedZoneCode)
    const canDeliver = o.status === 'packed' || o.status === 'cooking'
    const notAssigned = !o.partnerName
    return matchZone && canDeliver && notAssigned
  })

  const handleAccept = (order: Order) => {
    if (!order || !order.id) return
    onAcceptDelivery(order.id, partnerName)
    speakHindi(`डब्बा ${order.orderCode || ''} स्वीकार किया`)
  }

  const handleVerifyPickup = (order: Order) => {
    if (!order) return
    if (enteredPickupOtp !== order.pickupOtp) {
      setOtpError('गलत OTP! रसोइया से सही कोड पूछें')
      speakHindi('गलत कोड है')
      return
    }

    setOtpError('')
    onConfirmPickup(order.id, enteredPickupOtp)
    setEnteredPickupOtp('')
    speakHindi('पिकअप सफल')
  }

  const handleVerifyDelivery = (order: Order) => {
    if (!order) return
    if (enteredDeliveryOtp !== order.deliveryOtp) {
      setOtpError('गलत OTP! ग्राहक से 4-अंकों का कोड पूछें')
      speakHindi('गलत कोड है')
      return
    }

    setOtpError('')
    onConfirmDelivery(order.id, enteredDeliveryOtp)
    setEnteredDeliveryOtp('')
    setEarnings(prev => prev + 35)
    setTrips(prev => prev + 1)
    setShowCelebration(true)
    speakHindi('डिलीवरी सफल, 35 रुपये जुड़ गए')

    setTimeout(() => {
      setShowCelebration(false)
    }, 4000)
  }

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 pb-24">
      {/* Colorful Partner Banner */}
      <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-2xl p-4 sm:p-5 text-white shadow-md shadow-blue-700/20 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl border border-white/30 shrink-0">
            🛵
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">
                {partnerName}
              </h1>
              <span className="text-xs font-bold bg-white/20 text-white px-2 py-0.5 rounded-md border border-white/30">
                डब्बावाला डिलीवरी
              </span>
            </div>
            <p className="text-xs text-blue-100 font-medium mt-0.5">
              प्रति डब्बा ₹35 निश्चित कमाई • स्वतंत्र डिलीवरी साथी
            </p>
          </div>
        </div>

        {/* Earnings Card */}
        <div className="bg-linear-to-r from-emerald-500 to-teal-500 text-white px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-3 self-start sm:self-auto">
          <div>
            <p className="text-[10px] uppercase font-bold text-emerald-100">आज की कमाई</p>
            <p className="text-xl font-black">₹{earnings}</p>
          </div>
          <div className="border-l border-emerald-400 pl-3 text-xs font-bold text-emerald-100">
            <p>{trips} ट्रिप्स</p>
            <p className="text-[10px] text-emerald-200">पूर्ण</p>
          </div>
        </div>
      </div>

      {/* Celebration Alert */}
      {showCelebration && (
        <div className="mb-4 p-3.5 bg-emerald-500 text-white rounded-2xl shadow-lg flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-amber-300" />
            <div>
              <p className="font-black text-sm">शाबाश! डिलीवरी पूरी हुई 🎉</p>
              <p className="text-xs text-emerald-100">बटुए में +₹35 जमा कर दिए गए हैं।</p>
            </div>
          </div>
        </div>
      )}

      {/* Zone Selector Pills */}
      <div className="mb-5">
        <label className="block text-xs font-bold text-stone-800 mb-2 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span>अपना इलाका (Zone) चुनें:</span>
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {safeZones.map(zone => {
            if (!zone) return null
            const count = safeOrders.filter(
              o => o && isZoneMatch(o.deliveryZone, zone.code) && o.status !== 'delivered'
            ).length

            return (
              <button
                key={zone.id || zone.code}
                onClick={() => {
                  setSelectedZoneCode(zone.code)
                  speakHindi(zone.nameHi || zone.code)
                }}
                className={`p-3 rounded-2xl border-2 text-left transition-all ${
                  selectedZoneCode === zone.code
                    ? 'border-blue-600 bg-blue-50/80 text-blue-950 shadow-xs scale-102'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                }`}
              >
                <div className="font-black text-xs sm:text-sm truncate">{zone.nameHi}</div>
                <div className="text-[11px] font-semibold text-stone-500 mt-0.5">
                  {zone.code}
                </div>
                <div className="mt-1">
                  {count > 0 ? (
                    <span className="text-[10px] font-bold bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded">
                      {count} डब्बे तैयार
                    </span>
                  ) : (
                    <span className="text-[10px] text-stone-400 font-semibold">शांत</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Active Trip Progression (if assigned) */}
      {currentAssignedOrder && (
        <div className="mb-6 bg-white rounded-3xl p-5 border-2 border-blue-500 shadow-lg animate-fade-in">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-100">
            <span className="font-mono font-black text-xs bg-blue-100 text-blue-900 px-3 py-1 rounded-xl">
              🏷️ डब्बा कोड: {currentAssignedOrder.orderCode || 'SM-01'}
            </span>
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
              कमाई: +₹35
            </span>
          </div>

          <div className="space-y-3 text-xs text-stone-800 mb-4">
            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold shrink-0 text-xs">
                1
              </span>
              <div>
                <p className="font-bold text-stone-900">पिकअप रसोई:</p>
                <p className="text-stone-600">{currentAssignedOrder.cookName || 'रसोई'} की रसोई</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0 text-xs">
                2
              </span>
              <div>
                <p className="font-bold text-stone-900">ग्राहक का पता (Drop):</p>
                <p className="text-stone-600">
                  {currentAssignedOrder.customerName || 'ग्राहक'} ({currentAssignedOrder.deliveryAddress || 'पता'})
                </p>
              </div>
            </div>
          </div>

          {otpError && (
            <p className="text-xs font-bold text-red-600 mb-3 bg-red-50 p-2 rounded-xl">⚠️ {otpError}</p>
          )}

          {currentAssignedOrder.status === 'packed' ? (
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
              <p className="text-xs font-bold text-stone-800 mb-1.5">रसोइया का 4-अंकों का पिकअप OTP डालें:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={4}
                  placeholder="OTP"
                  value={enteredPickupOtp}
                  onChange={(e) => setEnteredPickupOtp(e.target.value)}
                  className="w-28 text-center font-mono font-black text-base p-2 rounded-xl border-2 border-stone-300 focus:outline-blue-500 bg-white"
                />
                <button
                  onClick={() => handleVerifyPickup(currentAssignedOrder)}
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95"
                >
                  पिकअप कन्फर्म करें
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
              <p className="text-xs font-bold text-stone-800 mb-1.5">ग्राहक का 4-अंकों का डिलीवरी OTP डालें:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={4}
                  placeholder="OTP"
                  value={enteredDeliveryOtp}
                  onChange={(e) => setEnteredDeliveryOtp(e.target.value)}
                  className="w-28 text-center font-mono font-black text-base p-2 rounded-xl border-2 border-stone-300 focus:outline-emerald-500 bg-white"
                />
                <button
                  onClick={() => handleVerifyDelivery(currentAssignedOrder)}
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95"
                >
                  डिलीवर कन्फर्म (कमाई ₹35)
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Available Delivery Requests List */}
      <div>
        <h2 className="font-black text-sm text-stone-900 mb-2.5 flex items-center gap-1.5">
          <Bike className="w-4 h-4 text-blue-600" />
          <span>{selectedZoneCode} में उपलब्ध डब्बे ({availableOrdersInZone.length})</span>
        </h2>

        {availableOrdersInZone.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 border border-stone-200 text-center text-xs text-stone-500">
            इस इलाके में अभी कोई लंबित डब्बा नहीं है।
          </div>
        ) : (
          <div className="space-y-2.5">
            {availableOrdersInZone.map(order => {
              if (!order) return null
              return (
                <div
                  key={order.id || Math.random().toString()}
                  className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-black text-xs text-stone-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                        {order.orderCode || 'SM-00'}
                      </span>
                      <span className="font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                        कमाई: ₹35
                      </span>
                    </div>
                    <p className="text-stone-700 font-medium">
                      रसोई: <strong>{order.cookName || 'रसोई'}</strong> ➔ ड्रॉप: <strong>{order.deliveryAddress || 'पता'}</strong>
                    </p>
                  </div>

                  <button
                    disabled={!!currentAssignedOrder}
                    onClick={() => handleAccept(order)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1 shrink-0"
                  >
                    <span>स्वीकारें</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
