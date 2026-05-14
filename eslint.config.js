import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import jsonc from 'eslint-plugin-jsonc';
import globals from 'globals'; // 引入标准全局变量
import * as jsoncParser from 'jsonc-eslint-parser';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    name: 'app/typescript-support-node',
    files: ['build/**/*.ts', 'utils/**/*.ts', 'eslint.config.js'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.node.json'
      },
      globals: {...globals.node}
    }
  },

  {
    name: 'app/json-support',
    files: ['**/*.json'],
    languageOptions: {
      parser: jsoncParser
    },
    plugins: {
      jsonc: jsonc
    },
    rules: {
      ...jsonc.configs['recommended-with-json'].rules,
      'jsonc/indent': [ 'error', 2],
      'jsonc/quotes': ['error', 'double'],
      'jsonc/comma-dangle': ['error', 'never']
    }
  },

  {
    name: 'app/custom-rules',
    files: ['build/**/*.ts', 'utils/**/*.ts', 'eslint.config.js'],
    plugins: {'@stylistic': stylistic},
    rules: {
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
      'no-useless-assignment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
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
      '@stylistic/space-before-function-paren': ['error', {'anonymous': 'always', 'named': 'always', 'asyncArrow': 'always'}],
      'max-len': ['error', {'code': 180, 'tabWidth': 2, 'ignoreUrls': true, 'ignoreStrings': true, 'ignoreTemplateLiterals': true, 'ignoreComments': true}],
      'no-console': 'off',
      'no-debugger': 'off',
      'generator-star-spacing': 'off',
      'indent': 'off'
    }
  },

  {
    name: 'app/ignores',
    ignores: ['dist/**', 'node_modules/**', 'public/**', 'assets/cesium/**']
  }
];