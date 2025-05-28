import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginVue from 'eslint-plugin-vue';
import globals from 'globals';

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    eslintPluginVue.configs['vue3-recommended'],
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            },
            parser: eslintPluginVue.parser,
            parserOptions: {
                parser: tseslint.parser,
                ecmaVersion: 2020,
                sourceType: 'module',
            },
        },
        rules: {
            'vue/multi-word-component-names': 'off',
            'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
            'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        },
        ignores: ['node_modules/**', 'dist/**', 'public/**'],
    }];