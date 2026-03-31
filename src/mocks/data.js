export const workers = [
  { id: 1, name: 'Juan Pérez', dni: '12345678', area: 'Desarrollo', status: 'Activo' },
  { id: 2, name: 'María Gomez', dni: '87654321', area: 'Diseño', status: 'Activo' },
  { id: 3, name: 'Carlos López', dni: '11223344', area: 'Gerencia', status: 'Inactivo' },
];

export const todayLogs = [];

export const generateMockLog = (worker, type) => {
  return {
    id: Date.now(),
    workerId: worker.id,
    type, 
    timestamp: new Date().toISOString(),
  };
};
