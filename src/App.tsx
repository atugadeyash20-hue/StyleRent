import React, { useState, useEffect } from 'react';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  SAMPLE_REVIEWS 
} from './data/mockData';
import { 
  Product, 
  Order, 
  Review, 
  CartItem, 
  Category, 
  Occasion, 
  Gender, 
  Size,
  FittingOption,
  CustomMeasurements,
  RentalDuration,
  UserMembership,
  MembershipPlan
} from './types';
import { calculateRentalDates, getProductRentalFee } from './utils/rentalCalculations';

// Components
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { AdminDashboard } from './components/AdminDashboard';
import { DeliveryTrackerModal } from './components/DeliveryTrackerModal';
import { MembershipModal } from './components/MembershipModal';
import { HowItWorksSection } from './components/HowItWorksSection';
import { ReviewsSection } from './components/ReviewsSection';
import { WishlistDrawer } from './components/WishlistDrawer';
import { Footer } from './components/Footer';
import { ShareModal } from './components/ShareModal';

import { 
  SlidersHorizontal, 
  RotateCcw, 
  Filter, 
  Search, 
  X, 
  Check, 
  Sparkles,
  ShoppingBag,
  Heart,
  Briefcase,
  Shirt,
  ArrowRight
} from 'lucide-react';

export default function App() {
  // State: Products (using v7 cache key to ensure updated image paths and price ranges load immediately)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('style_rent_products_v7');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(p => p.id === 'SR-M01' && p.images[0]?.startsWith('/assets/'))) {
          return parsed;
        }
      } catch (e) { /* fallback */ }
    }
    return INITIAL_PRODUCTS;
  });

  // State: Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('style_rent_orders_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_ORDERS;
  });

  // State: Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('style_rent_reviews_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return SAMPLE_REVIEWS;
  });

  // State: Cart Items
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('style_rent_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [];
  });

  // State: Wishlist Product IDs
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('style_rent_wishlist');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return ['SR-M01', 'SR-F01', 'SR-C01'];
  });

  // State: User Membership (StylePass Royalty Club)
  const [userMembership, setUserMembership] = useState<UserMembership | null>(() => {
    const saved = localStorage.getItem('style_rent_membership_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return null;
  });

  // UI Modals and Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isMembershipOpen, setIsMembershipOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState<'all' | 'men' | 'women'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<'all' | 'under1000' | '1000to1300' | 'above1300'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'priceAsc' | 'priceDesc' | 'rating'>('popular');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('style_rent_products_v7', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('style_rent_orders_v2', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('style_rent_reviews_v2', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('style_rent_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('style_rent_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    if (userMembership) {
      localStorage.setItem('style_rent_membership_v1', JSON.stringify(userMembership));
    } else {
      localStorage.removeItem('style_rent_membership_v1');
    }
  }, [userMembership]);

  // Deep-link support: open product or share modal from URL hash
  useEffect(() => {
    const handleHash = () => {
      try {
        const hash = window.location.hash;
        if (hash.startsWith('#product-')) {
          const prodId = hash.replace('#product-', '');
          const matched = products.find(p => p.id === prodId);
          if (matched) {
            setSelectedProduct(matched);
          }
        } else if (hash === '#share') {
          setIsShareOpen(true);
        }
      } catch (e) {
        // Safe fallback in cross-origin / iframe environments
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [products]);

  // Quick navigation helper
  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Quick category switch helper
  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    handleNavigateSection('shop');
  };

  // Toggle Wishlist
  const handleToggleWishlist = (productId: string) => {
    setWishlistIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Add Item to Cart
  const handleAddToCart = (config: {
    product: Product;
    selectedSize: Size;
    fittingOption: FittingOption;
    customMeasurements?: CustomMeasurements;
    rentalDuration: RentalDuration;
    startDate: string;
    hasBackupSize: boolean;
    backupSize?: Size;
    backupFee: number;
    hasDamageProtection: boolean;
    protectionFee: number;
  }) => {
    const { deliveryDate, returnDate } = calculateRentalDates(config.startDate, config.rentalDuration);
    
    const rentalFee = getProductRentalFee(config.product, config.rentalDuration);

    const newCartItem: CartItem = {
      cartItemId: `CART-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      product: config.product,
      selectedSize: config.selectedSize,
      fittingOption: config.fittingOption,
      customMeasurements: config.customMeasurements,
      rentalDuration: config.rentalDuration,
      startDate: config.startDate,
      endDate: returnDate,
      deliveryDate,
      returnDate,
      rentalFee,
      securityDeposit: config.product.securityDeposit,
      hasBackupSize: config.hasBackupSize,
      backupSize: config.backupSize,
      backupFee: config.backupFee,
      hasDamageProtection: config.hasDamageProtection,
      protectionFee: config.protectionFee,
      quantity: 1,
    };

    setCartItems(prev => [newCartItem, ...prev]);
  };

  // Membership Handlers
  const handleActivateMembership = (plan: MembershipPlan) => {
    const expiresDate = new Date();
    expiresDate.setFullYear(expiresDate.getFullYear() + 1);

    setUserMembership({
      isActive: true,
      planId: plan.id,
      planName: plan.name,
      tier: plan.tier,
      startedAt: new Date().toISOString(),
      expiresAt: expiresDate.toISOString(),
      totalSavedAmount: 3200,
      rentalsCompleted: 0,
    });
  };

  const handleCancelMembership = () => {
    setUserMembership(null);
  };

  // Remove Item from Cart
  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  // Toggle Cart Item Damage Protection
  const handleToggleCartItemProtection = (cartItemId: string) => {
    setCartItems(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        return {
          ...item,
          hasDamageProtection: !item.hasDamageProtection,
          protectionFee: !item.hasDamageProtection ? 299 : 0,
        };
      }
      return item;
    }));
  };

  // Toggle Cart Item Backup Size
  const handleToggleCartItemBackup = (cartItemId: string) => {
    setCartItems(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        return {
          ...item,
          hasBackupSize: !item.hasBackupSize,
          backupFee: !item.hasBackupSize ? 399 : 0,
        };
      }
      return item;
    }));
  };

  // Complete Order
  const handleOrderCompleted = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);

    setProducts(prevProducts => {
      return prevProducts.map(prod => {
        const matchingCartItem = newOrder.items.find(i => i.product.id === prod.id);
        if (matchingCartItem) {
          const { returnDate, bufferStart, bufferEnd } = calculateRentalDates(
            matchingCartItem.startDate, 
            matchingCartItem.rentalDuration
          );

          const newBooking = {
            id: `BKG-${Date.now()}`,
            startDate: matchingCartItem.startDate,
            endDate: returnDate,
            bufferStart,
            bufferEnd,
            orderId: newOrder.orderId,
          };

          return {
            ...prod,
            bookings: [...prod.bookings, newBooking],
          };
        }
        return prod;
      });
    });

    setCartItems([]);
    setIsCheckoutOpen(false);
    setConfirmedOrder(newOrder);
    setTrackedOrder(newOrder);
  };

  // Admin: Update order status
  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o));
  };

  // Admin: Update product operational status
  const handleUpdateProductStatus = (productId: string, newStatus: Product['status']) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, status: newStatus } : p));
  };

  // Admin: Process return inspection
  const handleProcessInspection = (orderId: string, inspection: NonNullable<Order['returnInspection']>) => {
    setOrders(prev => prev.map(o => {
      if (o.orderId === orderId) {
        return {
          ...o,
          status: 'Completed',
          returnInspection: inspection,
        };
      }
      return o;
    }));
  };

  // Add Review
  const handleAddReview = (newReview: Review) => {
    setReviews(prev => [newReview, ...prev]);
  };

  // Filtered & Sorted products
  const filteredProducts = products.filter(product => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchBrand = product.designerOrBrand.toLowerCase().includes(q);
      const matchCategory = product.category.toLowerCase().includes(q);
      const matchOccasion = product.occasions.some(o => o.toLowerCase().includes(q));
      const matchColor = product.color.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchCategory && !matchOccasion && !matchColor) {
        return false;
      }
    }

    // Gender
    if (selectedGender !== 'all' && product.gender !== selectedGender) {
      return false;
    }

    // Category
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }

    // Occasion
    if (selectedOccasion !== 'all' && !product.occasions.includes(selectedOccasion as Occasion)) {
      return false;
    }

    // Size
    if (selectedSize !== 'all' && !product.availableSizes.includes(selectedSize as Size)) {
      return false;
    }

    // Price range
    if (priceRange === 'under1000' && product.rentalPrice3Days >= 1000) {
      return false;
    }
    if (priceRange === '1000to1300' && (product.rentalPrice3Days < 1000 || product.rentalPrice3Days > 1300)) {
      return false;
    }
    if (priceRange === 'above1300' && product.rentalPrice3Days <= 1300) {
      return false;
    }

    // Availability
    if (onlyAvailable && product.status !== 'Available') {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'priceAsc') return a.rentalPrice3Days - b.rentalPrice3Days;
    if (sortBy === 'priceDesc') return b.rentalPrice3Days - a.rentalPrice3Days;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.reviewCount || 0) - (a.reviewCount || 0); // popular default
  });

  // Calculate cart totals
  const cartTotalAmount = cartItems.reduce((acc, item) => {
    const backup = item.hasBackupSize ? item.backupFee : 0;
    const protect = item.hasDamageProtection ? item.protectionFee : 0;
    return acc + item.rentalFee + item.securityDeposit + backup + protect;
  }, 0);

  const wishlistedProducts = products.filter(p => wishlistIds.includes(p.id));

  // Category and Occasion options
  const occasionList = [
    'All',
    'Job Interview / Boardroom',
    'Corporate Gala',
    'Stage / Theatrical / Play',
    'Mythological / Janmashtami',
    'Casual Party / Date Night',
    'College Function',
    'Wedding',
    'Sangeet',
    'Haldi',
    'Cocktail Party',
    'Festivities'
  ];

  const categoryList = [
    'All',
    'Formals',
    'Costumes',
    'Casuals',
    'Sherwanis',
    'Suits',
    'Blazers',
    'Lehengas',
    'Sarees',
    'Kurta Sets'
  ];

  // Specific highlighted groups for quick showcase sections
  const formalProducts = products.filter(p => p.category === 'Formals' || p.category === 'Blazers');
  const costumeProducts = products.filter(p => p.category === 'Costumes');
  const casualProducts = products.filter(p => p.category === 'Casuals');

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans">
      {/* Navbar */}
      <Navbar
        cartCount={cartItems.length}
        cartTotal={cartTotalAmount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenMembership={() => setIsMembershipOpen(true)}
        onOpenTracking={() => {
          setTrackedOrder(orders[0] || null);
          setIsTrackerOpen(true);
        }}
        userMembership={userMembership}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNavigateSection={handleNavigateSection}
        onFilterCategory={handleSelectCategory}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <div id="hero">
          <HeroSection
            onExploreClick={() => handleNavigateSection('shop')}
            onHowItWorksClick={() => handleNavigateSection('how-it-works')}
            onSelectCategory={handleSelectCategory}
            onOpenShare={() => setIsShareOpen(true)}
          />
        </div>

        {/* Department Quick-Jump Banner */}
        <section className="bg-white border-b border-stone-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
              <span className="text-stone-400 font-semibold uppercase tracking-wider shrink-0 mr-1 text-[11px]">
                Popular Departments:
              </span>
              <button
                onClick={() => handleSelectCategory('Formals')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === 'Formals'
                    ? 'bg-[#53101E] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                }`}
              >
                👔 Executive Formals & Power Suits
              </button>
              <button
                onClick={() => handleSelectCategory('Costumes')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === 'Costumes'
                    ? 'bg-[#53101E] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                }`}
              >
                🎭 Theatrical & Mythological Costumes
              </button>
              <button
                onClick={() => handleSelectCategory('Casuals')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === 'Casuals'
                    ? 'bg-[#53101E] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                }`}
              >
                ✨ Smart Casuals & Linen Sets
              </button>
              <button
                onClick={() => handleSelectCategory('Sherwanis')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === 'Sherwanis'
                    ? 'bg-[#53101E] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                }`}
              >
                👑 Royal Sherwanis & Dhoti Sets
              </button>
              <button
                onClick={() => handleSelectCategory('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#53101E] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                }`}
              >
                View All Outfits
              </button>
            </div>
          </div>
        </section>

        {/* DEDICATED SECTION 1: EXECUTIVE FORMALS & POWER SUITS */}
        <section className="py-12 bg-[#FAF7F2] border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#53101E]/10 text-[#53101E] text-xs font-semibold mb-2">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Executive & Red Carpet Collection</span>
                </div>
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-stone-900">
                  Formals, Pinstripes & Power Suits
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
                  Tailored double-breasted Italian wool suits, aesthetic oversized college blazers, espresso brown wool ensembles, and minimalist taupe executive suits.
                </p>
              </div>

              <button
                onClick={() => handleSelectCategory('Formals')}
                className="text-xs font-bold text-[#53101E] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All Formals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {formalProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* DEDICATED SECTION 2: THEATRICAL & MYTHOLOGICAL COSTUMES */}
        <section className="py-12 bg-white border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#C69947]" />
                  <span>Theatrical, Drama & Cultural Events</span>
                </div>
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-stone-900">
                  Costumes & Character Outfits
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
                  Lord Krishna divine stage set with peacock feather & zari pitambar, temple pearl necklace, and metallic gold armlets.
                </p>
              </div>

              <button
                onClick={() => handleSelectCategory('Costumes')}
                className="text-xs font-bold text-[#53101E] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All Costumes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {costumeProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* DEDICATED SECTION 3: SMART CASUALS & RESORT WEAR */}
        <section className="py-12 bg-[#FAF7F2] border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold mb-2">
                  <Shirt className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Brunch, Sundowner & Destination Wear</span>
                </div>
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-stone-900">
                  Smart Casuals & Resort Fits
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
                  Pure French flax linen resort sets, relaxed camp collars, and breezy coordinates for destination celebrations and casual parties.
                </p>
              </div>

              <button
                onClick={() => handleSelectCategory('Casuals')}
                className="text-xs font-bold text-[#53101E] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All Casuals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {casualProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* MAIN SHOP / CATALOG SECTION */}
        <section id="shop" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Shop Section Header */}
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200/80 pb-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C69947]">
                Complete Wardrobe On Demand
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                Browse All Outfits & Costumes
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Showing {filteredProducts.length} designer outfits ready for rental with hospital-grade sanitization.
              </p>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3 text-xs">
              <label className="text-stone-500 font-medium hidden sm:inline">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white px-3 py-1.5 border border-stone-300 rounded-full text-xs font-semibold text-stone-800 focus:outline-none focus:border-[#53101E] cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="priceAsc">Rental Price: Low to High</option>
                <option value="priceDesc">Rental Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            
            {/* Row 1: Gender Segmented Control, Budget, Size */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Gender Segmented Control */}
              <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl">
                <button
                  onClick={() => setSelectedGender('all')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors cursor-pointer ${
                    selectedGender === 'all'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  All Outfits
                </button>
                <button
                  onClick={() => setSelectedGender('men')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg capitalize transition-colors cursor-pointer ${
                    selectedGender === 'men'
                      ? 'bg-[#53101E] text-white shadow-xs'
                      : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  👔 Men's Collection
                </button>
                <button
                  onClick={() => setSelectedGender('women')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors cursor-pointer ${
                    selectedGender === 'women'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  💃 Women's Collection
                </button>
              </div>

              {/* Price Filter dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 font-medium">Rental Budget:</span>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value as any)}
                  className="bg-stone-50 px-3 py-1 text-xs border border-stone-200 rounded-lg text-stone-800 focus:outline-none cursor-pointer"
                >
                  <option value="all">Any Price</option>
                  <option value="under1000">Under ₹1,000 / 3D</option>
                  <option value="1000to1300">₹1,000 – ₹1,300 / 3D</option>
                  <option value="above1300">Above ₹1,300 / 3D</option>
                </select>
              </div>

              {/* Size Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 font-medium">Size:</span>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="bg-stone-50 px-3 py-1 text-xs border border-stone-200 rounded-lg text-stone-800 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Sizes</option>
                  {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Clear all filters */}
              {(selectedCategory !== 'all' || selectedOccasion !== 'all' || selectedGender !== 'all' || selectedSize !== 'all' || priceRange !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedOccasion('all');
                    setSelectedGender('all');
                    setSelectedSize('all');
                    setPriceRange('all');
                    setSearchQuery('');
                  }}
                  className="text-xs text-red-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            {/* Row 2: Categories horizontal chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs pt-1 border-t border-stone-100">
              <span className="text-stone-400 font-medium text-[11px] shrink-0 mr-1">Categories:</span>
              {categoryList.map((cat) => {
                const isSelected = selectedCategory === (cat === 'All' ? 'all' : cat);
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat === 'All' ? 'all' : cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#53101E] text-white shadow-2xs font-semibold'
                        : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {cat === 'Formals' ? '👔 Formals' : cat === 'Costumes' ? '🎭 Costumes' : cat === 'Casuals' ? '✨ Casuals' : cat}
                  </button>
                );
              })}
            </div>

            {/* Row 3: Occasions chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs pt-1 border-t border-stone-100">
              <span className="text-stone-400 font-medium text-[11px] shrink-0 mr-1">Occasion:</span>
              {occasionList.map((occ) => {
                const isSelected = selectedOccasion === (occ === 'All' ? 'all' : occ);
                return (
                  <button
                    key={occ}
                    onClick={() => setSelectedOccasion(occ === 'All' ? 'all' : occ)}
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-stone-800 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {occ}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-stone-200 p-8">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-stone-800 text-base">No matching outfits found</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try widening your filters or clearing your search query.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedOccasion('all');
                  setSelectedGender('all');
                  setSelectedSize('all');
                  setPriceRange('all');
                  setSearchQuery('');
                }}
                className="mt-2 px-5 py-2 text-xs font-semibold rounded-full bg-[#53101E] text-white hover:bg-[#3B0913] cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          )}
        </section>

        {/* How It Works & Hygiene Section */}
        <HowItWorksSection />

        {/* Reviews Section */}
        <ReviewsSection 
          reviews={reviews}
          onAddReview={handleAddReview}
        />
      </main>

      {/* Footer */}
      <Footer 
        onNavigateSection={handleNavigateSection}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenMembership={() => setIsMembershipOpen(true)}
        onOpenTracking={() => {
          setTrackedOrder(orders[0] || null);
          setIsTrackerOpen(true);
        }}
        onFilterCategory={handleSelectCategory}
      />

      {/* MODALS & DRAWERS */}

      {/* 1. Product Details Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          isWishlisted={wishlistIds.includes(selectedProduct.id)}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

      {/* 2. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        userMembership={userMembership}
        onRemoveItem={handleRemoveCartItem}
        onToggleProtection={handleToggleCartItemProtection}
        onToggleBackup={handleToggleCartItemBackup}
        onProceedCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onOpenMembership={() => {
          setIsCartOpen(false);
          setIsMembershipOpen(true);
        }}
      />

      {/* 3. Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistedProducts={wishlistedProducts}
        onRemoveWishlist={handleToggleWishlist}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* 4. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        userMembership={userMembership}
        onOrderCompleted={handleOrderCompleted}
        onOpenMembership={() => setIsMembershipOpen(true)}
      />

      {/* 5. Order Confirmation Modal */}
      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onOpenAdmin={() => {
          setConfirmedOrder(null);
          setIsAdminOpen(true);
        }}
        onOpenTracking={() => {
          setTrackedOrder(confirmedOrder);
          setIsTrackerOpen(true);
        }}
      />

      {/* 6. Admin / Staff Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        orders={orders}
        products={products}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onUpdateProductStatus={handleUpdateProductStatus}
        onProcessInspection={handleProcessInspection}
        onOpenTrackingWithOrder={(order) => {
          setTrackedOrder(order);
          setIsTrackerOpen(true);
        }}
      />

      {/* 7. Live Delivery & GPS Tracking Modal */}
      <DeliveryTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        order={trackedOrder || confirmedOrder || orders[0] || null}
        allOrders={orders}
        onSelectOrder={(ord) => setTrackedOrder(ord)}
      />

      {/* 8. StylePass Royalty Club Membership Modal */}
      <MembershipModal
        isOpen={isMembershipOpen}
        onClose={() => setIsMembershipOpen(false)}
        userMembership={userMembership}
        onActivatePlan={handleActivateMembership}
        onCancelMembership={handleCancelMembership}
      />

      {/* 9. Share & Public Access Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
}
