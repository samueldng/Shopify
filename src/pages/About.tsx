import React from 'react';
import { Eye, Shield, Award, Users, Clock, MapPin } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Sobre a <span className="text-amber-400">Ótica Isis</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Sua visão em primeiro lugar - Tradição, qualidade e atendimento personalizado desde sempre
          </p>
        </div>
      </div>

      {/* Nossa História */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Nossa História
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                A Ótica Isis nasceu com o propósito de oferecer mais do que apenas óculos - oferecemos cuidado personalizado para sua visão. 
                Fundada com valores sólidos de qualidade e atendimento excepcional, nos tornamos referência em produtos ópticos.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Nossa missão é proporcionar a melhor experiência em cuidados visuais, combinando tecnologia de ponta com o atendimento 
                humano e personalizado que nossos clientes merecem.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Award className="h-6 w-6 text-amber-500" />
                  <span className="font-semibold text-gray-900">Qualidade Certificada</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20optical%20store%20interior%20professional%20eyewear%20display%20elegant%20lighting&image_size=landscape_4_3" 
                alt="Interior da Ótica Isis" 
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Nossos Valores */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossos Valores
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Os princípios que guiam nosso trabalho e nosso compromisso com você
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Visão Clara</h3>
              <p className="text-gray-600">
                Oferecemos soluções precisas e personalizadas para cada necessidade visual, 
                garantindo que você veja o mundo com clareza total.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Confiança</h3>
              <p className="text-gray-600">
                Construímos relacionamentos duradouros baseados na confiança, 
                transparência e no compromisso com a satisfação de nossos clientes.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Atendimento Personalizado</h3>
              <p className="text-gray-600">
                Cada cliente é único, por isso oferecemos atendimento individualizado 
                para encontrar a solução perfeita para suas necessidades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nossa Equipe */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossa Equipe
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Profissionais especializados e apaixonados por cuidar da sua visão
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <img 
                src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20optometrist%20woman%20isis%20friendly%20smile%20white%20coat&image_size=square" 
                alt="Isis - Proprietária" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Isis Oliveira</h3>
              <p className="text-blue-600 font-medium mb-3">Proprietária & Optometrista</p>
              <p className="text-gray-600 text-sm">
                Especialista em optometria com mais de 15 anos de experiência, 
                dedicada a oferecer o melhor cuidado visual para cada cliente.
              </p>
            </div>
            
            <div className="text-center">
              <img 
                src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20optical%20technician%20man%20friendly%20glasses%20store&image_size=square" 
                alt="Técnico Óptico" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Carlos Santos</h3>
              <p className="text-blue-600 font-medium mb-3">Técnico Óptico</p>
              <p className="text-gray-600 text-sm">
                Especialista em montagem e ajuste de lentes, garantindo 
                o perfeito encaixe e conforto dos seus óculos.
              </p>
            </div>
            
            <div className="text-center">
              <img 
                src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20optical%20consultant%20woman%20friendly%20modern%20glasses%20store&image_size=square" 
                alt="Consultora" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ana Costa</h3>
              <p className="text-blue-600 font-medium mb-3">Consultora de Estilo</p>
              <p className="text-gray-600 text-sm">
                Especialista em ajudar você a encontrar o modelo perfeito 
                que combina com seu estilo e personalidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Informações Práticas */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Visite Nossa Loja</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Endereço</h3>
                    <p className="text-gray-600">
                      Rua Augusta, 1234<br />
                      Consolação - São Paulo/SP<br />
                      CEP: 01305-100
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Horário de Funcionamento</h3>
                    <div className="text-gray-600 space-y-1">
                      <p>Segunda a Sexta: 9h às 18h</p>
                      <p>Sábado: 9h às 16h</p>
                      <p>Domingo: Fechado</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Por que Escolher a Ótica Isis?</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">Atendimento personalizado e humanizado</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">Produtos de alta qualidade das melhores marcas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">Exames de vista com equipamentos modernos</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">Garantia e suporte pós-venda</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">Localização central e fácil acesso</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">Preços justos e condições especiais</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}