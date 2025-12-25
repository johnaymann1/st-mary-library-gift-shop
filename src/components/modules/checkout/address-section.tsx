'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin, Plus, Edit2, Trash2, Check } from 'lucide-react'
import { SavedAddress } from '@/types'
import { toast } from 'sonner'

interface AddressSectionProps {
    addresses: SavedAddress[]
    selectedAddress: SavedAddress | null
    customAddress: string
    phone: string
    userPhone: string
    editingPhone: boolean
    onAddressSelect: (address: SavedAddress) => void
    onCustomAddressChange: (address: string) => void
    onPhoneChange: (phone: string) => void
    onEditingPhoneChange: (editing: boolean) => void
    onSaveAddress: (formData: FormData) => Promise<void>
    onDeleteAddress: (addressId: number) => void
    onSavePhone: () => Promise<void>
    onOpenDeleteDialog: (addressId: number) => void
}

export function AddressSection({
    addresses,
    selectedAddress,
    customAddress,
    phone,
    userPhone,
    editingPhone,
    onAddressSelect,
    onCustomAddressChange,
    onPhoneChange,
    onEditingPhoneChange,
    onSaveAddress,
    onSavePhone,
    onOpenDeleteDialog
}: AddressSectionProps) {
    const [showAddressForm, setShowAddressForm] = useState(false)
    const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null)

    async function handleSaveAddressClick() {
        const labelInput = document.getElementById('address-label-input') as HTMLInputElement
        const addressInput = document.getElementById('address-text-input') as HTMLTextAreaElement
        const defaultInput = document.getElementById('address-default-input') as HTMLInputElement

        if (!labelInput.value || !addressInput.value) {
            toast.error('Please fill in all required fields', {
                description: 'Both label and address are required',
                duration: 4000,
            })
            if (!labelInput.value) labelInput.focus()
            else if (!addressInput.value) addressInput.focus()
            return
        }

        const formData = new FormData()
        formData.append('label', labelInput.value)
        formData.append('address', addressInput.value)
        if (defaultInput.checked) {
            formData.append('is_default', 'on')
        }

        await onSaveAddress(formData)
        setShowAddressForm(false)
        setEditingAddress(null)
    }

    return (
        <div className="mt-6 space-y-4">
            {/* Saved Addresses */}
            {addresses.length > 0 && !showAddressForm && (
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 transition-colors">Saved Addresses</label>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setShowAddressForm(true)
                                setEditingAddress(null)
                            }}
                            className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 transition-colors"
                            aria-label="Add new address"
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Add New
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {addresses.map((addr) => (
                            <div
                                key={addr.id}
                                className={`p-3 border-2 rounded-xl cursor-pointer transition-all focus-within:ring-4 focus-within:ring-rose-500 focus-within:ring-offset-2 ${selectedAddress?.id === addr.id
                                    ? 'border-rose-600 dark:border-rose-500 bg-rose-50 dark:bg-rose-900/20'
                                    : 'border-neutral-200 dark:border-neutral-700 hover:border-rose-300 dark:hover:border-rose-600'
                                    }`}
                                onClick={() => onAddressSelect(addr)}
                                role="button"
                                tabIndex={0}
                                aria-label={`Select ${addr.label} address${addr.is_default ? ' (default)' : ''}${selectedAddress?.id === addr.id ? ' - currently selected' : ''}`}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault()
                                        onAddressSelect(addr)
                                    }
                                }}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-rose-600 dark:text-rose-400 transition-colors" />
                                            <span className="font-semibold text-neutral-900 dark:text-white transition-colors">{addr.label}</span>
                                            {addr.is_default && (
                                                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full transition-colors">Default</span>
                                            )}
                                            {selectedAddress?.id === addr.id && (
                                                <Check className="h-4 w-4 text-rose-600 dark:text-rose-400 transition-colors" />
                                            )}
                                        </div>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 transition-colors">{addr.address}</p>
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
                                            className="h-8 w-8 p-0 focus:ring-2 focus:ring-rose-500"
                                            aria-label={`Edit ${addr.label} address`}
                                        >
                                            <Edit2 className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onOpenDeleteDialog(addr.id)
                                            }}
                                            className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 transition-colors"
                                            aria-label={`Delete ${addr.label} address`}
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
                <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-neutral-900 dark:text-white transition-colors">
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
                    <div className="space-y-3" key={editingAddress?.id || 'new'}>
                        <div>
                            <label htmlFor="address-label-input" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1 transition-colors">Label *</label>
                            <Input
                                id="address-label-input"
                                name="label"
                                defaultValue={editingAddress?.label || ''}
                                placeholder="e.g., Home, Work"
                                required
                                className="h-11 text-[16px] focus:ring-4 focus:ring-rose-500 focus:ring-offset-2 dark:bg-neutral-900 dark:border-neutral-600 dark:text-white dark:placeholder:text-neutral-500 transition-colors"
                                aria-required="true"
                            />
                        </div>
                        <div>
                            <label htmlFor="address-text-input" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1 transition-colors">Full Address *</label>
                            <textarea
                                id="address-text-input"
                                name="address"
                                defaultValue={editingAddress?.address || ''}
                                placeholder="Street, Building, Apartment..."
                                required
                                rows={3}
                                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-4 focus:ring-rose-500 focus:ring-offset-2 focus:border-transparent text-neutral-900 dark:text-white dark:bg-neutral-900 dark:placeholder:text-neutral-500 text-[16px] transition-colors"
                                aria-required="true"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="address-default-input"
                                name="is_default"
                                defaultChecked={editingAddress?.is_default || false}
                                className="h-4 w-4 text-rose-600 rounded dark:bg-neutral-700 dark:border-neutral-600 transition-colors"
                            />
                            <label htmlFor="address-default-input" className="text-sm text-neutral-700 dark:text-neutral-300 transition-colors">Set as default address</label>
                        </div>
                        <Button
                            type="button"
                            className="w-full focus:ring-4 focus:ring-rose-500 focus:ring-offset-2"
                            onClick={handleSaveAddressClick}
                            aria-label={editingAddress ? 'Update address' : 'Save new address'}
                        >
                            {editingAddress ? 'Update Address' : 'Save Address'}
                        </Button>
                    </div>
                </div>
            )}

            {/* Custom Address Input */}
            {selectedAddress && !showAddressForm && (
                <div>
                    <label htmlFor="custom-address-input" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1 transition-colors">Delivery Address *</label>
                    <textarea
                        id="custom-address-input"
                        value={customAddress}
                        onChange={(e) => onCustomAddressChange(e.target.value)}
                        placeholder="Street, Building, Apartment..."
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-4 focus:ring-rose-500 focus:ring-offset-2 focus:border-transparent text-neutral-900 dark:text-white dark:bg-neutral-900 dark:placeholder:text-neutral-500 text-[16px] transition-colors"
                        aria-required="true"
                    />
                </div>
            )}

            {/* Phone Number */}
            <div>
                <label htmlFor="phone-input" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1 transition-colors">Phone Number *</label>
                <div className="flex gap-2">
                    <Input
                        id="phone-input"
                        value={phone}
                        onChange={(e) => onPhoneChange(e.target.value)}
                        type="tel"
                        required
                        placeholder="01xxxxxxxxx"
                        className="h-11 text-[16px] focus:ring-4 focus:ring-rose-500 focus:ring-offset-2 dark:bg-neutral-900 dark:border-neutral-600 dark:text-white dark:placeholder:text-neutral-500 transition-colors"
                        disabled={!editingPhone && !!userPhone}
                        aria-required="true"
                    />
                    {userPhone && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                if (editingPhone) {
                                    onSavePhone()
                                } else {
                                    onEditingPhoneChange(true)
                                }
                            }}
                            className="border-2 border-neutral-400 dark:border-neutral-600 text-neutral-800 dark:text-neutral-200 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-700 dark:hover:text-rose-400 hover:border-rose-400 dark:hover:border-rose-500 font-semibold transition-colors"
                        >
                            {editingPhone ? 'Save' : 'Edit'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

interface PickupInfoProps {
    address: string
    workingHours: string
}

export function PickupInfo({ address, workingHours }: PickupInfoProps) {
    return (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 transition-colors">
            <p className="text-sm text-green-800 dark:text-green-300 transition-colors">
                <strong>Pickup Location:</strong> {address}
                <br />
                <strong>Hours:</strong> {workingHours}
            </p>
        </div>
    )
}
