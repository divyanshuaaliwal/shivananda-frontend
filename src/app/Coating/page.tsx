"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import service from "../../../public/images/service.png";

interface Product {
  _id?: string;
  slug: string;
  name: string;
  description: string;
  image?: string;
  bgImage?: string;
  images?: string[];
  isActive: boolean;
  category: string;
}

interface ProductCard {
  ProjectLink: string;
  ProjectImages: string[];
  ProjectTitle: string;
  ProjectDescription: string;
}

const ProductCard = ({ product }: { product: ProductCard }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (product.ProjectImages.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === product.ProjectImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [product.ProjectImages.length]);

  return (
    <div className="flex flex-col h-full">
      <div className="w-full h-[250px] overflow-hidden shadow-lg border-4 border-gray-200 relative bg-gray-100">
        {product.ProjectImages.length > 0 ? (
          product.ProjectImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${product.ProjectTitle} image ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>
      <div className="mt-4 p-4 flex-grow flex flex-col">
        <Link
          href={product.ProjectLink}
          className="font-medium text-xl text-primary hover:text-primary-dark transition-colors duration-300"
        >
          {product.ProjectTitle}
        </Link>
        <p className="text-text-dark mt-2 text-sm">
          {product.ProjectDescription}
        </p>
      </div>
    </div>
  );
};

const CoatingPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const heroTitle = 'Advanced Solutions for Masterbatches, Paints, Inks and Coatings';
  const heroSubtitle = '';

  useEffect(() => {
    loadCoatingProducts();
  }, []);

  const loadCoatingProducts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/products?category=coating&limit=100`, {
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success' && data.data && data.data.products) {
          // Filter only active coating products
          const activeProducts = data.data.products.filter((p: Product) => p.isActive && p.category === 'coating');
          setProducts(activeProducts);
        }
      }
    } catch (error) {
      console.error('Error loading coating products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Convert coating products to the format expected by ProductCard
  const ourProducts: ProductCard[] = products.map(product => ({
    ProjectLink: `/Products/${product.slug}`,
    ProjectImages: product.images && product.images.length > 0 
      ? product.images 
      : (product.image ? [product.image] : product.bgImage ? [product.bgImage] : []),
    ProjectTitle: product.name || '',
    ProjectDescription: product.description || '',
  }));

  const heroBackgroundStyle = {
    backgroundImage: "url('https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=1470&auto=format&fit=crop')",
    backgroundAttachment: "fixed",
  };

  if (loading) {
    return (
      <div className="bg-background text-text-dark min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryColor mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-text-dark">
      {/* Headline Section with Background Image */}
      <section className="relative h-[90vh] overflow-hidden">
        {/* Background image with parallax effect */}
        <div
          className="absolute inset-0 bg-cover bg-center transform scale-110 transition-transform duration-700"
          style={heroBackgroundStyle}
        ></div>

        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-70"></div>

        {/* Animated accent elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 rounded-full bg-yellow-500 opacity-20 blur-3xl -top-20 -left-20 animate-pulse"></div>
          <div
            className="absolute w-80 h-80 rounded-full bg-blue-600 opacity-20 blur-3xl bottom-10 right-10 animate-pulse"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center items-center">
          <div className="text-center max-w-5xl mx-auto">
            {/* <h3 className="text-primaryColor font-bold text-xl mb-4 tracking-wider uppercase">
              Industry Leaders Since 1989
            </h3> */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              {heroTitle.includes('Masterbatches') ? (
                <>
                  {heroTitle.split('Masterbatches').map((part, index, arr) => {
                    if (index === arr.length - 1) {
                      return <span key={index}>{part}</span>;
                    }
                    return (
                      <span key={index}>
                        {part}
                        <span className="text-primaryColor">Masterbatches</span>
                      </span>
                    );
                  })}
                </>
              ) : (
                heroTitle
              )}
            </h1>
            {heroSubtitle && (
              <p className="text-xl md:text-2xl text-white mt-4">{heroSubtitle}</p>
            )}
          </div>
        </div>
      </section>

      {/* Full-Width Image Section */}

      {/* <section className="relative w-full py-16 px-4 md:px-8 bg-black text-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-yellow-400">OUR SERVICES</h2>
        
        <div className="mb-10">
          <p className="text-base leading-relaxed">
            We at Narsingh Dass Group are relentlessly trying to touch new horizons with our expertise and special skills, constantly striving to improve the functioning of process within the framework of total quality program. ISO: 9001:2000 certification of group companies offers reliability of our services and installations. Our objective is to remain responsive to the needs of our customers and providing the product or service they require. Flexibility and creativity are the basis of our success. Some of the critical services performed by us include -
          </p>
        </div>

        <div className="relative px-4 sm:px-6 lg:px-8 py-10">
          {/* Dashed Circle */}
      {/* <div className="absolute w-full h-full max-w-4xl mx-auto inset-0" style={{
            border: '4px dashed #FFD700',
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}></div> */}

      {/* What we do? and Single solution text */}
      {/* <div className="text-center mb-16">
            <h3 className="text-2xl text-yellow-400 font-bold mb-4">what we do?</h3>
          </div>
          <div className="text-center mt-32">
            <h3 className="text-2xl text-yellow-400 font-bold">single solution</h3>
          </div> */}

      {/* Service Circles */}
      {/* <div className="flex flex-wrap justify-center">
            <div className="w-36 h-36 rounded-full border-2 border-yellow-400 flex items-center justify-center text-center m-2 sm:m-4">
              <p className="text-sm px-2">training and further education for customers</p>
            </div>
            <div className="w-36 h-36 rounded-full border-2 border-yellow-400 flex items-center justify-center text-center m-2 sm:m-4">
              <p className="text-sm px-2">technical services and advice</p>
            </div>
            <div className="w-36 h-36 rounded-full border-2 border-yellow-400 flex items-center justify-center text-center m-2 sm:m-4">
              <p className="text-sm px-2">participation at industry fairs</p>
            </div>
            <div className="w-36 h-36 rounded-full border-2 border-yellow-400 flex items-center justify-center text-center m-2 sm:m-4">
              <p className="text-sm px-2">logistics - storage & distribution</p>
            </div>
            <div className="w-36 h-36 rounded-full border-2 border-yellow-400 flex items-center justify-center text-center m-2 sm:m-4">
              <p className="text-sm px-2">environmental awareness</p>
            </div>
            <div className="w-36 h-36 rounded-full border-2 border-yellow-400 flex items-center justify-center text-center m-2 sm:m-4">
              <p className="text-sm px-2">market & product update</p>
            </div>
            <div className="w-36 h-36 rounded-full border-2 border-yellow-400 flex items-center justify-center text-center m-2 sm:m-4">
              <p className="text-sm px-2">advice on product selection</p>
            </div>
            <div className="w-36 h-36 rounded-full border-2 border-yellow-400 flex items-center justify-center text-center m-2 sm:m-4">
              <p className="text-sm px-2">regular newsletters</p>
            </div>
          </div>
        </div>
      </div> */}
      {/* </section>   */}

      {/* Products Grid Section */}
      <section className="py-12 sm:py-14 md:py-16 lg:py-20 bg-light">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-5 text-primary text-2xl sm:text-3xl leading-8 sm:leading-10 font-medium">
              Our <span className="font-bold uppercase">PRODUCTS</span>
            </h2>
          </div>

          {ourProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ourProducts.map((product, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No products available at the moment.
            </div>
          )}
        </div>
      </section>
      <section className="py-16 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="relative w-full h-auto aspect-[16/9] rounded-xl overflow-hidden shadow-2xl">
            <Image
              src={service}
              alt="Services Overview"
              layout="fill"
              objectFit="contain"
              className="w-full h-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CoatingPage;
