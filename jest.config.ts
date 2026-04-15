import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/renderer/src/setupTests.ts'],

  testMatch: [
    '<rootDir>/src/renderer/src/**/*.test.{ts,tsx}',
    '<rootDir>/src/renderer/src/**/*.spec.{ts,tsx}'
  ],

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.web.json'
      }
    ]
  },
  transformIgnorePatterns: ['/node_modules/(?!(uuid)/)'],

  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      'jest-transform-stub',

    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',

    '^@renderer/(.*)$': '<rootDir>/src/renderer/src/$1',
    '^electron$': '<rootDir>/src/__mocks__/electron.ts'
  }
}

export default config
