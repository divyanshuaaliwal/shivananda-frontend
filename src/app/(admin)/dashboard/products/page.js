"use client";

import { useEffect, useState } from "react";
import { upsertContentNext, createProduct, updateProduct, findProductBySlug, getProducts, deleteProduct } from '../../utils/api';


const DEFAULT_PRODUCTS = {
  products: [
    {
      slug: "synthetic-fibre",
      name: "Synthetic Fibre",
      category: "synthetic-fibre",
      bgImage: "/images/steel-fiber-img.png",
      description: "Empowering Fibre Reinforcement Technology",
      extraLine: "Recron 3s - Making a stronger world",
      logoImg: ["/images/recron-s3.png"],
      image: "/images/synthetic-fiber-p.png",
      overview: "Concrete often suffers from brittleness, low tensile strength, and shrinkage cracks. Synthetic Fibre, made from micro polyester and polypropylene, significantly enhances concrete performance by improving crack resistance, increasing tensile strength, and ensuring better bonding. It is specifically designed for projects facing repeated stress, temperature variations, and exposure to moisture. This fibre reinforcement technology provides long-lasting durability for industrial flooring, roads, bridges, and precast concrete applications.",
      benefits: [
        "Reduces shrinkage and plastic settlement cracks",
        "Improves impact resistance and toughness",
        "Enhances workability without compromising strength",
        "Provides uniform distribution throughout concrete mix",
        "Cost-effective alternative to traditional reinforcement methods"
      ],
      technicalSpecs: [
        { spec: "Fibre Type", value: "Micro Polyester & Polypropylene" },
        { spec: "Length", value: "6mm, 12mm, 19mm" },
        { spec: "Diameter", value: "18-32 microns" },
        { spec: "Tensile Strength", value: "≥ 300 MPa" },
        { spec: "Specific Gravity", value: "0.91" },
        { spec: "Melting Point", value: "≥ 160°C" },
        { spec: "Alkali Resistance", value: "Excellent" }
      ],
      applications: [
        "Industrial flooring and pavements",
        "Shotcrete and repair mortars",
        "Precast concrete panels",
        "Road construction and overlays",
        "Bridge decks and infrastructure",
        "Tunnel linings and underground structures"
      ],
      dosage: [
        { application: "General Construction", dosage: "0.6 - 1.0 kg/m³" },
        { application: "Industrial Flooring", dosage: "1.0 - 1.5 kg/m³" },
        { application: "Shotcrete", dosage: "1.5 - 3.0 kg/m³" },
        { application: "Precast Elements", dosage: "0.9 - 1.8 kg/m³" }
      ]
    },
    {
      slug: "steel-fiber",
      name: "Steel Fiber",
      category: "steel-fiber",
      bgImage: "/images/steel-fiber-img.png",
      description: "Ultimate Reinforcement for High-Performance Concrete",
      extraLine: "Dramix Steel Fibers - Engineered Excellence",
      logoImg: ["/images/dramix-logo.png"],
      image: "/images/steel-fiber-p.png",
      overview: "Steel Fiber represents the pinnacle of concrete reinforcement technology, providing exceptional tensile strength and crack resistance. Made from high-quality carbon steel, these fibers are engineered with hooked ends for superior mechanical anchorage in concrete matrix. They offer outstanding performance in applications requiring high impact resistance, fatigue strength, and durability under extreme loading conditions.",
      benefits: [
        "Superior crack control and post-crack performance",
        "Excellent fatigue resistance under cyclic loading",
        "High impact and blast resistance",
        "Reduces construction time by eliminating traditional reinforcement",
        "Maintains structural integrity in extreme conditions",
        "Cost-effective for high-performance applications"
      ],
      technicalSpecs: [
        { spec: "Material", value: "High Carbon Steel Wire" },
        { spec: "Length", value: "25mm, 35mm, 50mm, 60mm" },
        { spec: "Diameter", value: "0.5mm, 0.75mm, 1.0mm" },
        { spec: "Tensile Strength", value: "≥ 1100 MPa" },
        { spec: "Aspect Ratio", value: "45, 65, 80" },
        { spec: "End Shape", value: "Hooked" },
        { spec: "Surface", value: "Bright/Galvanized" }
      ],
      applications: [
        "Airport runways and taxiways",
        "Industrial heavy-duty flooring",
        "Tunnel segments and underground construction",
        "Precast concrete elements",
        "Suspended slabs and elevated structures",
        "Crash barriers and protective structures"
      ],
      dosage: [
        { application: "Industrial Flooring", dosage: "20 - 40 kg/m³" },
        { application: "Precast Elements", dosage: "25 - 50 kg/m³" },
        { application: "Tunnel Segments", dosage: "30 - 45 kg/m³" },
        { application: "Airport Pavements", dosage: "25 - 35 kg/m³" }
      ]
    },
    {
      slug: "basalt-fiber",
      name: "Basalt Fiber",
      category: "basalt-fiber",
      bgImage: "/images/basalt-fiber-img.png",
      description: "Natural Volcanic Rock Reinforcement",
      extraLine: "EcoFiber Basalt - Nature's Strongest Solution",
      logoImg: ["/images/ecofiber-logo.png"],
      image: "/images/basalt-fiber-p.png",
      overview: "Basalt Fiber is an eco-friendly reinforcement solution derived from natural volcanic basalt rock. This sustainable alternative offers excellent mechanical properties, superior chemical resistance, and outstanding thermal stability. With its natural composition and recyclable properties, basalt fiber represents the future of environmentally conscious construction while delivering exceptional performance in demanding applications.",
      benefits: [
        "100% natural and environmentally friendly",
        "Excellent chemical and alkali resistance",
        "Superior thermal stability (-260°C to +700°C)",
        "Non-toxic and non-carcinogenic",
        "Better fatigue resistance than glass fiber",
        "Recyclable and sustainable construction material"
      ],
      technicalSpecs: [
        { spec: "Material", value: "Natural Basalt Rock" },
        { spec: "Length", value: "6mm, 12mm, 18mm, 24mm" },
        { spec: "Diameter", value: "13-20 microns" },
        { spec: "Tensile Strength", value: "≥ 3000 MPa" },
        { spec: "Elastic Modulus", value: "89-110 GPa" },
        { spec: "Elongation", value: "3.15%" },
        { spec: "Operating Temperature", value: "-260°C to +700°C" }
      ],
      applications: [
        "Marine and coastal structures",
        "Chemical plant construction",
        "High-temperature applications",
        "Road construction and repair",
        "Bridge construction and rehabilitation",
        "Sustainable building projects"
      ],
      dosage: [
        { application: "General Construction", dosage: "1.0 - 2.0 kg/m³" },
        { application: "Marine Structures", dosage: "2.0 - 3.0 kg/m³" },
        { application: "Road Construction", dosage: "1.5 - 2.5 kg/m³" },
        { application: "High-Temperature", dosage: "2.5 - 4.0 kg/m³" }
      ]
    },
    {
      slug: "glass-fiber",
      name: "Glass Fiber",
      category: "glass-fiber",
      description: "Advanced Alkali-Resistant Glass Reinforcement",
      extraLine: "CemFIL Glass Fibers - Precision Engineering",
      logoImg: ["/images/cemfil-logo.png"],
      image: "/images/glass-fiber-p.png",
      overview: "Glass Fiber reinforcement technology utilizes alkali-resistant glass compositions specifically formulated for cement-based applications. These fibers provide excellent tensile strength, impact resistance, and dimensional stability while maintaining long-term durability in alkaline concrete environments. The advanced zirconia-enriched composition ensures consistent performance and extended service life.",
      benefits: [
        "High tensile strength and impact resistance",
        "Excellent alkali resistance for long-term durability",
        "Uniform distribution throughout concrete mix",
        "Improves flexural and impact strength",
        "Reduces plastic shrinkage and settlement cracks",
        "Lightweight and easy to handle"
      ],
      technicalSpecs: [
        { spec: "Material", value: "Alkali-Resistant Glass" },
        { spec: "Length", value: "6mm, 12mm, 18mm" },
        { spec: "Diameter", value: "14 microns" },
        { spec: "Tensile Strength", value: "≥ 1700 MPa" },
        { spec: "Elastic Modulus", value: "72 GPa" },
        { spec: "Zirconia Content", value: "≥ 16%" },
        { spec: "Alkali Resistance", value: "Excellent" }
      ],
      applications: [
        "GFRC panels and architectural elements",
        "Thin-section concrete applications",
        "Repair and rehabilitation works",
        "Decorative concrete and facades",
        "Lightweight concrete panels",
        "Spray-applied concrete systems"
      ],
      dosage: [
        { application: "GFRC Panels", dosage: "2.0 - 5.0 kg/m³" },
        { application: "Repair Mortars", dosage: "1.0 - 2.0 kg/m³" },
        { application: "Thin Sections", dosage: "2.5 - 4.0 kg/m³" },
        { application: "Spray Concrete", dosage: "1.5 - 3.0 kg/m³" }
      ]
    }
  ]
};

