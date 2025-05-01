"use client"

import { useState, useEffect } from "react"
import { CheckIcon, PlusIcon } from "lucide-react"
import { Product } from "@/objects/products"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

interface ShopFiltersProps {
  allProducts: Product[]
  setProducts: (products: Product[]) => void
}

export default function ShopFilters({ allProducts, setProducts }: ShopFiltersProps) {
  // Price filter
  const [priceRange, setPriceRange] = useState([0, 200])
  
  // Category filters
  const categories = Array.from(new Set(allProducts.map(p => p.category)))
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  
  // Gender filters
  const [selectedGenders, setSelectedGenders] = useState<string[]>([])
  
  // Size filters
  const allSizes = Array.from(new Set(allProducts.flatMap(p => p.sizes)))
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  
  // Search
  const [searchQuery, setSearchQuery] = useState("")

  // Apply filters
  useEffect(() => {
    let filteredProducts = [...allProducts]
    
    // Price filter
    filteredProducts = filteredProducts.filter(
      p => p.discountPrice ? 
        (p.discountPrice >= priceRange[0] && p.discountPrice <= priceRange[1]) :
        (p.price >= priceRange[0] && p.price <= priceRange[1])
    )
    
    // Category filter
    if (selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter(p => 
        selectedCategories.includes(p.category)
      )
    }
    
    // Gender filter
    if (selectedGenders.length > 0) {
      filteredProducts = filteredProducts.filter(p => 
        selectedGenders.includes(p.gender) || selectedGenders.includes('unisex')
      )
    }
    
    // Size filter
    if (selectedSizes.length > 0) {
      filteredProducts = filteredProducts.filter(p => 
        p.sizes.some(size => selectedSizes.includes(size))
      )
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      )
    }
    
    setProducts(filteredProducts)
  }, [priceRange, selectedCategories, selectedGenders, selectedSizes, searchQuery, allProducts, setProducts])

  // Toggle category selection
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }
  
  // Toggle gender selection
  const toggleGender = (gender: string) => {
    if (selectedGenders.includes(gender)) {
      setSelectedGenders(selectedGenders.filter(g => g !== gender))
    } else {
      setSelectedGenders([...selectedGenders, gender])
    }
  }
  
  // Toggle size selection
  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size))
    } else {
      setSelectedSizes([...selectedSizes, size])
    }
  }
  
  // Reset all filters
  const resetFilters = () => {
    setPriceRange([0, 200])
    setSelectedCategories([])
    setSelectedGenders([])
    setSelectedSizes([])
    setSearchQuery("")
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>
      
      {/* Active filters */}
      {(selectedCategories.length > 0 || selectedGenders.length > 0 || selectedSizes.length > 0) && (
        <div className="mb-6">
          <div className="text-sm font-medium mb-2">Active Filters:</div>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map(category => (
              <Badge 
                key={`cat-${category}`}
                variant="secondary"
                className="flex items-center gap-1"
                onClick={() => toggleCategory(category)}
              >
                {category}
                <CheckIcon className="h-3 w-3 ml-1" />
              </Badge>
            ))}
            {selectedGenders.map(gender => (
              <Badge 
                key={`gender-${gender}`}
                variant="secondary"
                className="flex items-center gap-1"
                onClick={() => toggleGender(gender)}
              >
                {gender}
                <CheckIcon className="h-3 w-3 ml-1" />
              </Badge>
            ))}
            {selectedSizes.map(size => (
              <Badge 
                key={`size-${size}`}
                variant="secondary"
                className="flex items-center gap-1"
                onClick={() => toggleSize(size)}
              >
                {size}
                <CheckIcon className="h-3 w-3 ml-1" />
              </Badge>
            ))}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="h-6 px-2 text-xs"
            >
              Clear All
            </Button>
          </div>
        </div>
      )}
      
      {/* Price Range */}
      <div>
        <h3 className="font-medium mb-4">Price Range</h3>
        <Slider
          defaultValue={[0, 200]}
          max={200}
          step={5}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mb-2"
        />
        <div className="flex items-center justify-between text-sm">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
      
      {/* Categories */}
      <Accordion type="single" collapsible defaultValue="categories">
        <AccordionItem value="categories">
          <AccordionTrigger className="py-2">Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map(category => (
                <div key={category} className="flex items-center">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <label
                    htmlFor={`category-${category}`}
                    className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {/* Gender */}
      <Accordion type="single" collapsible defaultValue="gender">
        <AccordionItem value="gender">
          <AccordionTrigger className="py-2">Gender</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {["men", "women", "unisex"].map(gender => (
                <div key={gender} className="flex items-center">
                  <Checkbox
                    id={`gender-${gender}`}
                    checked={selectedGenders.includes(gender)}
                    onCheckedChange={() => toggleGender(gender)}
                  />
                  <label
                    htmlFor={`gender-${gender}`}
                    className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {/* Sizes */}
      <Accordion type="single" collapsible defaultValue="sizes">
        <AccordionItem value="sizes">
          <AccordionTrigger className="py-2">Sizes</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {allSizes.map(size => (
                <Badge
                  key={size}
                  variant={selectedSizes.includes(size) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleSize(size)}
                >
                  {size}
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {/* Reset Filters */}
      <Button 
        variant="outline" 
        onClick={resetFilters}
        className="w-full"
      >
        Reset Filters
      </Button>
    </div>
  )
}