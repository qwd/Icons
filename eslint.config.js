import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import jsonc from 'eslint-plugin-jsonc';
import globals from 'globals';
import * as jsoncParser from 'jsonc-eslint-parser';
import tseslint from 'typescript-eslint';

export default [
  {
    name: 'app/ignores',
    ignores: ['dist/**', 'node_modules/**', 'icons/**', 'fonts/']
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    name: 'app/node-ts-rules',
    files: ['build/**/*.ts', 'utils/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.node.json'
      },
      globals: {
        ...globals.node
      }
    },
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'indent': 'off',
      'generator-star-spacing': 'off',
      'no-useless-assignment': 'off',
      'no-console': 'off',
      'no-debugger': 'off',
      'max-len': ['error', {
        'code': 180,
        'tabWidth': 2,
        'ignoreUrls': true,
        'ignoreStrings': true,
        'ignoreTemplateLiterals': true,
        'ignoreComments': true
      }],
      '@stylistic/indent': ['error', 2, {
        'SwitchCase': 1,
        'VariableDeclarator': 1,
        'outerIIFEBody': 1,
        'MemberExpression': 1,
        'FunctionDeclaration': {'parameters': 1, 'body': 1},
        'FunctionExpression': {'parameters': 1, 'body': 1}
      }],
      '@stylistic/brace-style': ['error', '1tbs', {'allowSingleLine': false}],
      '@stylistic/no-multiple-empty-lines': ['error', {'max': 1, 'maxEOF': 0}],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/no-multi-spaces': 'error',
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/object-curly-spacing': ['error', 'never'],
      '@stylistic/object-curly-newline': ['error', {'multiline': true, 'consistent': true}],
      '@stylistic/key-spacing': ['error', {'beforeColon': false, 'afterColon': true}],
      '@stylistic/operator-linebreak': ['error', 'before'],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/space-infix-ops': ['error', {'int32Hint': false}],
      '@stylistic/comma-spacing': ['error', {'before': false, 'after': true}],
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/space-before-blocks': ['error', 'always'],
      '@stylistic/lines-between-class-members': ['error', 'always', {'exceptAfterSingleLine': true}],
      '@stylistic/space-before-function-paren': ['error', {'anonymous': 'always', 'named': 'always', 'asyncArrow': 'always'}]
    }
  },

  {
    name: 'app/config-files',
    files: ['eslint.config.js'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },

  {
    name: 'app/json-support',
    files: ['**/*.json', '**/*.jsonc'],
    languageOptions: {
      parser: jsoncParser
    },
    plugins: {
      jsonc: jsonc
    },
    rules: {
      ...jsonc.configs['recommended-with-json'].rules,
      'jsonc/indent': ['error', 2],
      'jsonc/quotes': ['error', 'double'],
      'jsonc/comma-dangle': ['error', 'never']
    }
  }
];