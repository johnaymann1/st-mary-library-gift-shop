'use client'

import { Button } from '@/components/ui/button'
import { CreditCard, Banknote, Upload, Trash2, Check } from 'lucide-react'
import { siteConfig } from '@/config/site'

interface PaymentMethodSectionProps {
    paymentMethod: 'cash' | 'instapay'
    deliveryType: 'delivery' | 'pickup'
    instapayEnabled: boolean
    instapayPhone: string
    total: number
    uploadedImage: string | null
    uploadedFileName: string
    onPaymentMethodChange: (method: 'cash' | 'instapay') => void
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
    onRemoveImage: () => void
}

export function PaymentMethodSection({
    paymentMethod,
    deliveryType,
    instapayEnabled,
    instapayPhone,
    total,
    uploadedImage,
    uploadedFileName,
    onPaymentMethodChange,
    onImageUpload,
    onRemoveImage
}: PaymentMethodSectionProps) {
    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-neutral-200">
            <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-rose-600" />
                Payment Method
            </h2>
            <div className="space-y-3 sm:space-y-4" role="radiogroup" aria-label="Payment method">
                <label className={`relative flex items-center p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all focus-within:ring-4 focus-within:ring-rose-500 focus-within:ring-offset-2 ${paymentMethod === 'cash' ? 'border-rose-600 bg-rose-50' : 'border-neutral-200 hover:border-rose-200'}`}>
                    <input
                        type="radio"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={() => onPaymentMethodChange('cash')}
                        className="sr-only"
                        aria-label={deliveryType === 'delivery' ? 'Cash on delivery' : 'Cash payment'}
                    />
                    <Banknote className="h-6 w-6 text-neutral-600 mr-4" aria-hidden="true" />
                    <div>
                        <span className="block font-semibold text-neutral-900">
                            {deliveryType === 'delivery' ? 'Cash on Delivery' : 'Cash Payment'}
                        </span>
                        <span className="block text-xs sm:text-sm text-neutral-500">
                            {deliveryType === 'delivery'
                                ? 'Pay when you receive your order'
                                : 'Pay when you pick up your order'}
                        </span>
                    </div>
                </label>

                {instapayEnabled && (
                    <label className={`relative flex items-center p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all focus-within:ring-4 focus-within:ring-rose-500 focus-within:ring-offset-2 ${paymentMethod === 'instapay' ? 'border-rose-600 bg-rose-50' : 'border-neutral-200 hover:border-rose-200'}`}>
                        <input
                            type="radio"
                            value="instapay"
                            checked={paymentMethod === 'instapay'}
                            onChange={() => onPaymentMethodChange('instapay')}
                            className="sr-only"
                            aria-label="InstaPay payment"
                        />
                        <div className="h-6 w-6 mr-4 flex items-center justify-center bg-purple-600 rounded text-white text-[10px] font-bold" aria-hidden="true">IP</div>
                        <div>
                            <span className="block font-semibold text-neutral-900">InstaPay</span>
                            <span className="block text-xs sm:text-sm text-neutral-500">Transfer to our wallet and upload screenshot</span>
                        </div>
                    </label>
                )}
            </div>

            {paymentMethod === 'instapay' && (
                <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <h3 className="font-semibold text-purple-900 mb-2">InstaPay Instructions</h3>
                    <p className="text-sm text-purple-800 mb-4">
                        Please transfer <span className="font-bold">{total.toLocaleString()} {siteConfig.currency.code}</span> to:
                        <br />
                        <span className="text-lg font-mono bg-white px-2 py-1 rounded border border-purple-200 mt-1 inline-block">{instapayPhone}</span>
                    </p>

                    <label htmlFor="proof-image-upload" className="block text-sm font-medium text-purple-900 mb-2">Upload Transfer Screenshot *</label>
                    <div className="relative" role="group" aria-label="Payment proof upload">
                        {!uploadedImage ? (
                            <label htmlFor="proof-image-upload" className="flex items-center justify-center gap-2 w-full h-32 px-4 py-6 border-2 border-dashed border-purple-300 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-white/50 transition-all group focus-within:ring-4 focus-within:ring-purple-500 focus-within:ring-offset-2">
                                <Upload className="h-5 w-5 text-purple-400 group-hover:text-purple-600 transition-colors" aria-hidden="true" />
                                <span className="text-sm text-purple-600 font-medium">Click to upload screenshot</span>
                                <input
                                    id="proof-image-upload"
                                    type="file"
                                    accept="image/*"
                                    required={paymentMethod === 'instapay'}
                                    className="sr-only"
                                    onChange={onImageUpload}
                                    aria-required={paymentMethod === 'instapay' ? 'true' : 'false'}
                                    aria-label="Upload payment proof screenshot"
                                />
                            </label>
                        ) : (
                            <div className="space-y-3">
                                <div className="relative rounded-xl overflow-hidden border-2 border-green-300 bg-green-50" role="img" aria-label="Uploaded payment proof preview">
                                    <img
                                        src={uploadedImage}
                                        alt="Payment proof screenshot"
                                        className="w-full h-48 object-contain"
                                    />
                                    <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                        <Check className="h-3 w-3" />
                                        Uploaded
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-neutral-200">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <div className="h-8 w-8 rounded bg-purple-100 flex items-center justify-center flex-shrink-0">
                                            <Upload className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <span className="text-sm text-neutral-900 font-medium truncate">{uploadedFileName}</span>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={onRemoveImage}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
