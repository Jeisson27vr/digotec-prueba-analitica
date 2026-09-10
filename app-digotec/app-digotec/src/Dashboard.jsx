import React, { useState, useMemo } from 'react';
import { LogOut, Users, CreditCard, PieChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PowerBIEmbed from './PowerBIEmbed';
import mockData from './datos_react.json';

const Dashboard = () => {
  const navigate = useNavigate();

  // Estados para los filtros (Cumple requisito: 3 dimensiones de filtro)
  const [filterSegment, setFilterSegment] = useState('');
  const [filterLover, setFilterLover] = useState('');
  const [filterCity, setFilterCity] = useState('');

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  // Filtrado reactivo de datos
  const filteredData = useMemo(() => {
    return mockData.filter(client => {
      const matchSegment = filterSegment === '' || client.segmento_cliente === filterSegment;
      const matchLover = filterLover === '' || client.segmento_conductual === filterLover;
      const matchCity = filterCity === '' || client.ciudad === filterCity;
      return matchSegment && matchLover && matchCity;
    });
  }, [filterSegment, filterLover, filterCity]);

  // Cálculos de KPIs basados en la data filtrada (Cumple requisito: KPIs básicos)
  const totalClients = filteredData.length;
  const totalBalance = filteredData.reduce((acc, curr) => acc + (curr.total_saldo || 0), 0);
  const totalConsumption = filteredData.reduce((acc, curr) => acc + (curr.consumo_total || 0), 0);

  // Formateador de moneda
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar Superior */}
      <nav className="bg-blue-700 p-4 text-white shadow-md flex justify-between items-center">
        <div className="text-xl font-bold">Ventura Analytics Hub</div>
        <button onClick={handleLogout} className="flex items-center space-x-2 rounded-md hover:bg-blue-600 px-3 py-1 transition">
          <LogOut size={18} />
          <span>Salir</span>
        </button>
      </nav>

      <main className="mx-auto max-w-7xl p-6">

        {/* Sección de KPIs */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm flex items-center space-x-4 border-l-4 border-blue-500">
            <div className="rounded-full bg-blue-100 p-3"><Users className="text-blue-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Clientes Filtrados</p>
              <p className="text-2xl font-bold text-gray-800">{totalClients}</p>
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm flex items-center space-x-4 border-l-4 border-green-500">
            <div className="rounded-full bg-green-100 p-3"><CreditCard className="text-green-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Saldo Total</p>
              <p className="text-2xl font-bold text-gray-800">{formatMoney(totalBalance)}</p>
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm flex items-center space-x-4 border-l-4 border-purple-500">
            <div className="rounded-full bg-purple-100 p-3"><PieChart className="text-purple-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Consumo Total</p>
              <p className="text-2xl font-bold text-gray-800">{formatMoney(totalConsumption)}</p>
            </div>
          </div>
        </div>

        {/* Zona del Dashboard de Power BI Embebido */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Reporte Ejecutivo (Power BI)</h2>
          <PowerBIEmbed />
        </div>

        {/* Zona de Tabla de Datos y Filtros */}
        <div className="rounded-lg bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Directorio de Clientes</h2>

            {/* Filtros */}
            <div className="flex space-x-2 w-full md:w-auto">
              <select className="border border-gray-300 rounded-md p-2 text-sm" value={filterSegment} onChange={(e) => setFilterSegment(e.target.value)}>
                <option value="">Todos los Segmentos</option>
                <option value="VIP">VIP</option>
                <option value="Mass">Mass</option>
                <option value="Premium">Premium</option>
                <option value="Joven">Joven</option>
                <option value="Affluent">Affluent</option>
                <option value="Pyme">Pyme</option>
              </select>

              <select className="border border-gray-300 rounded-md p-2 text-sm" value={filterLover} onChange={(e) => setFilterLover(e.target.value)}>
                <option value="">Todos los Comportamientos</option>
                <option value="General Shopper">General Shopper</option>
                <option value="Sin Consumo">Sin Consumo</option>
                <option value="Tech Lover">Tech Lover</option>
                <option value="Travel Lover">Travel Lover</option>
                <option value="Food Lover">Food Lover</option>
                <option value="Streaming Lover">Streaming Lover</option>
              </select>

              <select className="border border-gray-300 rounded-md p-2 text-sm" value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
                <option value="">Todas las Ciudades</option>
                <option value="Guayaquil">Guayaquil</option>
                <option value="Quito">Quito</option>
                <option value="Cuenca">Cuenca</option>
                <option value="Manta">Manta</option>
              </select>
            </div>
          </div>

          {/* Tabla / Grid */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-500">ID</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Nombre</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Ciudad</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Segmento</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Comportamiento</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Saldo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredData.slice(0, 50).map((client) => (
                  <tr key={client.cliente_id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-500">{client.cliente_id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{client.nombre_cliente}</td>
                    <td className="px-6 py-4 text-gray-500">{client.ciudad}</td>
                    <td className="px-6 py-4 text-gray-500">{client.segmento_cliente}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                        {client.segmento_conductual}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">{formatMoney(client.total_saldo)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredData.length > 50 && (
              <div className="p-4 text-center text-sm text-gray-500">
                Mostrando los primeros 50 resultados de {filteredData.length}.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;