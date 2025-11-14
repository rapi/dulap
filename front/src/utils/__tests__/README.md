# Unit Tests for URL Storage

This directory contains unit tests for the URL configuration storage functionality.

## Setup

To run these tests, you need to install Jest and related dependencies:

```bash
npm install --save-dev jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom
```

## Configuration

Create a `jest.config.js` file in the `front` directory:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
  ],
}
```

Add test script to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- columnConfigUrl.test.ts
```

## Test Files

### columnConfigUrl.test.ts
Tests for encoding/decoding column configurations to/from URL format.

**Coverage:**
- `encodeColumnConfigs()` - Converts array of configurations to compact URL string
- `decodeColumnConfigs()` - Parses URL string back to configuration array
- `isValidColumnConfigCode()` - Validates configuration codes
- Round-trip encoding/decoding integrity

**Test cases:**
- All 15 configuration types (5 drawers, 5 single doors, 5 split doors)
- Door opening side (left/right) for single door configurations
- Invalid input handling and error cases
- Whitespace and empty value handling

### configUrl.test.ts
Tests for URL query parameter parsing and serialization.

**Coverage:**
- `parseQueryToConfig()` - Parses URL query params to configuration object
- `configToQuery()` - Serializes configuration to URL query params
- `normalizeConfig()` - Validates and normalizes configuration values

**Test cases:**
- Basic parameter parsing (width, height, depth, color, columns, plintHeight)
- Column configurations (`colCfg` parameter)
- Opening type (`openingType` parameter)
- Default value filtering (to keep URLs short)
- Value clamping and snapping to valid ranges
- Round-trip parsing/serialization

## Test Coverage Goals

Target: **90%+ coverage** for all URL storage utilities

Current test coverage:
- `columnConfigUrl.ts`: ~100% (all functions, all branches)
- `configUrl.ts`: ~95% (core functions covered)

## Manual Testing Checklist

After running automated tests, manually verify:

1. ✅ Change configuration → URL updates
2. ✅ Refresh page → configuration persists
3. ✅ Copy URL → paste in new tab → same configuration
4. ✅ Invalid URL values → fallback to valid defaults → URL corrects itself
5. ✅ Deep link sharing works across different users

## Example URLs for Testing

### Stand with 3 columns
```
/ru/configurator/stand?width=150&height=90&depth=45&columns=3&colCfg=D1SL,DR3,D2SR&openingType=handle&color=%23fcfbf5
```

### Bedside with 2 columns
```
/ru/configurator/bedside?width=60&height=70&columns=2&colCfg=DR2,D3SL&openingType=push
```

### TV Stand with split doors
```
/ru/configurator/tv-stand?width=180&height=80&columns=4&colCfg=DS2S,DR2,DR3,DS3S&openingType=handle
```

