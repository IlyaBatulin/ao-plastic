import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// tailwind-merge должен знать кастомные типографические классы из globals.css,
// иначе он считает их цветом текста и вырезает при cn("text-h2 text-primary").
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        'text-display',
        'text-h1',
        'text-h2',
        'text-h3',
        'text-h4',
        'text-body',
        'text-body-lead',
        'text-caption',
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
