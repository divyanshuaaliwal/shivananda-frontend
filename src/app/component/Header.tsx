"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import logo from "../../../public/images/logo.svg";

// Type definitions for navigation structure
interface NavLink {
  href: string;
  label: string;
  submenu?: SubNavLink[];
}

interface SubNavLink {
  href: string;
  label: string;
  subsubmenu?: SubSubNavLink[];
}

interface SubSubNavLink {
  href: string;
  label: string;
}

// Default navbar structure - will be updated with dynamic products
const defaultNavLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/Aboutus", label: "About Us" },
  {
    href: "#",
    label: "Products",
    submenu: [
      {
        href: "/infrastructure",
        label: "Construction Solutions",
        subsubmenu: [
          // Products will be loaded dynamically
        ],
      },
      {
        href: "/Coating",
        label: "Coating and Masterbatch Solutions",
        subsubmenu: [
          // Products will be loaded dynamically
        ],
      },
      { href: "https://indiapaper.com/", label: "Paper & Packaging" },
    ],
  },
  { href: "/Blog", label: "Knowledge Hub" },
  { href: "/Contact", label: "Contact Us" },
];

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [activeSubSubmenu, setActiveSubSubmenu] = useState<string | null>(null);
  const [navLinks, setNavLinks] = useState<NavLink[]>(defaultNavLinks);

  // Refs for detecting outside clicks
  const buttonRef = useRef<HTMLButtonElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);
  const subButtonRef = useRef<HTMLButtonElement>(null);
  const subSubmenuRef = useRef<HTMLDivElement>(null);
  const submenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Throttle navbar loading to prevent too many requests
  const lastNavbarLoadRef = useRef<number>(0);
  const NAVBAR_LOAD_THROTTLE = 2000; // 2 seconds minimum between loads

  // Load products for navbar dynamically
  const loadProductsForNavbar = async () => {
    const now = Date.now();
    // Throttle: don't load if last load was less than 2 seconds ago
    if (now - lastNavbarLoadRef.current < NAVBAR_LOAD_THROTTLE) {
      return;
    }
    lastNavbarLoadRef.current = now;

    try {
      const timestamp = Date.now();
      // Fetch construction products
      const constructionResponse = await fetch(`/api/products/navbar?t=${timestamp}`, { 
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      // Fetch coating products (only selected ones)
      const coatingResponse = await fetch(`/api/products/coating-navbar?t=${timestamp}`, { 
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      let constructionProducts: Array<{href: string, label: string}> = [];
      let coatingProducts: Array<{href: string, label: string}> = [];

      // Process construction products
      if (constructionResponse.ok) {
        const constructionData = await constructionResponse.json();
        if (constructionData.status === 'success' && constructionData.data && Array.isArray(constructionData.data.products)) {
          constructionProducts = constructionData.data.products;
        }
      }

      // Process coating products
      if (coatingResponse.ok) {
        const coatingData = await coatingResponse.json();
        if (coatingData.status === 'success' && coatingData.data && Array.isArray(coatingData.data.products)) {
          coatingProducts = coatingData.data.products;
        }
      }

      // Update navbar with both construction and coating products
      const updatedNavLinks = defaultNavLinks.map(link => {
        if (link.label === 'Products') {
          return {
            ...link,
            submenu: link.submenu ? link.submenu.map(submenu => {
              if (submenu.label === 'Construction Solutions') {
                return {
                  ...submenu,
                  subsubmenu: constructionProducts,
                };
              } else if (submenu.label === 'Coating and Masterbatch Solutions') {
                return {
                  ...submenu,
                  subsubmenu: coatingProducts,
                };
              }
              return submenu;
            }) : [],
          };
        }
        return link;
      });
      setNavLinks(updatedNavLinks);

    } catch (error) {
      console.error('Failed to load products for navbar:', error);
    }
  };

  useEffect(() => {
    loadProductsForNavbar();
  }, []);

  // Refresh navbar products when window gains focus (useful after admin updates)
  useEffect(() => {
    const handleFocus = () => {
      loadProductsForNavbar();
    };

    const handleRefreshNavbar = () => {
      loadProductsForNavbar();
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('refreshNavbar', handleRefreshNavbar);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('refreshNavbar', handleRefreshNavbar);
    };
  }, []);

  // Hide header/footer on login or dashboard pages
  const hideHeaderFooter = pathname?.includes("login") || pathname?.includes("dashboard");
  if (hideHeaderFooter) return null;

  // Close submenu when clicking outside on desktop
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (window.innerWidth < 768) return;

      const isOutsideMainMenu =
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        (!submenuRef.current || !submenuRef.current.contains(event.target as Node));

      const isOutsideSubMenu =
        (!subButtonRef.current || !subButtonRef.current.contains(event.target as Node)) &&
        (!subSubmenuRef.current || !subSubmenuRef.current.contains(event.target as Node));

      if (isOutsideMainMenu) {
        setActiveSubmenu(null);
        setActiveSubSubmenu(null);
      } else if (isOutsideSubMenu && activeSubSubmenu) {
        setActiveSubSubmenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeSubSubmenu]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false);
    setActiveSubmenu(null);
    setActiveSubSubmenu(null);
  }, [pathname]);

  

  const toggleSubmenu = (label: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (activeSubmenu !== label) {
      setActiveSubSubmenu(null);
    }
    setActiveSubmenu(activeSubmenu === label ? null : label);
  };

  const toggleSubSubmenu = (label: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setActiveSubSubmenu(activeSubSubmenu === label ? null : label);
  };

  const handleSubSubmenuMouseEnter = (label: string) => {
    if (window.innerWidth >= 768 && (label === "Construction Solutions" || label === "Coating and Masterbatch Solutions")) {
      // Close the other dropdown if it's open (mutually exclusive)
      setActiveSubSubmenu(label);
    }
  };

  const handleSubSubmenuMouseLeave = () => {
    // Keep dropdown open when moving to the dropdown itself
    // Only close when leaving the entire submenu area
  };

  const navigateTo = (href: string) => {
    if (href.startsWith('http')) {
      window.open(href, '_blank');
    } else {
      router.push(href);
    }
    setMenuOpen(false);
    setActiveSubmenu(null);
    setActiveSubSubmenu(null);
  };

  

  return (
    <header className="bg-Light shadow-md sticky top-0 z-30">

          {/* Ribbon (dismissible) */}
    
        <div className="w-full bg-primaryColor text-Light text-sm">
          <div className="container mx-auto flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-3">
              <span className="font-semibold">Limited time:</span>
              <span>Get 10% off selected products. </span>
              <Link href="/" className="underline font-medium">
                Learn more
              </Link>
            </div>
            {/* <button
              type="button"
              aria-label="Dismiss announcement"
              onClick={hideRibbon}
              className="p-1 rounded-full hover:bg-primaryColor/20 transition"
            >
              <X size={18} className="pointer-events-none" />
            </button> */}
          </div>
        </div>
  
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-gray-800">
          <Image src={logo} alt="logo" className="w-[60px] h-[60px]" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const isSubmenuOpen = activeSubmenu === link.label;

            return (
              <div key={link.label} className="relative">
                {link.submenu ? (
                  <div className="relative">
                    <button
                      ref={buttonRef}
                      type="button"
                      aria-expanded={isSubmenuOpen}
                      className={`text-Dark hover:text-primaryColor leading-5 md:px-3 lg:px-5 py-2 rounded-full duration-300 font-medium flex items-center gap-1 ${isActive ? "bg-primaryColor !text-Light" : ""}`}
                      onClick={(e) => toggleSubmenu(link.label, e)}
                    >
                      {link.label}
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${isSubmenuOpen ? "rotate-180" : "rotate-0"}`}
                      />
                    </button>

                    {isSubmenuOpen && (
                      <div
                        ref={submenuRef}
                        className="absolute right-0 mt-4 w-34 bg-white rounded-lg shadow-lg py-1 z-10"
                        style={{
                          minWidth: '200px',
                          position: 'absolute',
                          display: 'block',
                          visibility: 'visible',
                          pointerEvents: 'auto',
                        }}
                      >
                        {link.submenu?.map((sub) => {
                          const hasSubSubmenu = sub.subsubmenu && sub.subsubmenu.length > 0;
                          const isSubSubmenuOpen = activeSubSubmenu === sub.label;
                          const isDropdownCategory = sub.label === "Construction Solutions" || sub.label === "Coating and Masterbatch Solutions";

                          return (
                            <div
                              key={sub.href}
                              className="relative"
                              onMouseEnter={() => {
                                // Clear any pending timeout
                                if (submenuTimeoutRef.current) {
                                  clearTimeout(submenuTimeoutRef.current);
                                  submenuTimeoutRef.current = null;
                                }
                                // Open dropdown on hover
                                if (hasSubSubmenu && isDropdownCategory && window.innerWidth >= 768) {
                                  handleSubSubmenuMouseEnter(sub.label);
                                }
                              }}
                              onMouseLeave={() => {
                                // Close dropdown when leaving the submenu item
                                if (window.innerWidth >= 768) {
                                  // Small delay to allow moving to dropdown
                                  submenuTimeoutRef.current = setTimeout(() => {
                                    setActiveSubSubmenu(null);
                                    submenuTimeoutRef.current = null;
                                  }, 200);
                                }
                              }}
                            >
                              {hasSubSubmenu ? (
                                <>
                                  <button
                                    ref={subButtonRef}
                                    type="button"
                                    aria-expanded={isSubSubmenuOpen}
                                    onClick={(e) => {
                                      // if (sub.label === "Coating and Masterbatch Solutions") {
                                        // Navigate to coating page on click
                                        navigateTo(sub.href);
                                      // } else {
                                        // Construction: just toggle dropdown
                                        // e.stopPropagation();
                                        // toggleSubSubmenu(sub.label, e);
                                      // }
                                    }}
                                    className={`w-full text-left flex justify-between items-center px-4 py-2 text-Dark hover:bg-primaryColor hover:text-Light duration-200 font-normal"} ${pathname.startsWith(sub.href) ? "bg-primaryColor/10" : ""}`}
                                  >
                                    <span>{sub.label}</span>
                                    {isDropdownCategory && hasSubSubmenu && (
                                      <ChevronDown
                                        size={16}
                                        className={`transition-transform duration-200 ${isSubSubmenuOpen ? "rotate-180" : "rotate-0"}`}
                                      />
                                    )}
                                  </button>

                                  {isSubSubmenuOpen && sub.subsubmenu && isDropdownCategory && (
                                    <div
                                      ref={subSubmenuRef}
                                      className="absolute left-full top-0 w-64 bg-white rounded-lg shadow-lg py-1 z-50"
                                      onMouseEnter={() => {
                                        // Clear timeout and keep dropdown open when hovering over it
                                        if (submenuTimeoutRef.current) {
                                          clearTimeout(submenuTimeoutRef.current);
                                          submenuTimeoutRef.current = null;
                                        }
                                        if (window.innerWidth >= 768) {
                                          setActiveSubSubmenu(sub.label);
                                        }
                                      }}
                                      onMouseLeave={() => {
                                        // Close dropdown when leaving
                                        if (window.innerWidth >= 768) {
                                          setActiveSubSubmenu(null);
                                        }
                                      }}
                                      style={{
                                        marginLeft: '5px',
                                        minWidth: '200px',
                                        position: 'absolute',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                                        display: 'block',
                                        visibility: 'visible',
                                        pointerEvents: 'auto',
                                      }}
                                    >
                                      {sub.subsubmenu.map((subsub) => (
                                        <button
                                          key={subsub.href}
                                          type="button"
                                          onClick={() => navigateTo(subsub.href)}
                                          className={`w-full text-left block px-4 py-2 text-Dark hover:bg-primaryColor hover:text-Light duration-200 ${pathname === subsub.href ? "bg-primaryColor/10" : ""}`}
                                        >
                                          {subsub.label}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => navigateTo(sub.href)}
                                  className={`w-full text-left block px-4 py-2 text-Dark hover:bg-primaryColor hover:text-Light duration-200 ${isDropdownCategory ? "font-semibold" : "font-normal"} ${pathname === sub.href ? "bg-primaryColor/10" : ""}`}
                                >
                                  {sub.label}
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className={`text-Dark hover:text-primaryColor leading-5 md:px-3 lg:px-5 py-2 rounded-full duration-300 font-medium ${isActive ? "bg-primaryColor !text-Light" : ""}`}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="md:hidden p-2 text-gray-800 hover:text-primaryColor focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 top-[72px] bg-black/50 backdrop-blur-sm z-40" />

          <nav className="fixed top-[72px] left-0 right-0 bg-white shadow-md z-50 max-h-[calc(100vh-72px)] overflow-y-auto">
            <div className="container mx-auto py-4 px-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const isSubmenuOpen = activeSubmenu === link.label;

                return (
                  <div key={link.label} className="mb-2">
                    {link.submenu ? (
                      <>
                        <button
                          type="button"
                          className={`w-full text-left text-Dark hover:text-primaryColor px-4 py-2 rounded-lg font-medium flex items-center justify-between cursor-pointer ${isActive ? "bg-primaryColor/10" : ""}`}
                          onClick={(e) => toggleSubmenu(link.label, e)}
                        >
                          {link.label}
                          <ChevronDown
                            size={18}
                            className={`transition-transform duration-200 ${isSubmenuOpen ? "rotate-180" : "rotate-0"}`}
                          />
                        </button>

                        {isSubmenuOpen && (
                          <div className="mt-1 ml-4 space-y-1">
                            {link.submenu?.map((sub) => {
                              const hasSubSubmenu = sub.subsubmenu && sub.subsubmenu.length > 0;
                              const isSubSubmenuOpen = activeSubSubmenu === sub.label;
                              const isDropdownCategory = sub.label === "Construction Solutions" || sub.label === "Coating and Masterbatch Solutions";

                              return (
                                <div key={sub.href} className="mb-1">
                                  {hasSubSubmenu && isDropdownCategory ? (
                                    <>
                                      <button
                                        type="button"
                                        className={`w-full text-left px-4 py-2 text-Dark hover:bg-primaryColor hover:text-Light duration-200 rounded-lg flex items-center justify-between ${isDropdownCategory ? "font-semibold" : "font-normal"} ${pathname.startsWith(sub.href) ? "bg-primaryColor/10" : ""}`}
                                        onClick={(e) => {
                                          if (sub.label === "Coating and Masterbatch Solutions") {
                                            // Navigate to coating page on click
                                            navigateTo(sub.href);
                                          } else {
                                            // Construction: just toggle dropdown
                                            toggleSubSubmenu(sub.label, e);
                                          }
                                        }}
                                      >
                                        <span>{sub.label}</span>
                                        {hasSubSubmenu && (
                                          <ChevronDown
                                            size={16}
                                            className={`transition-transform duration-200 ${isSubSubmenuOpen ? "rotate-180" : "rotate-0"}`}
                                          />
                                        )}
                                      </button>

                                      {isSubSubmenuOpen && sub.subsubmenu && (
                                        <div className="mt-1 ml-4 space-y-1">
                                          {sub.subsubmenu.map((subsub) => (
                                            <button
                                              type="button"
                                              key={subsub.href}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                navigateTo(subsub.href);
                                              }}
                                              className={`w-full text-left block px-4 py-2 text-Dark hover:bg-primaryColor hover:text-Light duration-200 rounded-lg ${pathname === subsub.href ? "bg-primaryColor/10" : ""}`}
                                            >
                                              {subsub.label}
                                            </button>
                                          ))}
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => navigateTo(sub.href)}
                                      className={`w-full text-left block px-4 py-2 text-Dark hover:bg-primaryColor hover:text-Light duration-200 rounded-lg ${isDropdownCategory ? "font-semibold" : "font-normal"} ${pathname === sub.href ? "bg-primaryColor/10" : ""}`}
                                    >
                                      {sub.label}
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => navigateTo(link.href)}
                        className={`w-full text-left block text-Dark hover:text-primaryColor px-4 py-2 rounded-lg font-medium cursor-pointer ${isActive ? "bg-primaryColor !text-Light" : ""}`}
                      >
                        {link.label}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>
        </>
      )}
    </header>
  );
};

export default Header;
