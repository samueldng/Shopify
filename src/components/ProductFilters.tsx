import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, X, Filter } from 'lucide-react'
import { Filters } from '../types'
import { supabase } from '../lib/supabase'
import '../styles/product-filters.css'

interface FilterOptions {
  categories: Array<{ id: string; name: string }>
  brands: Array<{ id: string; name: string }>
  priceRange: { min: number; max: number }
}

// Interface Filters importada do arquivo de tipos centralizados

interface ProductFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  onClearFilters?: () => void
  isOpen: boolean
  onToggle: () => void
}

export default function ProductFilters({ filters, onFiltersChange, onClearFilters, isOpen, onToggle }: ProductFiltersProps) {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    categories: [],
    brands: [],
    priceRange: { min: 0, max: 1000 }
  })
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    brands: true,
    price: true,
    other: true
  })

  useEffect(() => {
    loadFilterOptions()
  }, [])

  const loadFilterOptions = async () => {
    try {
      // Load categories
      const { data: categories } = await supabase
        .from('categories')
        .select('id, name')
        .order('name')

      // Load brands
      const { data: brands } = await supabase
        .from('brands')
        .select('id, name')
        .order('name')

      // Get price range
      const { data: priceData } = await supabase
        .from('products')
        .select('price')
        .order('price')

      const prices = priceData?.map(p => p.price) || []
      const minPrice = Math.min(...prices) || 0
      const maxPrice = Math.max(...prices) || 1000

      setFilterOptions({
        categories: categories || [],
        brands: brands || [],
        priceRange: { min: minPrice, max: maxPrice }
      })
    } catch (error) {
      console.error('Error loading filter options:', error)
    }
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, categoryId]
      : filters.categories.filter(id => id !== categoryId)
    
    onFiltersChange({ ...filters, categories: newCategories })
  }

  const handleBrandChange = (brandId: string, checked: boolean) => {
    const newBrands = checked
      ? [...filters.brands, brandId]
      : filters.brands.filter(id => id !== brandId)
    
    onFiltersChange({ ...filters, brands: newBrands })
  }

  const handlePriceChange = (field: 'priceMin' | 'priceMax', value: number) => {
    onFiltersChange({ ...filters, [field]: value })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      brands: [],
      priceMin: filterOptions.priceRange.min,
      priceMax: filterOptions.priceRange.max,
      inStock: false,
      onSale: false
    })
  }

  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.priceMin > filterOptions.priceRange.min ||
    filters.priceMax < filterOptions.priceRange.max ||
    filters.inStock ||
    filters.onSale

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between p-4 text-left"
        >
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span className="font-medium">Filtros</span>
            {hasActiveFilters && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Ativos
              </span>
            )}
          </div>
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>

      {/* Filter Content */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
        {/* Header */}
        <div className="hidden lg:flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Filtros</h3>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters || clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <X className="h-4 w-4" />
              <span>Limpar</span>
            </button>
          )}
        </div>

        <div className="p-4 space-y-6">
          {/* Categories */}
          <div>
            <button
              onClick={() => toggleSection('categories')}
              className="flex items-center justify-between w-full text-left mb-3"
            >
              <h4 className="font-medium text-gray-900">Categorias</h4>
              {expandedSections.categories ? 
                <ChevronUp className="h-4 w-4" /> : 
                <ChevronDown className="h-4 w-4" />
              }
            </button>
            {expandedSections.categories && (
              <div className="space-y-2">
                {filterOptions.categories.map(category => (
                  <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category.id)}
                      onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Brands */}
          <div>
            <button
              onClick={() => toggleSection('brands')}
              className="flex items-center justify-between w-full text-left mb-3"
            >
              <h4 className="font-medium text-gray-900">Marcas</h4>
              {expandedSections.brands ? 
                <ChevronUp className="h-4 w-4" /> : 
                <ChevronDown className="h-4 w-4" />
              }
            </button>
            {expandedSections.brands && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filterOptions.brands.map(brand => (
                  <label key={brand.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand.id)}
                      onChange={(e) => handleBrandChange(brand.id, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{brand.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div>
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full text-left mb-3"
            >
              <h4 className="font-medium text-gray-900">Preço</h4>
              {expandedSections.price ? 
                <ChevronUp className="h-4 w-4" /> : 
                <ChevronDown className="h-4 w-4" />
              }
            </button>
            {expandedSections.price && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Mín</label>
                    <input
                      type="number"
                      value={filters.priceMin}
                      onChange={(e) => handlePriceChange('priceMin', Number(e.target.value))}
                      min={filterOptions.priceRange.min}
                      max={filterOptions.priceRange.max}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Máx</label>
                    <input
                      type="number"
                      value={filters.priceMax}
                      onChange={(e) => handlePriceChange('priceMax', Number(e.target.value))}
                      min={filterOptions.priceRange.min}
                      max={filterOptions.priceRange.max}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  R$ {filters.priceMin} - R$ {filters.priceMax}
                </div>
              </div>
            )}
          </div>

          {/* Other Filters */}
          <div>
            <button
              onClick={() => toggleSection('other')}
              className="flex items-center justify-between w-full text-left mb-3"
            >
              <h4 className="font-medium text-gray-900">Outros</h4>
              {expandedSections.other ? 
                <ChevronUp className="h-4 w-4" /> : 
                <ChevronDown className="h-4 w-4" />
              }
            </button>
            {expandedSections.other && (
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => onFiltersChange({ ...filters, inStock: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Apenas em estoque</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.onSale}
                    onChange={(e) => onFiltersChange({ ...filters, onSale: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Em promoção</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Clear Button */}
        <div className="lg:hidden border-t border-gray-200 p-4">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="w-full text-center py-2 text-blue-600 hover:text-blue-700 flex items-center justify-center space-x-1"
            >
              <X className="h-4 w-4" />
              <span>Limpar todos os filtros</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}