import Link from 'next/link'

interface PlatformCardProps {
  platform: {
    id: string
    name: string
    slug: string
    features?: string[]
  }
}

export default function PlatformCard({ platform }: PlatformCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-bold text-gray-900 mb-2">{platform.name}</h3>
      <p className="text-sm text-gray-600 mb-4">Fee Calculator</p>

      {platform.features && platform.features.length > 0 && (
        <ul className="text-sm text-gray-600 mb-4 space-y-1">
          {platform.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}

      <Link
        href={`/${platform.slug}-fee-calculator/`}
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 min-h-[44px] flex items-center"
      >
        Open
      </Link>
    </div>
  )
}
