import React, { useState, useEffect } from 'react';
import { Lock, Unlock, User, Clock, Shield, Activity, Power, Database } from 'lucide-react';

const AccessControlSystem = () => {
  const [doorStatus, setDoorStatus] = useState('locked');
  const [accessLogs, setAccessLogs] = useState([]);
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin', rfid: 'A1B2C3D4', authorized: true },
    { id: 2, name: 'Usuario 1', rfid: 'E5F6G7H8', authorized: true },
    { id: 3, name: 'Usuario 2', rfid: 'I9J0K1L2', authorized: false }
  ]);
  const [newUser, setNewUser] = useState({ name: '', rfid: '' });
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simular conexión en tiempo real con Firebase
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const toggleDoor = () => {
    const newStatus = doorStatus === 'locked' ? 'unlocked' : 'locked';
    setDoorStatus(newStatus);
    
    const log = {
      id: Date.now(),
      action: newStatus === 'unlocked' ? 'Apertura Manual' : 'Cierre Manual',
      user: 'Control Remoto',
      timestamp: new Date().toLocaleString('es-ES'),
      status: 'success'
    };
    
    setAccessLogs([log, ...accessLogs]);
  };

  const addUser = () => {
    if (newUser.name && newUser.rfid) {
      const user = {
        id: users.length + 1,
        name: newUser.name,
        rfid: newUser.rfid,
        authorized: true
      };
      setUsers([...users, user]);
      setNewUser({ name: '', rfid: '' });
      
      const log = {
        id: Date.now(),
        action: 'Usuario Registrado',
        user: newUser.name,
        timestamp: new Date().toLocaleString('es-ES'),
        status: 'info'
      };
      setAccessLogs([log, ...accessLogs]);
    }
  };

  const toggleUserAuth = (userId) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, authorized: !u.authorized } : u
    ));
  };

  const simulateRFIDScan = (rfid) => {
    const user = users.find(u => u.rfid === rfid);
    
    if (user && user.authorized) {
      setDoorStatus('unlocked');
      setTimeout(() => setDoorStatus('locked'), 3000);
      
      const log = {
        id: Date.now(),
        action: 'Acceso Concedido',
        user: user.name,
        timestamp: new Date().toLocaleString('es-ES'),
        status: 'success'
      };
      setAccessLogs([log, ...accessLogs]);
    } else {
      const log = {
        id: Date.now(),
        action: 'Acceso Denegado',
        user: user ? user.name : 'Desconocido',
        timestamp: new Date().toLocaleString('es-ES'),
        status: 'error'
      };
      setAccessLogs([log, ...accessLogs]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Shield className="w-10 h-10 text-cyan-400" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Sistema de Control de Acceso RFID
              </h1>
            </div>
            <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
              <Database className={`w-5 h-5 ${connectionStatus === 'connected' ? 'text-green-400' : 'text-red-400'}`} />
              <span className="text-sm">Firebase {connectionStatus === 'connected' ? 'Conectado' : 'Desconectado'}</span>
            </div>
          </div>
          <p className="text-gray-400 ml-13">Monitoreo y control en tiempo real</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Door Status Card */}
          <div className="lg:col-span-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-semibold">Estado de la Puerta</h2>
            </div>
            
            <div className="flex flex-col items-center justify-center py-8">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 ${
                doorStatus === 'locked' 
                  ? 'bg-red-500/20 border-4 border-red-500' 
                  : 'bg-green-500/20 border-4 border-green-500'
              } transition-all duration-300`}>
                {doorStatus === 'locked' ? (
                  <Lock className="w-16 h-16 text-red-400" />
                ) : (
                  <Unlock className="w-16 h-16 text-green-400" />
                )}
              </div>
              
              <h3 className={`text-2xl font-bold mb-2 ${
                doorStatus === 'locked' ? 'text-red-400' : 'text-green-400'
              }`}>
                {doorStatus === 'locked' ? 'CERRADA' : 'ABIERTA'}
              </h3>
              
              <button
                onClick={toggleDoor}
                className={`mt-4 px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  doorStatus === 'locked'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                } shadow-lg hover:shadow-xl`}
              >
                <div className="flex items-center gap-2">
                  <Power className="w-5 h-5" />
                  {doorStatus === 'locked' ? 'Abrir Puerta' : 'Cerrar Puerta'}
                </div>
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Última actualización: {lastUpdate.toLocaleTimeString('es-ES')}</span>
              </div>
            </div>
          </div>

          {/* Users Management */}
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-semibold">Gestión de Usuarios</h2>
            </div>

            {/* Add User Form */}
            <div className="bg-gray-800/50 rounded-lg p-4 mb-4 border border-gray-700">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Registrar Nuevo Usuario</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <input
                  type="text"
                  placeholder="RFID Tag"
                  value={newUser.rfid}
                  onChange={(e) => setNewUser({ ...newUser, rfid: e.target.value })}
                  className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <button
                  onClick={addUser}
                  className="bg-cyan-600 hover:bg-cyan-700 px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Agregar
                </button>
              </div>
            </div>

            {/* Users List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {users.map(user => (
                <div key={user.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-100">{user.name}</h4>
                      <p className="text-sm text-gray-400">RFID: {user.rfid}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.authorized 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                          : 'bg-red-500/20 text-red-400 border border-red-500/50'
                      }`}>
                        {user.authorized ? 'Autorizado' : 'No Autorizado'}
                      </span>
                      <button
                        onClick={() => toggleUserAuth(user.id)}
                        className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        {user.authorized ? 'Revocar' : 'Autorizar'}
                      </button>
                      <button
                        onClick={() => simulateRFIDScan(user.rfid)}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        Simular
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Access Logs */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-semibold">Registro de Accesos</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Fecha y Hora</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Usuario</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Acción</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {accessLogs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500">
                      No hay registros de acceso aún
                    </td>
                  </tr>
                ) : (
                  accessLogs.map(log => (
                    <tr key={log.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-4 text-gray-300">{log.timestamp}</td>
                      <td className="py-3 px-4 text-gray-300">{log.user}</td>
                      <td className="py-3 px-4 text-gray-300">{log.action}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          log.status === 'success' 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                            : log.status === 'error'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                        }`}>
                          {log.status === 'success' ? 'Exitoso' : log.status === 'error' ? 'Denegado' : 'Info'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessControlSystem;