module.exports = {
  preset: "ts-jest", // Informa ao Jest para usar o ts-jest
  testEnvironment: "node", // O ambiente onde os testes rodarão (Node.js para backend)
  roots: ["<rootDir>/src"], // O diretório onde seus testes e código fonte estão
  testMatch: [
    // Padrão para encontrar arquivos de teste
    "**/__tests__/**/*.test.ts", // Procura por arquivos .test.ts dentro de pastas __tests__
  ],
  // Opcional: Coleta de cobertura de código
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8", // Ou 'babel'
  // Opcional: Limpar mocks entre os testes
  clearMocks: true,
};
