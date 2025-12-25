'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin, Plus, Pencil, Trash2, Check, X, Star } from 'lucide-react'
import { toast } from 'sonner'
import { SavedAddress } from '@/types'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

interface SavedAddressesProps {
    addresses: SavedAddress[]
    userId: string
}

export default function SavedAddresses({ addresses: initialAddresses, userId }: SavedAddressesProps) {
    const [addresses, setAddresses] = useState<SavedAddress[]>(initialAddresses)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        label: '',
        address: '',
        isDefault: false
    })

    const resetForm = () => {
        setFormData({ label: '', address: '', isDefault: false })
    }

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { saveAddress, getUserAddresses } = await import('@/app/actions/address')
            const formDataObj = new FormData()
            formDataObj.append('label', formData.label)
            formDataObj.append('address', formData.address)
            formDataObj.append('is_default', String(formData.isDefault))

            const result = await saveAddress(formDataObj)

            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success('Address added successfully!')
                setIsAddDialogOpen(false)
                resetForm()
                // Fetch updated addresses
                const { addresses: updatedAddresses } = await getUserAddresses()
                setAddresses(updatedAddresses)
            }
        } catch (error) {
            toast.error('Failed to add address')
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingAddress) return
        setLoading(true)

        try {
            const { updateAddress, getUserAddresses } = await import('@/app/actions/address')
            const formDataObj = new FormData()
            formDataObj.append('label', formData.label)
            formDataObj.append('address', formData.address)
            formDataObj.append('is_default', String(formData.isDefault))

            const result = await updateAddress(editingAddress.id, formDataObj)

            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success('Address updated successfully!')
                setIsEditDialogOpen(false)
                setEditingAddress(null)
                resetForm()
                // Fetch updated addresses
                const { addresses: updatedAddresses } = await getUserAddresses()
                setAddresses(updatedAddresses)
            }
        } catch (error) {
            toast.error('Failed to update address')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (addressId: number) => {
        if (!confirm('Are you sure you want to delete this address?')) return

        setLoading(true)
        try {
            const { deleteAddress, getUserAddresses } = await import('@/app/actions/address')
            const result = await deleteAddress(addressId)

            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success('Address deleted successfully!')
                // Fetch updated addresses
                const { addresses: updatedAddresses } = await getUserAddresses()
                setAddresses(updatedAddresses)
            }
        } catch (error) {
            toast.error('Failed to delete address')
        } finally {
            setLoading(false)
        }
    }

    const openEditDialog = (address: SavedAddress) => {
        setEditingAddress(address)
        setFormData({
            label: address.label,
            address: address.address,
            isDefault: address.is_default
        })
        setIsEditDialogOpen(true)
    }

    const openAddDialog = () => {
        resetForm()
        setIsAddDialogOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white transition-colors">
                        Saved Addresses
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 transition-colors">
                        Manage your delivery addresses
                    </p>
                </div>
                <Button
                    onClick={openAddDialog}
                    variant="outline"
                    className="gap-2 dark:border-neutral-700 dark:hover:bg-neutral-800 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Address
                </Button>
            </div>

            {addresses.length === 0 ? (
                <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 transition-colors">
                    <MapPin className="h-12 w-12 text-neutral-400 dark:text-neutral-500 mx-auto mb-3" />
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4 transition-colors">No saved addresses yet</p>
                    <Button onClick={openAddDialog} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Your First Address
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {addresses.map((address) => (
                        <div
                            key={address.id}
                            className="relative p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-rose-300 dark:hover:border-rose-700 transition-all"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-rose-50 dark:bg-rose-950 rounded-lg">
                                    <MapPin className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-neutral-900 dark:text-white transition-colors">
                                            {address.label}
                                        </h4>
                                        {address.is_default && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded-full transition-colors">
                                                <Star className="h-3 w-3 fill-current" />
                                                Default
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 transition-colors">
                                        {address.address}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => openEditDialog(address)}
                                        className="h-8 w-8 text-neutral-600 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(address.id)}
                                        disabled={loading}
                                        className="h-8 w-8 text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Address Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="dark:bg-neutral-900 dark:border-neutral-800">
                    <DialogHeader>
                        <DialogTitle className="dark:text-white">Add New Address</DialogTitle>
                        <DialogDescription className="dark:text-neutral-400">
                            Add a new delivery address to your account
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="add-label" className="dark:text-neutral-300">Address Label</Label>
                            <Input
                                id="add-label"
                                placeholder="e.g., Home, Work, Office"
                                value={formData.label}
                                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                                required
                                className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="add-address" className="dark:text-neutral-300">Full Address</Label>
                            <Input
                                id="add-address"
                                placeholder="Street, building, apartment, city"
                                value={formData.address}
                                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                required
                                className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="add-default"
                                checked={formData.isDefault}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isDefault: checked as boolean }))}
                            />
                            <Label htmlFor="add-default" className="text-sm dark:text-neutral-300">
                                Set as default address
                            </Label>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsAddDialogOpen(false)}
                                className="flex-1 dark:border-neutral-700 dark:hover:bg-neutral-800"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading} className="flex-1 gap-2">
                                {loading ? (
                                    <>
                                        <span className="animate-spin">⏳</span>
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <Check className="h-4 w-4" />
                                        Add Address
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Address Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="dark:bg-neutral-900 dark:border-neutral-800">
                    <DialogHeader>
                        <DialogTitle className="dark:text-white">Edit Address</DialogTitle>
                        <DialogDescription className="dark:text-neutral-400">
                            Update your delivery address
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEdit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-label" className="dark:text-neutral-300">Address Label</Label>
                            <Input
                                id="edit-label"
                                placeholder="e.g., Home, Work, Office"
                                value={formData.label}
                                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                                required
                                className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-address" className="dark:text-neutral-300">Full Address</Label>
                            <Input
                                id="edit-address"
                                placeholder="Street, building, apartment, city"
                                value={formData.address}
                                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                required
                                className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="edit-default"
                                checked={formData.isDefault}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isDefault: checked as boolean }))}
                            />
                            <Label htmlFor="edit-default" className="text-sm dark:text-neutral-300">
                                Set as default address
                            </Label>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsEditDialogOpen(false)
                                    setEditingAddress(null)
                                }}
                                className="flex-1 dark:border-neutral-700 dark:hover:bg-neutral-800"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading} className="flex-1 gap-2">
                                {loading ? (
                                    <>
                                        <span className="animate-spin">⏳</span>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Check className="h-4 w-4" />
                                        Update Address
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
