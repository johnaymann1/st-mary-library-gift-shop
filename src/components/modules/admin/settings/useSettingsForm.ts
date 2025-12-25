'use client'

import { useState } from 'react'
import { toast } from 'sonner'

interface ImageValidationResult {
    valid: boolean
    error?: string
}

export function validateImageFile(file: File): ImageValidationResult {
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        return {
            valid: false,
            error: 'Image must be less than 5MB. Please choose a smaller file.'
        }
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
        return {
            valid: false,
            error: 'Please select a JPG, PNG, or WebP image file.'
        }
    }

    return { valid: true }
}

export function useImageValidation() {
    const validateWithToast = (file: File): boolean => {
        const result = validateImageFile(file)
        if (!result.valid && result.error) {
            toast.error(result.error)
            return false
        }
        return true
    }

    return { validateImageFile: validateWithToast }
}

interface SettingsFormState {
    loading: boolean
}

export function useSettingsForm() {
    const [state, setState] = useState<SettingsFormState>({ loading: false })

    const setLoading = (loading: boolean) => {
        setState({ loading })
    }

    return {
        loading: state.loading,
        setLoading
    }
}
