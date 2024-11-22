import React from 'react';
import Link from 'next/link';
import { Sun, Battery, MapPin, ArrowRight, Phone } from 'lucide-react';

const HomePage = () => {
  return (
    <div className=" min-h-screen bg-gradient-to-b from-blue-50 to-white">

      <section id='intro'>
        <div>
          <h1>
            Energia Solar para Todos
          </h1>
          <p>
            Transformando espaços públicos com pontos de carregamento solar para seus dispositivos móveis
          </p>
        </div>
        <button>
          <Link href='/mapa'>
            Pontos de Carregamento
          </Link>
          <ArrowRight className="ml-2" />
        </button>
      </section>

      {/* Benefícios */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-aut wrapper">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
            Benefícios da Energia Solar Pública
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex flex-col items-center">
                <Sun className="w-12 h-12 text-yellow-500 mb-4" />
                <h3 className="text-xl font-semibold mb-4">Energia Limpa</h3>
                <p className="text-gray-600 text-center">
                  100% sustentável e renovável, contribuindo para um futuro mais limpo
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex flex-col items-center">
                <Battery className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold mb-4">Sempre Carregado</h3>
                <p className="text-gray-600 text-center">
                  Mantenha seus dispositivos sempre carregados em locais públicos
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex flex-col items-center">
                <MapPin className="w-12 h-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-4">Fácil Acesso</h3>
                <p className="text-gray-600 text-center">
                  Pontos de carregamento estrategicamente localizados pela cidade
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-900 text-white py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center wrapper">
          <h2 className="text-3xl font-bold mb-6">
            Quer um ponto de carregamento no seu estabelecimento?
          </h2>
          <p className="text-xl mb-8">
            Junte-se à nossa rede de parceiros e ofereça energia solar gratuita para seus clientes
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href='/cadastro-parceiro'>
              <button className="inline-flex items-center bg-white text-blue-900 hover:bg-gray-100 px-6 py-3 rounded-md font-medium transition-colors duration-200">
                Seja um Parceiro
              </button>
            </Link>
            <button className="inline-flex items-center border-2 border-white text-white hover:bg-blue-800 px-6 py-3 rounded-md font-medium transition-colors duration-200">
              <Phone className="mr-2" />
              Fale Conosco
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;