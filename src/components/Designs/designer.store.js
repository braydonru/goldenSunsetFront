import { create } from 'zustand'

export const useDesignerStore = create((set) => ({
    size: null,
    selectedColor: null,
    specification: null,
    font: 'Arial, sans-serif',
    selectedVariant: null,
    quantity: 1,
    totalprice: 0,

    setSize: (size) => set({ size }),
    setColor: (color) => set({ selectedColor: color }),
    setSpecification: (specification) => set({ specification }),
    setFont: (font) => set({ font }),
    setSelectedVariant: (variant) => set({ selectedVariant: variant }),
    setQuantity: (quantity) => set({quantity}),
    setTotalprice: (totalprice) => set({totalprice}),

    resetDesignerState: () => set({
        size: null,
        selectedColor: null,
        specification: null,
        font: 'Arial, sans-serif',
        selectedVariant: null,
        quantity: null,
        totalprice: 0,
    }),
}))