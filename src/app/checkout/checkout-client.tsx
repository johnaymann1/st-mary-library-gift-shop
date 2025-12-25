'use client'

import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
import { BackButton } from '@/components/ui/back-button'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import {
    DeliveryMethodSection,
    AddressSection,
    PickupInfo,
    PaymentMethodSection,
    OrderSummarySection,
    DeleteAddressDialog
} from '@/components/modules/checkout'
import { useCheckoutLogic } from '@/hooks/useCheckoutLogic'
import { SavedAddress } from '@/types'

interface CheckoutClientProps {
    userPhone: string
    savedAddresses: SavedAddress[]
    deliveryFee: number
    currencyCode: string
    instapayEnabled: boolean
    instapayPhone: string
    deliveryTimeDays: string
}

export default function CheckoutClient(props: CheckoutClientProps) {
    const { cart, isLoading: cartLoading } = useCart()
    const router = useRouter()
    
    const {
        submitting,
        deliveryType,
        setDeliveryType,
        paymentMethod,
        setPaymentMethod,
        addresses,
        selectedAddress,
        setSelectedAddress,
        customAddress,
        setCustomAddress,
        phone,
        setPhone,
        editingPhone,
        setEditingPhone,
        uploadedImage,
        uploadedFileName,
        deleteDialogOpen,
        setDeleteDialogOpen,
        subtotal,
        shippingCost,
        total,
        handleImageUpload,
        handleRemoveImage,
        handleSubmit,
        handleSavePhone,
        handleSaveAddress,
        handleDeleteAddress,
        openDeleteDialog
    } = useCheckoutLogic({
        userPhone: props.userPhone,
        savedAddresses: props.savedAddresses,
        deliveryFee: props.deliveryFee,
        cart
    })

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
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2 transition-colors">
                    Your cart is empty
                </h2>
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
                            deliveryFee={props.deliveryFee}
                            currencyCode={props.currencyCode}
                        />

                        {deliveryType === 'delivery' && (
                            <AddressSection
                                addresses={addresses}
                                selectedAddress={selectedAddress}
                                customAddress={customAddress}
                                phone={phone}
                                userPhone={props.userPhone}
                                editingPhone={editingPhone}
                                onAddressSelect={setSelectedAddress}
                                onCustomAddressChange={setCustomAddress}
                                onPhoneChange={setPhone}
                                onEditingPhoneChange={setEditingPhone}
                                onSaveAddress={handleSaveAddress}
                                onDeleteAddress={handleDeleteAddress}
                                onSavePhone={handleSavePhone}
                                onOpenDeleteDialog={openDeleteDialog}
                            />
                        )}

                        {deliveryType === 'pickup' && <PickupInfo />}
                    </div>

                    {/* Step 2: Payment Method */}
                    <PaymentMethodSection
                        paymentMethod={paymentMethod}
                        deliveryType={deliveryType}
                        instapayEnabled={props.instapayEnabled}
                        instapayPhone={props.instapayPhone}
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
                    deliveryTimeDays={props.deliveryTimeDays}
                    currencyCode={props.currencyCode}
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
