import React from 'react'
import type { UserRole } from '../types'
import { ShoppingBag, Volume2, ChefHat, Bike, User, ChevronRight } from 'lucide-react'
import { speakHindi } from '../utils/audio'

interface NavbarProps {
  currentRole: UserRole | 'select'
  onSelectRole: (role: UserRole | 'select') => void
  currentMerchant: string
  cartCount: number
  cartTotal: number
  onOpenCart: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onSelectRole,
  currentMerchant,
  cartCount,
  cartTotal,
  onOpenCart,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <button 
          onClick={() => onSelectRole('select')} 
          className="flex items-center gap-2 text-left focus:outline-hidden"
        >
          <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-orange-600 text-white flex items-center justify-center font-black text-base shrink-0">
            स्
          </span>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-bold text-base sm:text-lg text-stone-900 tracking-tight">स्वाद मोहल्ला</span>
              <span className="text-[10px] uppercase font-semibold text-stone-700 hidden xs:inline">Swad Mohalla</span>
            </div>
            {currentRole === 'merchant' && currentMerchant ? (
              <p className="text-[11px] text-emerald-800 font-semibold truncate max-w-[130px] sm:max-w-none">
                रसोई: {currentMerchant}
              </p>
            ) : (
              <p className="text-[11px] text-stone-700 hidden sm:block">घर का ताजा भोजन</p>
            )}
          </div>
        </button>

        {/* Central Switcher (Visible on PC & Tablet) */}
        <nav className="hidden md:flex items-center bg-stone-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => onSelectRole('customer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              currentRole === 'customer'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-orange-600" />
            <span>ग्राहक (Customer)</span>
          </button>
          <button
            onClick={() => onSelectRole('merchant')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              currentRole === 'merchant'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5 text-emerald-600" />
            <span>रसोई (Merchant)</span>
          </button>
          <button
            onClick={() => onSelectRole('delivery')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              currentRole === 'delivery'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Bike className="w-3.5 h-3.5 text-blue-600" />
            <span>डिलीवरी (Delivery)</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mobile Role Switch Dropdown / Quick Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => onSelectRole('select')}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-stone-100 text-stone-800 flex items-center gap-1"
            >
              <span>
                {currentRole === 'customer' && '🛒 ग्राहक'}
                {currentRole === 'merchant' && '👩‍🍳 रसोई'}
                {currentRole === 'delivery' && '🛵 डिलीवरी'}
                {currentRole === 'select' && 'भूमिका चुनें'}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-700" />
            </button>
          </div>

          {/* Voice Prompt Assistant */}
          <button
            onClick={() => {
              if (currentRole === 'customer') speakHindi('ग्राहक स्क्रीन। व्यंजन चुनें और आर्डर करें')
              else if (currentRole === 'merchant') speakHindi(currentMerchant ? `${currentMerchant} की रसोई` : 'रसोई स्क्रीन। अपना नाम दर्ज करें')
              else if (currentRole === 'delivery') speakHindi('डिलीवरी साथी स्क्रीन। अपना इलाका चुनें')
              else speakHindi('स्वाद मोहल्ला। अपनी भूमिका चुनें')
            }}
            title="आवाज़ सुनें"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-50"
          >
            <Volume2 className="w-4 h-4 text-stone-700" />
          </button>

          {/* Cart Button (Always visible in Customer view) */}
          {currentRole === 'customer' && (
            <button
              onClick={onOpenCart}
              className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs sm:text-sm shadow-xs transition-colors"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-stone-900 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </div>
              <span>₹{cartTotal}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
