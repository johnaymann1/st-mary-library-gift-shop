'use client'

import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { placeOrder } from '@/app/actions/checkout'
import { saveAddress, updateAddress, deleteAddress, updateUserPhone } from '@/app/actions/address'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Upload, CreditCard, Banknote, Truck, MapPin, ArrowLeft, Trash2, Plus, Edit2, Check } from 'lucide-react'
import { SavedAddress } from '@/types'
import { siteConfig } from '@/config/site'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

export default function CheckoutClient({
    userPhone,
    savedAddresses
}: {
    userPhone: string
    savedAddresses: SavedAddress[]
}) {
    const { cart, isLoading: cartLoading } = useCart()
    const [submitting, setSubmitting] = useState(false)
    const router = useRouter()

    // Form State
    const [deliveryType, setDeliveryType] = useState('delivery') // 'delivery' or 'pickup'
    const [paymentMethod, setPaymentMethod] = useState('cash') // 'cash' or 'instapay'

    // Address Management
    const [addresses, setAddresses] = useState<SavedAddress[]>(savedAddresses)
    const [selectedAddress, setSelectedAddress] = useState<SavedAddress | null>(
        savedAddresses.find(a => a.is_default) || savedAddresses[0] || null
    )
    const [showAddressForm, setShowAddressForm] = useState(false)
    const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null)
    const [customAddress, setCustomAddress] = useState('')

    // Phone Management
    const [phone, setPhone] = useState(userPhone)
    const [editingPhone, setEditingPhone] = useState(false)

    // Image Upload Preview
    const [uploadedImage, setUploadedImage] = useState<string | null>(null)
    const [uploadedFileName, setUploadedFileName] = useState<string>('')
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)

    // Delete Address Dialog State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [addressToDelete, setAddressToDelete] = useState<number | null>(null)

    useEffect(() => {
        if (selectedAddress) {
            setCustomAddress(selectedAddress.address)
        }
    }, [selectedAddress])

    function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) {
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

    const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
    const shippingCost = deliveryType === 'delivery' ? siteConfig.delivery.fee : 0
    const total = subtotal + shippingCost

    async function handleSubmit(formData: FormData) {
        // Prevent double submission
        if (submitting) return

        setSubmitting(true)

        // Explicitly set both values from state
        formData.set('delivery_type', deliveryType)
        formData.set('payment_method', paymentMethod)

        // Set address and phone from state
        if (deliveryType === 'delivery') {
            formData.set('address', customAddress)
            formData.set('phone', phone)
        }

        // Add the uploaded file if InstaPay is selected
        if (paymentMethod === 'instapay' && uploadedFile) {
            formData.set('proof_image', uploadedFile)
        }

        const result = await placeOrder(formData)

        if (result?.error) {
            console.error('Order error:', result.error)
            toast.error(result.error)
            setSubmitting(false)
        } else {
            // Show success message with order details
            const deliveryMethod = deliveryType === 'delivery' ? 'Home Delivery' : 'Store Pickup'
            const paymentMethodText = paymentMethod === 'cash' ? 'Cash on Delivery' : 'InstaPay'

            toast.success(
                <div className="space-y-2">
                    <p className="font-bold text-green-800">🎉 Order Placed Successfully!</p>
                    <p className="text-sm text-neutral-700">
                        Your order has been confirmed. We'll process it shortly.
                    </p>
                    <div className="text-xs text-neutral-600 space-y-1 mt-2">
                        <p>• {deliveryMethod}</p>
                        <p>• {paymentMethodText}</p>
                        <p>• Total: {total.toLocaleString()} {siteConfig.currency.code}</p>
                    </div>
                </div>,
                {
                    duration: 6000,
                }
            )

            // Redirect after showing message
            setTimeout(() => {
                window.location.href = '/'
            }, 2000)
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
                // Update existing address in local state
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
                // Add new address to local state with temporary ID
                const newAddress: SavedAddress = {
                    id: Date.now(), // Temporary ID until page refresh
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

            setShowAddressForm(false)
            setEditingAddress(null)
        }
    }

    async function handleDeleteAddress(addressId: number) {
        const result = await deleteAddress(addressId)
        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success('Address deleted!')
            // Remove from local state
            setAddresses(prev => prev.filter(addr => addr.id !== addressId))
            // Clear selection if deleted address was selected
            if (selectedAddress?.id === addressId) {
                const remainingAddresses = addresses.filter(addr => addr.id !== addressId)
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
                <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
            </div>
        )
    }

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <h2 className="text-xl font-semibold text-neutral-900 mb-2">Your cart is empty</h2>
                <Button onClick={() => router.push('/')}>Start Shopping</Button>
            </div>
        )
    }

    return (
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-8">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-6 text-neutral-600 hover:text-rose-600 hover:bg-rose-50"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Cart
                </Button>

                <form action={handleSubmit} className="space-y-6 sm:space-y-8">

                    {/* Step 1: Delivery Method */}
                    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-neutral-200">
                        <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                            <Truck className="h-5 w-5 text-rose-600" />
                            Delivery Method
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <label className={`relative flex flex-col p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${deliveryType === 'delivery' ? 'border-rose-600 bg-rose-50' : 'border-neutral-200 hover:border-rose-200'}`}>
                                <input
                                    type="radio"
                                    name="delivery_type"
                                    value="delivery"
                                    checked={deliveryType === 'delivery'}
                                    onChange={() => setDeliveryType('delivery')}
                                    className="sr-only"
                                />
                                <span className="font-semibold text-neutral-900">Home Delivery</span>
                                <span className="text-xs sm:text-sm text-neutral-500">Delivery to your doorstep</span>
                                <span className="mt-2 font-bold text-rose-600">{siteConfig.delivery.fee.toFixed(2)} {siteConfig.currency.code}</span>
                            </label>
                            <label className={`relative flex flex-col p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${deliveryType === 'pickup' ? 'border-rose-600 bg-rose-50' : 'border-neutral-200 hover:border-rose-200'}`}>
                                <input
                                    type="radio"
                                    name="delivery_type"
                                    value="pickup"
                                    checked={deliveryType === 'pickup'}
                                    onChange={() => setDeliveryType('pickup')}
                                    className="sr-only"
                                />
                                <span className="font-semibold text-neutral-900">Store Pickup</span>
                                <span className="text-xs sm:text-sm text-neutral-500">Pick up from {siteConfig.name}</span>
                                <span className="mt-2 font-bold text-green-600">Free</span>
                            </label>
                        </div>

                        {deliveryType === 'delivery' && (
                            <div className="mt-6 space-y-4">
                                {/* Saved Addresses */}
                                {addresses.length > 0 && !showAddressForm && (
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="block text-sm font-semibold text-neutral-700">Saved Addresses</label>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setShowAddressForm(true)
                                                    setEditingAddress(null)
                                                }}
                                                className="text-rose-600 hover:text-rose-700"
                                            >
                                                <Plus className="h-4 w-4 mr-1" />
                                                Add New
                                            </Button>
                                        </div>
                                        <div className="space-y-2">
                                            {addresses.map((addr) => (
                                                <div
                                                    key={addr.id}
                                                    className={`p-3 border-2 rounded-xl cursor-pointer transition-all ${selectedAddress?.id === addr.id
                                                        ? 'border-rose-600 bg-rose-50'
                                                        : 'border-neutral-200 hover:border-rose-300'
                                                        }`}
                                                    onClick={() => setSelectedAddress(addr)}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="h-4 w-4 text-rose-600" />
                                                                <span className="font-semibold text-neutral-900">{addr.label}</span>
                                                                {addr.is_default && (
                                                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Default</span>
                                                                )}
                                                                {selectedAddress?.id === addr.id && (
                                                                    <Check className="h-4 w-4 text-rose-600" />
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-neutral-600 mt-1">{addr.address}</p>
                                                        </div>
                                                        <div className="flex gap-1 ml-2">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    setEditingAddress(addr)
                                                                    setShowAddressForm(true)
                                                                }}
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <Edit2 className="h-3.5 w-3.5" />
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    setAddressToDelete(addr.id)
                                                                    setDeleteDialogOpen(true)
                                                                }}
                                                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Address Form */}
                                {(showAddressForm || addresses.length === 0) && (
                                    <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-semibold text-neutral-900">
                                                {editingAddress ? 'Edit Address' : 'Add New Address'}
                                            </h3>
                                            {addresses.length > 0 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setShowAddressForm(false)
                                                        setEditingAddress(null)
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                        </div>
                                        <div className="space-y-3" key={editingAddress?.id || 'new'} onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                // Optional: Trigger save on Enter if desired, but safer to just prevent default
                                            }
                                        }}>
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-700 mb-1">Label *</label>
                                                <Input
                                                    name="label"
                                                    defaultValue={editingAddress?.label || ''}
                                                    placeholder="e.g., Home, Work"
                                                    required
                                                    className="h-11"
                                                    id="address-label-input"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-700 mb-1">Full Address *</label>
                                                <textarea
                                                    name="address"
                                                    defaultValue={editingAddress?.address || ''}
                                                    placeholder="Street, Building, Apartment..."
                                                    required
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-neutral-900"
                                                    id="address-text-input"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    name="is_default"
                                                    value="true"
                                                    defaultChecked={editingAddress?.is_default || false}
                                                    className="h-4 w-4 text-rose-600 rounded"
                                                    id="address-default-input"
                                                />
                                                <label htmlFor="address-default-input" className="text-sm text-neutral-700">Set as default address</label>
                                            </div>
                                            <Button
                                                type="button"
                                                className="w-full"
                                                onClick={async () => {
                                                    const labelInput = document.getElementById('address-label-input') as HTMLInputElement
                                                    const addressInput = document.getElementById('address-text-input') as HTMLTextAreaElement
                                                    const defaultInput = document.getElementById('address-default-input') as HTMLInputElement

                                                    if (!labelInput.value || !addressInput.value) {
                                                        toast.error('Please fill in all required fields')
                                                        return
                                                    }

                                                    const formData = new FormData()
                                                    formData.append('label', labelInput.value)
                                                    formData.append('address', addressInput.value)
                                                    if (defaultInput.checked) {
                                                        formData.append('is_default', 'on')
                                                    }

                                                    await handleSaveAddress(formData)
                                                }}
                                            >
                                                {editingAddress ? 'Update Address' : 'Save Address'}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Custom Address Input */}
                                {selectedAddress && !showAddressForm && (
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">Delivery Address *</label>
                                        <textarea
                                            value={customAddress}
                                            onChange={(e) => setCustomAddress(e.target.value)}
                                            placeholder="Street, Building, Apartment..."
                                            required
                                            rows={3}
                                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-neutral-900"
                                        />
                                    </div>
                                )}

                                {/* Phone Number */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Phone Number *</label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            type="tel"
                                            required
                                            placeholder="01xxxxxxxxx"
                                            className="h-11"
                                            disabled={!editingPhone && !!userPhone}
                                        />
                                        {userPhone && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    if (editingPhone) {
                                                        handleSavePhone()
                                                    } else {
                                                        setEditingPhone(true)
                                                    }
                                                }}
                                                className="border-2 border-neutral-400 text-neutral-800 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-400 font-semibold"
                                            >
                                                {editingPhone ? 'Save' : 'Edit'}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {deliveryType === 'pickup' && (
                            <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                                <p className="text-sm text-green-800">
                                    <strong>Pickup Location:</strong> St Mary Library, Main Street
                                    <br />
                                    <strong>Hours:</strong> 9 AM - 8 PM, Daily
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Step 2: Payment Method */}
                    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-neutral-200">
                        <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-rose-600" />
                            Payment Method
                        </h2>
                        <div className="space-y-3 sm:space-y-4">
                            <label className={`relative flex items-center p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-rose-600 bg-rose-50' : 'border-neutral-200 hover:border-rose-200'}`}>
                                <input
                                    type="radio"
                                    value="cash"
                                    checked={paymentMethod === 'cash'}
                                    onChange={() => setPaymentMethod('cash')}
                                    className="sr-only"
                                />
                                <Banknote className="h-6 w-6 text-neutral-600 mr-4" />
                                <div>
                                    <span className="block font-semibold text-neutral-900">Cash on Delivery</span>
                                    <span className="block text-xs sm:text-sm text-neutral-500">Pay when you receive your order</span>
                                </div>
                            </label>

                            <label className={`relative flex items-center p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'instapay' ? 'border-rose-600 bg-rose-50' : 'border-neutral-200 hover:border-rose-200'}`}>
                                <input
                                    type="radio"
                                    value="instapay"
                                    checked={paymentMethod === 'instapay'}
                                    onChange={() => setPaymentMethod('instapay')}
                                    className="sr-only"
                                />
                                <div className="h-6 w-6 mr-4 flex items-center justify-center bg-purple-600 rounded text-white text-[10px] font-bold">IP</div>
                                <div>
                                    <span className="block font-semibold text-neutral-900">InstaPay</span>
                                    <span className="block text-xs sm:text-sm text-neutral-500">Transfer to our wallet and upload screenshot</span>
                                </div>
                            </label>
                        </div>

                        {paymentMethod === 'instapay' && (
                            <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-100">
                                <h3 className="font-semibold text-purple-900 mb-2">InstaPay Instructions</h3>
                                <p className="text-sm text-purple-800 mb-4">
                                    Please transfer <span className="font-bold">{total.toLocaleString()} {siteConfig.currency.code}</span> to:
                                    <br />
                                    <span className="text-lg font-mono bg-white px-2 py-1 rounded border border-purple-200 mt-1 inline-block">01234567890</span>
                                </p>

                                <label className="block text-sm font-medium text-purple-900 mb-2">Upload Transfer Screenshot</label>
                                <div className="relative">
                                    {!uploadedImage ? (
                                        <label className="flex items-center justify-center gap-2 w-full h-32 px-4 py-6 border-2 border-dashed border-purple-300 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-white/50 transition-all group">
                                            <Upload className="h-5 w-5 text-purple-400 group-hover:text-purple-600 transition-colors" />
                                            <span className="text-sm text-purple-600 font-medium">Click to upload screenshot</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                required={paymentMethod === 'instapay'}
                                                className="sr-only"
                                                onChange={handleImageUpload}
                                            />
                                        </label>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="relative rounded-xl overflow-hidden border-2 border-green-300 bg-green-50">
                                                <img
                                                    src={uploadedImage}
                                                    alt="Payment proof preview"
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
                                                    onClick={handleRemoveImage}
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

                    <Button
                        type="submit"
                        disabled={submitting || cart.length === 0}
                        className="w-full h-12 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        size="lg"
                    >
                        {submitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        {submitting ? 'Processing Order...' : `Place Order • ${total.toLocaleString()} EGP`}
                    </Button>                </form>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4 mt-6 lg:mt-0">
                <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-5 sm:p-6 sticky top-24">
                    <h2 className="text-lg font-bold text-neutral-900 mb-6">Order Summary</h2>

                    <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                        {cart.map((item) => (
                            <div key={item.product_id} className="flex gap-3">
                                <div className="h-12 w-12 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0">
                                    {item.product.image_url && (
                                        <img src={item.product.image_url} alt={item.product.name_en} className="h-full w-full object-cover" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-neutral-900 truncate">{item.product.name_en}</p>
                                    <p className="text-xs text-neutral-500">{item.quantity} x {item.product.price.toLocaleString()}</p>
                                </div>
                                <div className="text-sm font-semibold text-neutral-900">
                                    {(item.product.price * item.quantity).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-neutral-200 pt-4 space-y-2">
                        <div className="flex justify-between text-neutral-600">
                            <span>Subtotal</span>
                            <span>{subtotal.toLocaleString()} EGP</span>
                        </div>
                        <div className="flex justify-between text-neutral-600">
                            <span>Shipping</span>
                            <span>{shippingCost === 0 ? 'Free' : `${shippingCost.toLocaleString()} EGP`}</span>
                        </div>
                        <div className="border-t border-neutral-200 pt-4 flex justify-between font-bold text-lg text-neutral-900">
                            <span>Total</span>
                            <span>{total.toLocaleString()} EGP</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Address Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md bg-gradient-to-br from-white to-rose-50 border-2 border-rose-200">
                    <DialogHeader>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                            <Trash2 className="h-6 w-6 text-red-600" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-neutral-900 text-center">Delete Address</DialogTitle>
                        <DialogDescription className="text-neutral-600 text-center pt-2">
                            Are you sure you want to delete this address? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-2 flex-col sm:flex-row">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setDeleteDialogOpen(false)
                                setAddressToDelete(null)
                            }}
                            className="w-full sm:w-auto border-2 border-neutral-400 text-neutral-800 hover:bg-neutral-100 hover:border-neutral-500 font-semibold"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={() => addressToDelete && handleDeleteAddress(addressToDelete)}
                            className="w-full sm:w-auto gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold shadow-lg"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete Address
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
