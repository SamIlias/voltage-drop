import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/renderer/src/setupTests.ts'],

  // Ищем тесты в renderer (единственный процесс с тестами сейчас)
  testMatch: [
    '<rootDir>/src/renderer/src/**/*.test.ts',
    '<rootDir>/src/renderer/src/**/*.test.tsx',
    '<rootDir>/src/renderer/src/**/*.spec.ts',
    '<rootDir>/src/renderer/src/**/*.spec.tsx'
  ],

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.web.json'
      }
    ]
  },

  moduleNameMapper: {
    // Алиас @renderer → src/renderer/src
    '^@renderer/(.*)$': '<rootDir>/src/renderer/src/$1',

    // Мокаем статику
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.ts',
    '\\.(jpg|jpeg|png|gif|svg|webp)$': '<rootDir>/src/__mocks__/fileMock.ts',

    // Мокаем electron
    '^electron$': '<rootDir>/src/__mocks__/electron.ts'
  },

  // Игнорируем node_modules кроме ESM-пакетов (добавь сюда если упадёт)
  transformIgnorePatterns: ['node_modules/(?!(some-esm-package)/)']
}

export default config
