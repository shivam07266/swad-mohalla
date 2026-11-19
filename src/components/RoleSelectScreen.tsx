import React from 'react'
import type { UserRole } from '../types'
import { ArrowRight, Sparkles } from 'lucide-react'
import { speakHindi } from '../utils/audio'

interface RoleSelectScreenProps {
  onSelectRole: (role: UserRole) => void
}

export const RoleSelectScreen: React.FC<RoleSelectScreenProps> = ({ onSelectRole }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold mb-3 border border-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>रसोई से रोज़गार तक • स्वावलंबन</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 mb-2 tracking-tight">
          स्वाद मोहल्ला में आपका स्वागत है
        </h1>
        <p className="text-sm sm:text-base text-stone-600 font-medium">
          Choose your role to get started (अपनी भूमिका चुनें)
        </p>
      </div>

      {/* 3 High-Energy Colorful Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Customer Card */}
        <div
          onClick={() => {
            speakHindi('ग्राहक स्क्रीन')
            onSelectRole('customer')
          }}
          className="group relative bg-white rounded-3xl p-6 border-2 border-orange-200 hover:border-orange-500 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-orange-400/20 to-transparent rounded-bl-full pointer-events-none" />

          <div>
            <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center text-3xl shadow-lg shadow-orange-500/25 mb-4 group-hover:scale-105 transition-transform">
              🛒
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md">
              Option 1
            </span>
            <h2 className="text-2xl font-black text-stone-900 mt-2 mb-1">
              ग्राहक (Customer)
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed mb-4">
              मोहल्ले की गृहणियों के हाथ का बना शुद्ध, गरमा-गरम खाना, अचार और पापड़ ऑर्डर करें।
            </p>
          </div>

          <div className="pt-3 border-t border-orange-100 flex items-center justify-between font-black text-xs text-orange-600 group-hover:text-orange-700">
            <span>खाना ऑर्डर करें</span>
            <div className="w-7 h-7 rounded-full bg-orange-100 group-hover:bg-orange-600 group-hover:text-white flex items-center justify-center transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Merchant Card */}
        <div
          onClick={() => {
            speakHindi('रसोई मर्चेंट')
            onSelectRole('merchant')
          }}
          className="group relative bg-white rounded-3xl p-6 border-2 border-emerald-200 hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-emerald-400/20 to-transparent rounded-bl-full pointer-events-none" />

          <div>
            <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/25 mb-4 group-hover:scale-105 transition-transform">
              👩‍🍳
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
              Option 2
            </span>
            <h2 className="text-2xl font-black text-stone-900 mt-2 mb-1">
              रसोई (Merchant)
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed mb-4">
              अपनी रसोई का चयन करें, नए ऑर्डर देखें, डब्बा पैक करें और दैनिक कमाई का हिसाब रखें।
            </p>
          </div>

          <div className="pt-3 border-t border-emerald-100 flex items-center justify-between font-black text-xs text-emerald-700 group-hover:text-emerald-800">
            <span>रसोई में प्रवेश करें</span>
            <div className="w-7 h-7 rounded-full bg-emerald-100 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Delivery Partner Card */}
        <div
          onClick={() => {
            speakHindi('डिलीवरी साथी')
            onSelectRole('delivery')
          }}
          className="group relative bg-white rounded-3xl p-6 border-2 border-blue-200 hover:border-blue-500 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-blue-400/20 to-transparent rounded-bl-full pointer-events-none" />

          <div>
            <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center text-3xl shadow-lg shadow-blue-500/25 mb-4 group-hover:scale-105 transition-transform">
              🛵
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md">
              Option 3
            </span>
            <h2 className="text-2xl font-black text-stone-900 mt-2 mb-1">
              डिलीवरी (Partner)
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed mb-4">
              डब्बावाला प्रणाली से अपना मोहल्ला इलाका (Zone) चुनें और प्रति डब्बा ₹35 पक्की कमाई करें।
            </p>
          </div>

          <div className="pt-3 border-t border-blue-100 flex items-center justify-between font-black text-xs text-blue-700 group-hover:text-blue-800">
            <span>डिलीवरी शुरू करें</span>
            <div className="w-7 h-7 rounded-full bg-blue-100 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
