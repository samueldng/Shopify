import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Search, Menu, X, Glasses, Heart, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'
import CartPopup from './CartPopup'

export default function Header() {
  const { user, signOut } = useAuth()
  const { totalItems } = useCart()
  const { wishlistCount } = useWishlist()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()



  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleSignOut = async () => {
    await signOut()
    setIsUserMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 container-mobile">
        <div className="flex items-center justify-between h-16 lg:h-20 nav-mobile">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Glasses className="h-8 w-8 lg:h-10 lg:w-10 text-blue-600 transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-blue-600/20 rounded-full scale-0 group-hover:scale-125 transition-transform duration-300"></div>
              </div>
              <span className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">
                Ótica Isis
              </span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl leading-5 bg-white/80 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all duration-200 hover:bg-white input-mobile"
                  placeholder="Buscar óculos..."
                />
              </div>
            </form>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              to="/products"
              className="text-luxury hover:text-accent px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-luxury-light relative group"
            >
              Produtos
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-accent transition-all duration-200 group-hover:w-full group-hover:left-0"></span>
            </Link>
            <Link
              to="/categories"
              className="text-luxury hover:text-accent px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-luxury-light relative group"
            >
              Categorias
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-accent transition-all duration-200 group-hover:w-full group-hover:left-0"></span>
            </Link>
            <Link
              to="/brands"
              className="text-luxury hover:text-accent px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-luxury-light relative group"
            >
              Marcas
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-accent transition-all duration-200 group-hover:w-full group-hover:left-0"></span>
            </Link>
            <Link
              to="/about"
              className="text-luxury hover:text-accent px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-luxury-light relative group"
            >
              Sobre
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-accent transition-all duration-200 group-hover:w-full group-hover:left-0"></span>
            </Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2 lg:space-x-3 nav-icons-mobile">
            {/* Wishlist */}
            {user && (
              <Link
                to="/wishlist"
                className="text-gray-700 hover:text-blue-600 p-2 lg:p-3 relative transition-all duration-200 rounded-lg hover:bg-blue-50 group icon-mobile"
              >
                <Heart className="h-5 w-5 lg:h-6 lg:w-6 group-hover:scale-110 transition-transform" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-gray-700 hover:text-blue-600 p-2 lg:p-3 relative transition-all duration-200 rounded-lg hover:bg-blue-50 group icon-mobile"
            >
              <ShoppingCart className="h-5 w-5 lg:h-6 lg:w-6 group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center text-gray-700 hover:text-blue-600 p-2 transition-colors"
                  >
                    <User className="h-6 w-6" />
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-xl py-2 z-50 border border-gray-200 animate-scale-in">
                      <Link
                        to="/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Minha Conta
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Meus Pedidos
                      </Link>
                      <Link
                        to="/wishlist"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Lista de Desejos
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <LogOut className="h-4 w-4 mr-2" />
                          Sair
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="btn-outline text-sm px-3 py-2"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary text-sm px-4 py-2"
                  >
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-700 hover:text-blue-600 p-2 transition-all duration-200 rounded-lg hover:bg-blue-50"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 transition-transform duration-200 rotate-90" />
              ) : (
                <Menu className="h-6 w-6 transition-transform duration-200" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md animate-fade-in-up">
            {/* Mobile Search */}
            <div className="px-4 py-4">
              <form onSubmit={handleSearch}>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-primary block w-full pl-10 pr-4 py-3 text-base mobile-padding"
                    placeholder="Buscar óculos..."
                  />
                </div>
              </form>
            </div>

            {/* Mobile Navigation */}
            <nav className="px-4 space-y-2 mobile-spacing">
              <Link
                to="/products"
                className="flex items-center px-4 py-3 text-base font-medium text-luxury hover:text-accent hover:bg-luxury-light rounded-xl transition-all duration-200 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="group-hover:translate-x-1 transition-transform duration-200">Produtos</span>
              </Link>
              <Link
                to="/categories"
                className="flex items-center px-4 py-3 text-base font-medium text-luxury hover:text-accent hover:bg-luxury-light rounded-xl transition-all duration-200 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="group-hover:translate-x-1 transition-transform duration-200">Categorias</span>
              </Link>
              <Link
                to="/brands"
                className="flex items-center px-4 py-3 text-base font-medium text-luxury hover:text-accent hover:bg-luxury-light rounded-xl transition-all duration-200 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="group-hover:translate-x-1 transition-transform duration-200">Marcas</span>
              </Link>
              <Link
                to="/about"
                className="flex items-center px-4 py-3 text-base font-medium text-luxury hover:text-accent hover:bg-luxury-light rounded-xl transition-all duration-200 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="group-hover:translate-x-1 transition-transform duration-200">Sobre</span>
              </Link>
              
              {user && (
                <>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <Link
                      to="/account"
                      className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                      <span className="group-hover:translate-x-1 transition-transform duration-200">Minha Conta</span>
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ShoppingCart className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                      <span className="group-hover:translate-x-1 transition-transform duration-200">Meus Pedidos</span>
                    </Link>
                    <Link
                      to="/wishlist"
                      className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Heart className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                      <span className="group-hover:translate-x-1 transition-transform duration-200">Lista de Desejos</span>
                    </Link>
                  </div>
                </>
              )}
            </nav>

            {/* Mobile Auth Buttons */}
            {!user && (
              <div className="px-4 pt-4 border-t border-gray-200 space-y-3 mobile-spacing">
                <Link
                  to="/login"
                  className="btn-outline block w-full text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="btn-primary block w-full text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cadastrar
                </Link>
              </div>
            )}

            {user && (
              <div className="px-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleSignOut()
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center w-full px-4 py-3 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                >
                  <LogOut className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Sair</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cart Popup */}
      <CartPopup isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  )
}