'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { placeOrder } from '@/app/actions/checkout'
import { saveAddress, updateAddress, deleteAddress, updateUserPhone } from '@/app/actions/address'
import { SavedAddress } from '@/types'


interface UseCheckoutLogicProps {
    userPhone: string
    savedAddresses: SavedAddress[]
    deliveryFee: number
    cart: any[]
}

export function useCheckoutLogic({
    userPhone,
    savedAddresses,
    deliveryFee,
    cart
}: UseCheckoutLogicProps) {
    const router = useRouter()
    const [submitting, setSubmitting] = useState(false)

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
                e.target.value = ''
                return
            }

            // Validate image type
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload a valid image file (JPG, PNG, etc.)')
                e.target.value = ''
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
            toast.dismiss('place-order')

            if (result?.error) {
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

            toast.success('Order placed successfully! Redirecting to your orders...', { duration: 3000 })

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

    function openDeleteDialog(id: number) {
        setAddressToDelete(id)
        setDeleteDialogOpen(true)
    }

    return {
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
    }
}