export default function ProductsContentPage() {
  const [productsData, setProductsData] = useState(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadingImages, setUploadingImages] = useState({});

  const loadData = async () => {
    setLoading(true);

    try {
      // Load products from database - include both construction and coating products
      const response = await getProducts({ limit: 100 }); // Get all products
      if (response.data && response.data.status === 'success' && response.data.data.products) {
        // Ensure all products have required array fields initialized
        const productsWithDefaults = response.data.data.products
          .map(product => ({
            ...product,
            slug: product.slug || "",
            name: product.name || "",
            category: product.category || "construction",
            bgImage: product.bgImage || "",
            description: product.description || "",
            extraLine: product.extraLine || "",
            logoImg: product.logoImg || [""],
            image: product.image || "",
            overview: product.overview || "",
            benefits: product.benefits || [""],
            technicalSpecs: product.technicalSpecs || [{ spec: "", value: "" }],
            applications: product.applications || [""],
            dosage: product.dosage || [{ application: "", dosage: "" }],
            isActive: product.isActive !== undefined ? product.isActive : true,
            featured: product.featured !== undefined ? product.featured : false,
            showInNavbar: product.showInNavbar !== undefined ? product.showInNavbar : false
          }));
        setProductsData({ products: productsWithDefaults });
        // console.log('✅ Loaded products from database:', productsWithDefaults.length);
      } else {
        // console.log('⚠️ No products found in database, using defaults');
        setProductsData(DEFAULT_PRODUCTS);
      }

      // Load categories
      const categoriesResponse = await fetch('/api/products/categories');
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        if (categoriesData.status === 'success') {
          setCategories(categoriesData.data.categories);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage('Error loading data: ' + error.message);
      // Fallback to default products
      setProductsData(DEFAULT_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const setField = (section, key, value) => {
    setProductsData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const setProductField = (productIndex, field, value) => {

    setProductsData(prev => ({
      ...prev,
      products: prev.products.map((product, index) => 
        index === productIndex 
          ? { ...product, [field]: value }
          : product
      )
    }));
  };

  const setTechnicalSpec = (productIndex, specIndex, field, value) => {
    setProductsData(prev => ({
      ...prev,
      products: prev.products.map((product, index) => 
        index === productIndex 
          ? {
              ...product,
              technicalSpecs: (product.technicalSpecs || []).map((spec, sIndex) => 
                sIndex === specIndex 
                  ? { ...spec, [field]: value }
                  : spec
              )
            }
          : product
      )
    }));
  };

  const addTechnicalSpec = (productIndex) => {
    setProductsData(prev => ({
      ...prev,
      products: prev.products.map((product, index) => 
        index === productIndex 
          ? {
              ...product,
              technicalSpecs: [...(product.technicalSpecs || []), { spec: "", value: "" }]
            }
          : product
      )
    }));
  };

  const removeTechnicalSpec = (productIndex, specIndex) => {
    setProductsData(prev => ({
      ...prev,
      products: prev.products.map((product, index) => 
        index === productIndex 
          ? {
              ...product,
              technicalSpecs: (product.technicalSpecs || []).filter((_, sIndex) => sIndex !== specIndex)
            }
          : product
      )
    }));
  };

  const setDosage = (productIndex, dosageIndex, field, value) => {
    setProductsData(prev => ({
      ...prev,
      products: prev.products.map((product, index) => 
        index === productIndex 
          ? {
              ...product,
              dosage: (product.dosage || []).map((dose, dIndex) => 
                dIndex === dosageIndex 
                  ? { ...dose, [field]: value }
                  : dose
              )
            }
          : product
      )
    }));
  };

  const addDosage = (productIndex) => {
    setProductsData(prev => ({
      ...prev,
      products: prev.products.map((product, index) => 
        index === productIndex 
          ? {
              ...product,
              dosage: [...(product.dosage || []), { application: "", dosage: "" }]
            }
          : product
      )
    }));
  };

  const removeDosage = (productIndex, dosageIndex) => {
    setProductsData(prev => ({
      ...prev,
      products: prev.products.map((product, index) => 
        index === productIndex 
          ? {
              ...product,
              dosage: (product.dosage || []).filter((_, dIndex) => dIndex !== dosageIndex)
            }
          : product
      )
    }));
  };

  const setArrayField = (productIndex, field, index, value) => {

    setProductsData(prev => ({
      ...prev,
      products: prev.products.map((product, pIndex) => 
        pIndex === productIndex 
          ? {
              ...product,
              [field]: (product[field] || []).map((item, iIndex) => 
                iIndex === index ? value : item
              )
            }
          : product
      )
    }));
  };

  const addArrayItem = (productIndex, field) => {
    setProductsData(prev => ({
      ...prev,
      products: prev.products.map((product, index) => 
        index === productIndex 
          ? {
              ...product,
              [field]: [...(product[field] || []), ""]
            }
          : product
      )
    }));
  };

  const removeArrayItem = (productIndex, field, itemIndex) => {
    setProductsData(prev => ({
      ...prev,
      products: prev.products.map((product, index) => 
        index === productIndex 
          ? {
              ...product,
              [field]: (product[field] || []).filter((_, iIndex) => iIndex !== itemIndex)
            }
          : product
      )
    }));
  };

  const generateSlug = (productIndex) => {
    const product = productsData.products[productIndex];
    if (!product || !product.name) return;
    
    const slug = product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    setProductField(productIndex, 'slug', slug);
  };

  const handleProductImageUpload = async (event, productIndex) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB limit for images)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image file must be less than 5MB');
      return;
    }

    try {
      setUploadingImages(prev => ({ ...prev, [`product-${productIndex}`]: true }));

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        setProductField(productIndex, 'image', result.imageUrl);
      } else {
        alert('Product image upload failed');
      }
    } catch (error) {
      console.error('Product image upload error:', error);
      alert('Failed to upload product image');
    } finally {
      setUploadingImages(prev => ({ ...prev, [`product-${productIndex}`]: false }));
      event.target.value = '';
    }
  };

  const handleBgImageUpload = async (event, productIndex) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB limit for images)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image file must be less than 5MB');
      return;
    }

    try {
      setUploadingImages(prev => ({ ...prev, [`bg-${productIndex}`]: true }));

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        setProductField(productIndex, 'bgImage', result.imageUrl);
      } else {
        alert('Background image upload failed');
      }
    } catch (error) {
      console.error('Background image upload error:', error);
      alert('Failed to upload background image');
    } finally {
      setUploadingImages(prev => ({ ...prev, [`bg-${productIndex}`]: false }));
      event.target.value = '';
    }
  };

  const handleLogoImageUpload = async (event, productIndex, logoIndex) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB limit for images)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image file must be less than 5MB');
      return;
    }

    try {
      setUploadingImages(prev => ({ ...prev, [`logo-${productIndex}-${logoIndex}`]: true }));

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        setArrayField(productIndex, 'logoImg', logoIndex, result.imageUrl);
      } else {
        alert('Logo image upload failed');
      }
    } catch (error) {
      console.error('Logo image upload error:', error);
      alert('Failed to upload logo image');
    } finally {
      setUploadingImages(prev => ({ ...prev, [`logo-${productIndex}-${logoIndex}`]: false }));
      event.target.value = '';
    }
  };

  const addProduct = () => {
    const newProduct = {
      slug: "",
      name: "",
      category: "",
      bgImage: "",
      description: "",
      extraLine: "",
      logoImg: [""],
      image: "",
      overview: "",
      benefits: [""],
      technicalSpecs: [{ spec: "", value: "" }],
      applications: [""],
      dosage: [{ application: "", dosage: "" }],
      isActive: true,
      featured: false,
      showInNavbar: false
    };

    setProductsData(prev => ({
      ...prev,
      products: [...prev.products, newProduct]
    }));
  };

  const removeProduct = async (productIndex) => {
    const currentProducts = productsData.products || [];
    const product = currentProducts[productIndex];
    if (!product) return;

    if (!window.confirm('Are you sure you want to remove this product?')) return;

    try {
      setSaving(true);

      // If product is saved in DB, delete it by _id (or resolve via slug)
      if (product._id) {
        await deleteProduct(product._id);
      } else if (product.slug && product.slug.trim()) {
        try {
          const existing = await findProductBySlug(product.slug);
          const existingId = existing?.data?.product?._id;
          if (existingId) {
            await deleteProduct(existingId);
          }
        } catch (e) {
          // If not found by slug, just proceed to remove locally
        }
      }

      // Optimistically remove from UI
      setProductsData(prev => ({
        ...prev,
        products: prev.products.filter((_, index) => index !== productIndex)
      }));

      // Keep related content in sync and reload to reflect DB state
      await syncProductsToHomeAndNavbar();
      await loadData();

      alert('Product removed successfully');
    } catch (err) {
      console.error('Failed to remove product:', err);
      alert(`Failed to remove product: ${err.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const clearAllProducts = () => {
    if (window.confirm('Are you sure you want to clear all products? This action cannot be undone.')) {
      setProductsData({ products: [] });
    }
  };

  // API helper functions
  const saveProduct = async (productData) => {
    if (!productData.category || !['construction', 'coating'].includes(productData.category)) {
      alert('Error: Product category must be either "Construction Solutions" or "Coating and Masterbatch Solutions".');
      throw new Error('Invalid category');
    }
    try {
      // Ensure showInNavbar is included
      const dataToSend = {
        ...productData,
        showInNavbar: productData.showInNavbar !== undefined ? productData.showInNavbar : false
      };
      console.log('Creating product:', productData.name, 'with data:', dataToSend);
      const response = await createProduct(dataToSend);
      console.log('Create response:', response);
      return response;
    } catch (error) {
      console.error('Error in saveProduct:', error);
      throw error;
    }
  };

  const updateProductById = async (productId, productData) => {
    try {
      // Ensure showInNavbar is included
      const dataToSend = {
        ...productData,
        showInNavbar: productData.showInNavbar !== undefined ? productData.showInNavbar : false
      };
      console.log('Updating product:', productId, 'with data:', dataToSend);
      const response = await updateProduct(productId, dataToSend);
      console.log('Update response:', response);
      return response;
    } catch (error) {
      console.error('Error in updateProductById:', error);
      throw error;
    }
  };

  // Function to sync products to home content and navbar
  const syncProductsToHomeAndNavbar = async () => {
    try {
      // Create home products content from current products (exclude coating products)
      const products = productsData.products || [];
      const constructionProducts = products.filter(product => product.category !== 'coating');
      const homeProducts = constructionProducts.map(product => ({
        ProjectLink: `/Products/${product.slug}`,
        ProjectImg: product.image || product.bgImage,
        ProjectTitle: product.name
      }));

      // Update home content
      await upsertContentNext({
        section: 'products',
        pageType: 'home',
        content: { items: homeProducts },
        title: 'Home Products'
      });

      // console.log('✅ Products synced to home content');
      return true;
    } catch (error) {
      console.error('❌ Failed to sync products to home:', error);
      throw error;
    }
  };

  const saveProducts = async () => {
    setSaving(true);
    setMessage("");

    try {
      const products = productsData.products || [];
      

      // console.log('🚀 Starting batch save of', products.length, 'products');

      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        // console.log(`\n📦 Processing product ${i + 1}/${products.length}: ${product.name} (${product.slug})`);

        if (product._id) {
          // console.log(`🔄 Updating existing product: ${product.name}`);
          try {
            await updateProductById(product._id, product);
            // console.log(`✅ Updated product: ${product.name}`);
          } catch (updateError) {
            console.error(`❌ Failed to update product "${product.name}":`, updateError);
            throw updateError;
          }
        } else {
          // No _id: try update by slug if exists, otherwise create
          const normalizedSlug = (product.slug || '').trim();
          if (normalizedSlug) {
            try {
              const existing = await findProductBySlug(normalizedSlug);
              const existingId = existing?.data?.product?._id;
              if (existingId) {
                // console.log(`🔁 Slug exists, updating instead: ${product.name} (${normalizedSlug})`);
                await updateProductById(existingId, product);
                // console.log(`✅ Updated existing product by slug: ${product.name}`);
              } else {
                // console.log(`➕ Creating new product by slug: ${product.name}`);
                await saveProduct(product);
                // console.log(`✅ Created product: ${product.name}`);
              }
            } catch (findOrCreateError) {
              // If find by slug fails, attempt create; if create fails with dup, surface error
              try {
                // console.log(`➕ Creating product after slug lookup failure: ${product.name}`);
                await saveProduct(product);
                // console.log(`✅ Created product: ${product.name}`);
              } catch (createError) {
                console.error(`❌ Failed to create product "${product.name}":`, createError);
                throw createError;
              }
            }
          } else {
            // No slug provided; just create
            try {
              await saveProduct(product);
              // console.log(`✅ Created product: ${product.name}`);
            } catch (createError) {
              console.error(`❌ Failed to create product "${product.name}":`, createError);
              throw createError;
            }
          }
        }
      }

      setMessage('All products saved and synced successfully!');
      alert('All products saved and synced successfully!');
      await loadData(); // Reload the data after saving
    } catch (error) {
      console.error('Error in saveProducts:', error);
      const backendErrors = error.response?.data?.errors 
        ? error.response.data.errors.join('\n') 
        : error.response?.data?.message || error.message || 'Unknown error';
      const errorMessage = `Failed to save products:\n\n${backendErrors}`;
      setMessage(errorMessage);
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const saveIndividualProduct = async (productIndex) => {
    try {
      const products = productsData.products || [];
      const product = products[productIndex];
      
      if (!product) {
        alert('Product not found');
        return;
      }

      // Ensure showInNavbar is included in the product data
      const productToSave = {
        ...product,
        showInNavbar: product.showInNavbar !== undefined ? product.showInNavbar : false
      };
      
      // console.log(`Saving individual product: ${product.name} (${product.slug})`, productToSave);

      if (product._id) {
        // Product has an ID, update it
        // console.log(`Updating existing product: ${product.name}`);
        await updateProductById(product._id, productToSave);
        // console.log(`✅ Updated product: ${product.name}`);
      } else {
        // No _id: just create the product directly
        // Backend will handle slug generation if needed
        // console.log(`Creating new product: ${product.name}`);
        const savedProduct = await saveProduct(productToSave);
        // console.log(`✅ Created new product: ${product.name}`);
      }

      await loadData(); // Reload to get the _id from backend
      
      // Trigger navbar refresh by dispatching a custom event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('refreshNavbar'));
      }
      
      alert(`Product "${product.name}" saved successfully! Please refresh the page to see it in the navbar.`);
    } catch (error) {
      console.error(`❌ Error saving product "${product.name}":`, error);
      const errorMessage = error.response?.data?.errors 
        ? error.response.data.errors.join('\n') 
        : error.response?.data?.message || error.message || 'Unknown error';
      alert(`Failed to save product "${product.name}":\n\n${errorMessage}`);
    }
  };

  if (loading) return <div>Loading...</div>;

  // Ensure products is always an array
  const products = productsData.products || [];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Products Content Management</h1>

      {/* Category Management Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Category Management</h2>
          <button
            onClick={() => setShowCategoryManager(!showCategoryManager)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showCategoryManager ? 'Hide Categories' : 'Manage Categories'}
          </button>
        </div>
        
        {showCategoryManager && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Construction Solutions */}
              <div className="p-4 bg-white rounded border">
                <h3 className="font-semibold text-green-700 mb-2">Construction Solutions</h3>
                <div className="space-y-1">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Construction Solutions</span>
                    <span className="text-xs text-gray-500">construction</span>
                  </div>
                  
                  {/* Display Construction Products */}
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Products ({products.filter(p => p.category === 'construction').length})</h4>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {products.filter(p => p.category === 'construction').length > 0 ? (
                        products.filter(p => p.category === 'construction').map((product, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded text-xs">
                            <span className="text-green-800">{product.name}</span>
                            <span className="text-green-600">{product.isActive ? 'Active' : 'Inactive'}</span>
                          </div>
                        ))
                      ) : (
                        <div className="p-2 bg-gray-100 rounded text-xs text-gray-500">
                          No construction products found
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Coating and Masterbatch Solutions */}
              <div className="p-4 bg-white rounded border">
                <h3 className="font-semibold text-blue-700 mb-2">Coating & Masterbatch Solutions</h3>
                <div className="space-y-1">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Coating and Masterbatch Solutions</span>
                    <span className="text-xs text-gray-500">coating</span>
                  </div>
                  
                  {/* Display Coating Products */}
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Products ({products.filter(p => p.category === 'coating').length})</h4>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {products.filter(p => p.category === 'coating').length > 0 ? (
                        products.filter(p => p.category === 'coating').map((product, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded text-xs">
                            <span className="text-blue-800">{product.name}</span>
                            <div className="flex gap-2">
                              <span className={`${product.showInNavbar ? 'text-green-600' : 'text-gray-500'}`}>
                                {product.showInNavbar ? 'Navbar' : 'No Navbar'}
                              </span>
                              <span className="text-blue-600">{product.isActive ? 'Active' : 'Inactive'}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-2 bg-gray-100 rounded text-xs text-gray-500">
                          No coating products found
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded">
              <strong>Note:</strong> Products with category "construction" will appear under "Construction Solutions" in the navbar. 
              Coating products will appear in the navbar dropdown only if "Show in Navbar" is enabled for that product.
            </div>
          </div>
        )}
      </div>

      <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Products ({products.length})</h2>
            <div className="flex gap-2">
              <button
                onClick={clearAllProducts}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                disabled={saving}
              >
                Clear All Products
              </button>
              <button
                onClick={addProduct}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={saving}
              >
                Add New Product
              </button>
            </div>
          </div>

          {products.map((product, index) => (
            <details key={index} className="border rounded-lg mb-4 bg-white">
              <summary className="px-4 py-3 cursor-pointer font-semibold list-none [&::-webkit-details-marker]:hidden">
                {product.name} ({product.slug})
                <div className="float-right flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      saveIndividualProduct(index);
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={saving}
                  >
                    Save
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeProduct(index);
                    }}
                    className="text-red-600 hover:text-red-800 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={saving}
                  >
                    Remove
                  </button>
                </div>
              </summary>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) => setProductField(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={product.slug}
                        onChange={(e) => setProductField(index, 'slug', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="product-url-slug"
                      />
                      <button
                        type="button"
                        onClick={() => generateSlug(index)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                        disabled={!product.name || !product.name.trim()}
                      >
                        Generate
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={product.category}
                      onChange={(e) => setProductField(index, 'category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option disabled value="">Select Category</option>
                      <option value="construction">Construction Solutions</option>
                      <option value="coating">Coating and Masterbatch Solutions</option>
                    </select>
                  </div>
                  {product.category === 'coating' && (
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={product.showInNavbar || false}
                          onChange={(e) => setProductField(index, 'showInNavbar', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Show in Navbar</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">Enable this to show this product in the coating dropdown menu</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={product.description}
                    onChange={(e) => setProductField(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Extra Line</label>
                  <input
                    type="text"
                    value={product.extraLine}
                    onChange={(e) => setProductField(index, 'extraLine', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Overview</label>
                  <textarea
                    value={product.overview}
                    onChange={(e) => setProductField(index, 'overview', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Logo Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo Images</label>
                  {(product.logoImg || []).map((logo, logoIndex) => (
                    <div key={logoIndex} className="mb-4 p-3 border border-gray-200 rounded-lg">
                      <div className="flex gap-2 mb-2 items-center">
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleLogoImageUpload(e, index, logoIndex)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={uploadingImages[`logo-${index}-${logoIndex}`]}
                          />
                          <button
                            type="button"
                            className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ${
                              uploadingImages[`logo-${index}-${logoIndex}`] ? 'opacity-75 cursor-not-allowed' : ''
                            }`}
                            disabled={uploadingImages[`logo-${index}-${logoIndex}`]}
                          >
                            {uploadingImages[`logo-${index}-${logoIndex}`] ? 'Uploading...' : 'Upload Logo Image'}
                          </button>
                        </div>
                        {logo && (
                          <button
                            type="button"
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded border hover:bg-gray-200"
                            onClick={() => setArrayField(index, 'logoImg', logoIndex, '')}
                          >
                            Clear
                          </button>
                        )}
                        <button
                          onClick={() => removeArrayItem(index, 'logoImg', logoIndex)}
                          className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                          disabled={(product.logoImg || []).length === 1}
                        >
                          Remove
                        </button>
                      </div>
                      {logo && (
                        <div className="mt-2">
                          <img
                            src={logo}
                            alt={`Logo Preview ${logoIndex + 1}`}
                            className="h-24 object-contain rounded-md border"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayItem(index, 'logoImg')}
                    className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Add Logo
                  </button>
                </div>

                {/* Benefits */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
                  {(product.benefits || []).map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => setArrayField(index, 'benefits', benefitIndex, e.target.value)}
                        placeholder="Benefit description"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => removeArrayItem(index, 'benefits', benefitIndex)}
                        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        disabled={(product.benefits || []).length === 1}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayItem(index, 'benefits')}
                    className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Add Benefit
                  </button>
                </div>

                {/* Technical Specs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Technical Specifications</label>
                  {(product.technicalSpecs || []).map((spec, specIndex) => (
                    <div key={specIndex} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                      <input
                        type="text"
                        value={spec.spec}
                        onChange={(e) => setTechnicalSpec(index, specIndex, 'spec', e.target.value)}
                        placeholder="Specification name"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => setTechnicalSpec(index, specIndex, 'value', e.target.value)}
                          placeholder="Specification value"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => removeTechnicalSpec(index, specIndex)}
                          className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                          disabled={(product.technicalSpecs || []).length === 1}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => addTechnicalSpec(index)}
                    className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Add Technical Spec
                  </button>
                </div>

                {/* Applications */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Applications</label>
                  {(product.applications || []).map((application, appIndex) => (
                    <div key={appIndex} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={application}
                        onChange={(e) => setArrayField(index, 'applications', appIndex, e.target.value)}
                        placeholder="Application description"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => removeArrayItem(index, 'applications', appIndex)}
                        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        disabled={(product.applications || []).length === 1}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayItem(index, 'applications')}
                    className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Add Application
                  </button>
                </div>

                {/* Dosage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dosage Guidelines</label>
                  {(product.dosage || []).map((dose, doseIndex) => (
                    <div key={doseIndex} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                      <input
                        type="text"
                        value={dose.application}
                        onChange={(e) => setDosage(index, doseIndex, 'application', e.target.value)}
                        placeholder="Application type"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={dose.dosage}
                          onChange={(e) => setDosage(index, doseIndex, 'dosage', e.target.value)}
                          placeholder="Dosage amount"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => removeDosage(index, doseIndex)}
                          className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                          disabled={(product.dosage || []).length === 1}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => addDosage(index)}
                    className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Add Dosage
                  </button>
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                  <div className="flex gap-2 mb-2 items-center">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleProductImageUpload(e, index)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploadingImages[`product-${index}`]}
                      />
                      <button
                        type="button"
                        className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ${
                          uploadingImages[`product-${index}`] ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                        disabled={uploadingImages[`product-${index}`]}
                      >
                        {uploadingImages[`product-${index}`] ? 'Uploading...' : 'Upload Product Image'}
                      </button>
                    </div>
                    {product.image && (
                      <button
                        type="button"
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded border hover:bg-gray-200"
                        onClick={() => setProductField(index, 'image', '')}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {product.image && (
                    <div className="mt-2">
                      <img
                        src={product.image}
                        alt="Product Preview"
                        className="h-24 object-cover rounded-md border"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Background Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
                  <div className="flex gap-2 mb-2 items-center">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleBgImageUpload(e, index)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploadingImages[`bg-${index}`]}
                      />
                      <button
                        type="button"
                        className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                          uploadingImages[`bg-${index}`] ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                        disabled={uploadingImages[`bg-${index}`]}
                      >
                        {uploadingImages[`bg-${index}`] ? 'Uploading...' : 'Upload Background Image'}
                      </button>
                    </div>
                    {product.bgImage && (
                      <button
                        type="button"
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded border hover:bg-gray-200"
                        onClick={() => setProductField(index, 'bgImage', '')}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {product.bgImage && (
                    <div className="mt-2">
                      <img
                        src={product.bgImage}
                        alt="Background Preview"
                        className="h-24 object-cover rounded-md border"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </details>
          ))}

          <div className="mt-6 flex gap-4">
            <button
              onClick={saveProducts}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {saving ? 'Saving...' : 'Save All Products & Sync'}
            </button>
            <button
              onClick={syncProductsToHomeAndNavbar}
              disabled={saving}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              Sync to Home & Navbar
            </button>
          </div>
        </div>

      {message && (
        <div className={`mt-4 p-4 rounded-md ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
    </div>
  );
}
