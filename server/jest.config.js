module.exports = {
    testEnvironment: 'node',
    testMatch: [
        '**/__tests__/**/*.test.js',
        '**/*.test.js'
    ],
    collectCoverageFrom: [
        '**/*.js',
        '!node_modules/**',
        '!coverage/**',
        '!jest.config.js'
    ]
};