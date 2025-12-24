'use client'

import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
import { BackButton } from '@/components/ui/back-button'
import { placeOrder } from '@/app/actions/checkout'
import { saveAddress, updateAddress, deleteAddress, updateUserPhone } from '@/app/actions/address'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, ArrowLeft, Truck, CreditCard, Banknote, Check } from 'lucide-react'
import { SavedAddress } from '@/types'
import { siteConfig } from '@/config/site'
import {
    DeliveryMethodSection,
    AddressSection,
    PickupInfo,
    PaymentMethodSection,
    OrderSummarySection,
    DeleteAddressDialog
} from '@/components/modules/checkout'

interface CheckoutClientProps {
    userPhone: string
    savedAddresses: SavedAddress[]
    deliveryFee: number
    currencyCode: string
    instapayEnabled: boolean
    instapayPhone: string
    deliveryTimeDays: string
}

export default function CheckoutClient({
    userPhone,
    savedAddresses,
    deliveryFee,
    currencyCode,
    instapayEnabled,
    instapayPhone,
    deliveryTimeDays
}: CheckoutClientProps) {
    const { cart, isLoading: cartLoading } = useCart()
    const [submitting, setSubmitting] = useState(false)
    const router = useRouter()

    // Form State
    const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery')
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'instapay'>('cash')

    // Address Management
    const [addresses, setAddresses] = useState<SavedAddress[]>(savedAddresses)
    const [selectedAddress, setSelectedAddress] = useState<SavedAddress | null>(
        savedAddresses.find(a => a.is_default) || savedAddresses[0] || null
    )
    const [customAddress, setCustomAddress] = useState('')

    // Phone Management
    const [phone, setPhone] = useState(userPhone)
    const [editingPhone, setEditingPhone] = useState(false)

    // Image Upload
    const [uploadedImage, setUploadedImage] = useState<string | null>(null)
    const [uploadedFileName, setUploadedFileName] = useState<string>('')
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)

    // Delete Address Dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [addressToDelete, setAddressToDelete] = useState<number | null>(null)

    // Calculate totals
    const subtotal = cart.reduce((acc, item) => {
        if (!item.product || item.product.price == null) return acc
        return acc + (item.product.price * item.quantity)
    }, 0)
    const shippingCost = deliveryType === 'delivery' ? deliveryFee : 0
    const total = subtotal + shippingCost

    useEffect(() => {
        if (selectedAddress) {
            setCustomAddress(selectedAddress.address)
        }
    }, [selectedAddress])

    function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) {
            // Validate image size (10MB limit)
            const maxSize = 10 * 1024 * 1024 // 10MB
            if (file.size > maxSize) {
                toast.error('Image size must be less than 10MB. Please upload a smaller image.')
                e.target.value = '' // Clear input
                return
            }

            // Validate image type
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload a valid image file (JPG, PNG, etc.)')
                e.target.value = '' // Clear input
                return
            }

            setUploadedFile(file)
            setUploadedFileName(file.name)
            const reader = new FileReader()
            reader.onloadend = () => {
                setUploadedImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    function handleRemoveImage() {
        setUploadedImage(null)
        setUploadedFileName('')
        setUploadedFile(null)
    }

    async function handleSubmit(formData: FormData) {
        if (submitting) return
        
        // Show immediate feedback
        setSubmitting(true)
        toast.loading('Processing your order...', { id: 'place-order' })

        formData.set('delivery_type', deliveryType)
        formData.set('payment_method', paymentMethod)

        if (deliveryType === 'delivery') {
            formData.set('address', customAddress)
            formData.set('phone', phone)
        }

        if (paymentMethod === 'instapay' && uploadedFile) {
            formData.set('proof_image', uploadedFile)
        }

        try {
            const result = await placeOrder(formData)

            // Dismiss loading toast
            toast.dismiss('place-order')

            if (result?.error) {
                // Show specific error message
                if (result.error.includes('image') || result.error.includes('proof')) {
                    toast.error('Image upload failed. Please try uploading a smaller image (max 10MB).', {
                        duration: 5000
                    })
                    setSubmitting(false)
                    return
                }
                toast.error(result.error)
                setSubmitting(false)
                return
            }

            if (!result?.success) {
                toast.error('Failed to place order. Please try again.')
                setSubmitting(false)
                return
            }
            const deliveryMethodText = deliveryType === 'delivery' ? 'Home Delivery' : 'Store Pickup'
            const paymentMethodText = paymentMethod === 'cash'
                ? (deliveryType === 'delivery' ? 'Cash on Delivery' : 'Cash Payment')
                : 'InstaPay'

            toast.success(
                <div className="flex flex-col gap-3 py-2">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                            <Check className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="text-base font-bold text-neutral-900 leading-tight">
                                Order Placed Successfully!
                            </p>
                            <p className="text-sm text-neutral-600 mt-1">
                                Your order has been confirmed.
                            </p>
                        </div>
                    </div>
                    <div className="pl-13 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <Truck className="h-4 w-4 text-rose-500" />
                            <span className="font-medium text-neutral-700">{deliveryMethodText}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            {paymentMethod === 'cash' ? (
                                <Banknote className="h-4 w-4 text-green-500" />
                            ) : (
                                <CreditCard className="h-4 w-4 text-blue-500" />
                            )}
                            <span className="font-medium text-neutral-700">{paymentMethodText}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm pt-2 border-t border-neutral-200">
                            <span className="text-neutral-600">Total:</span>
                            <span className="font-bold text-neutral-900">
                                {total.toLocaleString()} {siteConfig.currency.code}
                            </span>
                        </div>
                    </div>
                </div>,
                { duration: 6000, className: 'max-w-md' }
            )

            setTimeout(() => {
                window.location.href = '/orders'
            }, 2000)
        } catch (error) {
            toast.dismiss('place-order')
            toast.error('An unexpected error occurred. Please try again.')
            setSubmitting(false)
        }
    }

    async function handleSavePhone() {
        const result = await updateUserPhone(phone)
        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success('Phone number updated!')
            setEditingPhone(false)
        }
    }

    async function handleSaveAddress(formData: FormData) {
        const editingAddress = addresses.find(a =>
            document.getElementById('address-label-input') &&
            (document.getElementById('address-label-input') as HTMLInputElement).defaultValue === a.label
        ) || null

        const result = editingAddress
            ? await updateAddress(editingAddress.id, formData)
            : await saveAddress(formData)

        if (result?.error) {
            toast.error(result.error)
        } else {
            const label = formData.get('label') as string
            const address = formData.get('address') as string
            const isDefault = formData.get('is_default') === 'on'

            toast.success(editingAddress ? 'Address updated!' : 'Address saved!')

            if (editingAddress) {
                setAddresses(prev => prev.map(addr =>
                    addr.id === editingAddress.id
                        ? { ...addr, label, address, is_default: isDefault }
                        : isDefault ? { ...addr, is_default: false } : addr
                ))
                if (selectedAddress?.id === editingAddress.id) {
                    setSelectedAddress({ ...editingAddress, label, address, is_default: isDefault })
                    setCustomAddress(address)
                }
            } else {
                const newAddress: SavedAddress = {
                    id: Date.now(),
                    label,
                    address,
                    is_default: isDefault
                }
                setAddresses(prev => isDefault
                    ? [...prev.map(a => ({ ...a, is_default: false })), newAddress]
                    : [...prev, newAddress]
                )
                setSelectedAddress(newAddress)
                setCustomAddress(address)
            }
        }
    }

    async function handleDeleteAddress() {
        if (!addressToDelete) return

        const result = await deleteAddress(addressToDelete)
        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success('Address deleted!')
            setAddresses(prev => prev.filter(addr => addr.id !== addressToDelete))
            if (selectedAddress?.id === addressToDelete) {
                const remainingAddresses = addresses.filter(addr => addr.id !== addressToDelete)
                const newSelected = remainingAddresses[0] || null
                setSelectedAddress(newSelected)
                setCustomAddress(newSelected?.address || '')
            }
        }
        setDeleteDialogOpen(false)
        setAddressToDelete(null)
    }

    if (cartLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-rose-600 dark:text-rose-400 transition-colors" />
            </div>
        )
    }

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2 transition-colors">Your cart is empty</h2>
                <Button onClick={() => router.push('/')}>Start Shopping</Button>
            </div>
        )
    }

    return (
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-8">
                <BackButton href="/cart" label="Back to Cart" className="mb-6" />

                <form action={handleSubmit} className="space-y-6 sm:space-y-8">
                    {/* Step 1: Delivery Method */}
                    <div>
                        <DeliveryMethodSection
                            deliveryType={deliveryType}
                            onDeliveryTypeChange={setDeliveryType}
                            deliveryFee={deliveryFee}
                            currencyCode={currencyCode}
                        />

                        {deliveryType === 'delivery' && (
                            <AddressSection
                                addresses={addresses}
                                selectedAddress={selectedAddress}
                                customAddress={customAddress}
                                phone={phone}
                                userPhone={userPhone}
                                editingPhone={editingPhone}
                                onAddressSelect={setSelectedAddress}
                                onCustomAddressChange={setCustomAddress}
                                onPhoneChange={setPhone}
                                onEditingPhoneChange={setEditingPhone}
                                onSaveAddress={handleSaveAddress}
                                onDeleteAddress={handleDeleteAddress}
                                onSavePhone={handleSavePhone}
                                onOpenDeleteDialog={(id) => {
                                    setAddressToDelete(id)
                                    setDeleteDialogOpen(true)
                                }}
                            />
                        )}

                        {deliveryType === 'pickup' && <PickupInfo />}
                    </div>

                    {/* Step 2: Payment Method */}
                    <PaymentMethodSection
                        paymentMethod={paymentMethod}
                        deliveryType={deliveryType}
                        instapayEnabled={instapayEnabled}
                        instapayPhone={instapayPhone}
                        total={total}
                        uploadedImage={uploadedImage}
                        uploadedFileName={uploadedFileName}
                        onPaymentMethodChange={setPaymentMethod}
                        onImageUpload={handleImageUpload}
                        onRemoveImage={handleRemoveImage}
                    />

                    <Button
                        type="submit"
                        disabled={submitting || cart.length === 0}
                        className="w-full h-12 text-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed focus:ring-4 focus:ring-rose-500 focus:ring-offset-2"
                        size="lg"
                        aria-label="Place order"
                        aria-busy={submitting}
                    >
                        {submitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />}
                        {submitting ? 'Processing Order...' : `Place Order • ${total.toLocaleString()} EGP`}
                    </Button>
                </form>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4 mt-6 lg:mt-0">
                <OrderSummarySection
                    cart={cart}
                    subtotal={subtotal}
                    shippingCost={shippingCost}
                    total={total}
                    deliveryType={deliveryType}
                    deliveryTimeDays={deliveryTimeDays}
                    currencyCode={currencyCode}
                />
            </div>

            {/* Delete Address Dialog */}
            <DeleteAddressDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteAddress}
            />
        </div>
    )
}
