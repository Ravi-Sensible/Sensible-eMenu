import type { Category } from "../types"


interface CategorySliderProps {
  categories: Category[]
  selectedCategory: string
  onCategorySelect: (categoryId: string) => void
}

export default function CategorySlider({ categories, selectedCategory, onCategorySelect }: CategorySliderProps) {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex space-x-3 pb-2">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => onCategorySelect(category.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === category.id
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-700 border border-gray-200"
            }`}
          >
            {category.icon && <span className="mr-2">{category.icon}</span>}
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}