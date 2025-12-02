/**
 * Compresses an image file to reduce its size
 * @param file - The image file to compress
 * @param maxWidth - Maximum width of the compressed image (default: 1200px)
 * @param maxHeight - Maximum height of the compressed image (default: 1200px)
 * @param quality - Quality of the compressed image (0-1, default: 0.8)
 * @returns Promise<File> - The compressed image file
 */
export async function compressImage(
    file: File,
    maxWidth: number = 1200,
    maxHeight: number = 1200,
    quality: number = 0.8
): Promise<File> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        
        reader.onload = (e) => {
            const img = new Image()
            
            img.onload = () => {
                // Create canvas
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'))
                    return
                }
                
                // Calculate new dimensions
                let width = img.width
                let height = img.height
                
                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width
                        width = maxWidth
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height
                        height = maxHeight
                    }
                }
                
                // Set canvas dimensions
                canvas.width = width
                canvas.height = height
                
                // Draw and compress image
                ctx.drawImage(img, 0, 0, width, height)
                
                // Convert canvas to blob
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Failed to compress image'))
                            return
                        }
                        
                        // Create new file from blob
                        const compressedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now(),
                        })
                        
                        resolve(compressedFile)
                    },
                    file.type,
                    quality
                )
            }
            
            img.onerror = () => {
                reject(new Error('Failed to load image'))
            }
            
            img.src = e.target?.result as string
        }
        
        reader.onerror = () => {
            reject(new Error('Failed to read file'))
        }
        
        reader.readAsDataURL(file)
    })
}
