import { defineFlatConfig } from 'eslint-define-config';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import pluginJs from '@eslint/js';

const config = defineFlatConfig([
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    rules: {
      'no-unused-vars': 'warn',
    },
  },
]);

export default config;
