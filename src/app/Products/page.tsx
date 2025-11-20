import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import OurProject from '../component/Home/OurProject'
import { Console, log } from 'console';

interface Product {
  slug: string;
  name: string;
  bgImage: string;
  description: string;
  extraLine?: string;
  extraImg?: string;
  image: string;
  overview: string;
  application?: string[];
  advantages?: string[];
  keyFeatures?: string[];
  specifications: Specification[];
  images: string[];
  logoImg?: string[];
  pdfURL?: string;
  storage?: string;
}

interface Specification {
  title: string;
  value: string;
}

async function getProductsData(): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/products`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const json = await res.json();
      return json.data?.products || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function Products() {
  const products = await getProductsData();
  
  {console.log(products);
  }
  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full">
        <Image
          src="/images/products-hero.jpg"
          alt="Products Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Our Products
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
              Discover our comprehensive range of high-quality construction materials and solutions
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--foreground)]">
            Product Portfolio
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto"> 
            We offer a diverse range of innovative construction materials designed to enhance durability,
            strength, and performance of modern infrastructure projects.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={product.slug}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-64">
                <Image
                  src={product.bgImage || product.image || '/images/default-product.png'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.logoImg && product.logoImg.length > 0 && product.logoImg[0] && (
                  <div className="absolute top-2 right-2">
                    <Image
                      src={product.logoImg[0]}
                      alt={`${product.name} Logo`}
                      width={60}
                      height={60}
                      className="object-contain bg-white rounded p-1"
                    />
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-[var(--foreground)]">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-3">
                  {product.description}
                </p>
                {product.extraLine && (
                  <p className="text-sm text-gray-500 mb-4 italic">
                    {product.extraLine}
                  </p>
                )}

                <div className="mb-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Key Features:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {product.keyFeatures?.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-primaryColor mr-2">•</span>
                        {feature}
                      </li>
                    ))}
                    {product.keyFeatures && product.keyFeatures.length > 3 && (
                      <li className="text-gray-500 text-xs">
                        +{product.keyFeatures.length - 3} more features
                      </li>
                    )}
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Applications:</h4>
                  <div className="flex flex-wrap gap-1">
                    {product.application?.slice(0, 2).map((app, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {app}
                      </span>
                    ))}
                    {product.application && product.application.length > 2 && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                        +{product.application.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={`/Products/${product.slug}`}
                  className="block w-full text-center bg-primaryColor text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products available at the moment.</p>
          </div>
        )}
      </section>

      {/* Featured Products Section */}
      <div className="overflow-x-hidden">
        <OurProject />
      </div>
    </main>
  )
}

