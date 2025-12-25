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
        <div className="bg-white dark:bg-neutral-900 p-4 sm:p-6 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 transition-colors">
            <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2 transition-colors">
                <CreditCard className="h-5 w-5 text-rose-600 dark:text-rose-400 transition-colors" />
                Payment Method
            </h2>
            <div className="space-y-3 sm:space-y-4" role="radiogroup" aria-label="Payment method">
                <label className={`relative flex items-center p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all focus-within:ring-4 focus-within:ring-rose-500 focus-within:ring-offset-2 ${paymentMethod === 'cash' ? 'border-rose-600 bg-rose-50 dark:bg-rose-900/20 dark:border-rose-500' : 'border-neutral-200 dark:border-neutral-700 hover:border-rose-200 dark:hover:border-rose-700'}`}>
                    <input
                        type="radio"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={() => onPaymentMethodChange('cash')}
                        className="sr-only"
                        aria-label={deliveryType === 'delivery' ? 'Cash on delivery' : 'Cash payment'}
                    />
                    <Banknote className="h-6 w-6 text-neutral-600 dark:text-neutral-400 mr-4 transition-colors" aria-hidden="true" />
                    <div>
                        <span className="block font-semibold text-neutral-900 dark:text-white transition-colors">
                            {deliveryType === 'delivery' ? 'Cash on Delivery' : 'Cash Payment'}
                        </span>
                        <span className="block text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 transition-colors">
                            {deliveryType === 'delivery'
                                ? 'Pay when you receive your order'
                                : 'Pay when you pick up your order'}
                        </span>
                    </div>
                </label>

                {instapayEnabled && (
                    <label className={`relative flex items-center p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all focus-within:ring-4 focus-within:ring-rose-500 focus-within:ring-offset-2 ${paymentMethod === 'instapay' ? 'border-rose-600 bg-rose-50 dark:bg-rose-900/20 dark:border-rose-500' : 'border-neutral-200 dark:border-neutral-700 hover:border-rose-200 dark:hover:border-rose-700'}`}>
                        <input
                            type="radio"
                            value="instapay"
                            checked={paymentMethod === 'instapay'}
                            onChange={() => onPaymentMethodChange('instapay')}
                            className="sr-only"
                            aria-label="InstaPay payment"
                        />
                        <div className="h-6 w-6 mr-4 flex items-center justify-center bg-purple-600 dark:bg-purple-500 rounded text-white text-[10px] font-bold transition-colors" aria-hidden="true">IP</div>
                        <div>
                            <span className="block font-semibold text-neutral-900 dark:text-white transition-colors">InstaPay</span>
                            <span className="block text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 transition-colors">Transfer to our wallet and upload screenshot</span>
                        </div>
                    </label>
                )}
            </div>

            {paymentMethod === 'instapay' && (
                <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800 transition-colors">
                    <h3 className="font-semibold text-purple-900 dark:text-purple-200 mb-2 transition-colors">InstaPay Instructions</h3>
                    <p className="text-sm text-purple-800 dark:text-purple-300 mb-4 transition-colors">
                        Please transfer <span className="font-bold">{total.toLocaleString()} {siteConfig.currency.code}</span> to:
                        <br />
                        <span className="text-lg font-mono bg-white dark:bg-neutral-800 px-2 py-1 rounded border border-purple-200 dark:border-purple-700 mt-1 inline-block transition-colors">{instapayPhone}</span>
                    </p>

                    <label htmlFor="proof-image-upload" className="block text-sm font-medium text-purple-900 dark:text-purple-200 mb-2 transition-colors">Upload Transfer Screenshot *</label>
                    <div className="relative" role="group" aria-label="Payment proof upload">
                        {!uploadedImage ? (
                            <label htmlFor="proof-image-upload" className="flex items-center justify-center gap-2 w-full h-32 px-4 py-6 border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-xl cursor-pointer hover:border-purple-500 dark:hover:border-purple-400 hover:bg-white/50 dark:hover:bg-neutral-800/50 transition-all group focus-within:ring-4 focus-within:ring-purple-500 focus-within:ring-offset-2">
                                <Upload className="h-5 w-5 text-purple-400 dark:text-purple-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" aria-hidden="true" />
                                <span className="text-sm text-purple-600 dark:text-purple-400 font-medium transition-colors">Click to upload screenshot</span>
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
                                <div className="relative rounded-xl overflow-hidden border-2 border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20 transition-colors" role="img" aria-label="Uploaded payment proof preview">
                                    <img
                                        src={uploadedImage}
                                        alt="Payment proof screenshot"
                                        className="w-full h-48 object-contain"
                                    />
                                    <div className="absolute top-2 right-2 bg-green-600 dark:bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg transition-colors">
                                        <Check className="h-3 w-3" />
                                        Uploaded
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 transition-colors">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <div className="h-8 w-8 rounded bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 transition-colors">
                                            <Upload className="h-4 w-4 text-purple-600 dark:text-purple-400 transition-colors" />
                                        </div>
                                        <span className="text-sm text-neutral-900 dark:text-white font-medium truncate transition-colors">{uploadedFileName}</span>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={onRemoveImage}
                                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0 transition-colors"
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
