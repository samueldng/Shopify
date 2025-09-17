import React from 'react'
import { Link } from 'react-router-dom'
import { Glasses, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto mobile-padding py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-6 lg:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <Glasses className="h-8 w-8 text-blue-400" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Ótica Isis</span>
            </div>
            <p className="text-gray-300 text-base leading-relaxed mobile-text">
              Ótica Isis - Sua visão em primeiro lugar. Especializada em óculos de grau, sol e lentes de contato. 
              Qualidade, estilo e atendimento personalizado para cuidar da sua visão.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200 group">
                <Facebook className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200 group">
                <Instagram className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200 group">
                <Twitter className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mobile-heading">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 text-base mobile-text inline-block">
                  Todos os Produtos
                </Link>
              </li>
              <li>
                <Link to="/products?category=grau" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 text-base mobile-text inline-block">
                  Óculos de Grau
                </Link>
              </li>
              <li>
                <Link to="/products?category=sol" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 text-base mobile-text inline-block">
                  Óculos de Sol
                </Link>
              </li>
              <li>
                <Link to="/products?category=lentes" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 text-base mobile-text inline-block">
                  Lentes de Contato
                </Link>
              </li>
              <li>
                <Link to="/brands" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 text-base mobile-text inline-block">
                  Marcas
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mobile-heading">Atendimento</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 text-base mobile-text inline-block">
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 text-base mobile-text inline-block">
                  Entrega e Frete
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 text-base mobile-text inline-block">
                  Trocas e Devoluções
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 text-base mobile-text inline-block">
                  Guia de Tamanhos
                </Link>
              </li>
              <li>
                <Link to="/warranty" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 text-base mobile-text inline-block">
                  Garantia
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mobile-heading">Contato</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 group">
                <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                </div>
                <div className="text-gray-300 text-base mobile-text">
                  <div>(11) 3456-7890</div>
                  <div className="text-sm text-gray-400">WhatsApp: (11) 99876-5432</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                </div>
                <span className="text-gray-300 text-base mobile-text break-all">contato@oticaisis.com.br</span>
              </div>
              <div className="flex items-start space-x-3 group">
                <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors mt-0.5">
                  <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
                </div>
                <span className="text-gray-300 text-base mobile-text leading-relaxed">
                  Rua Augusta, 1234<br />
                  Consolação - São Paulo/SP<br />
                  CEP: 01305-100
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 mt-12 pt-12">
          <div className="max-w-lg mx-auto text-center">
            <h3 className="text-xl font-semibold mb-3 mobile-heading">Newsletter</h3>
            <p className="text-gray-300 text-base mb-6 mobile-text">
              Receba ofertas exclusivas e novidades em primeira mão
            </p>
            <form className="flex flex-col sm:flex-row gap-3 sm:gap-2">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="flex-1 px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 hover:bg-gray-800 mobile-padding"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
              >
                Inscrever
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            <div className="text-gray-400 text-base mobile-text text-center lg:text-left">
              © 2024 Ótica Isis. Todos os direitos reservados.
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 text-center">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-base mobile-text transition-all duration-200 hover:translate-y-[-1px]">
                Política de Privacidade
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-base mobile-text transition-all duration-200 hover:translate-y-[-1px]">
                Termos de Uso
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white text-base mobile-text transition-all duration-200 hover:translate-y-[-1px]">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}