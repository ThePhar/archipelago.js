// @ts-check
// noinspection JSCheckFunctionSignatures

import eslint from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import jsdoc from "eslint-plugin-jsdoc";
import importSort from "eslint-plugin-simple-import-sort";
import tslint from "typescript-eslint";

export default tslint.config(
    eslint.configs.recommended,
    ...tslint.configs.recommendedTypeChecked,
    stylistic.configs["recommended-flat"],
    jsdoc.configs["flat/recommended-typescript"],
    {
        ignores: ["node_modules", "dist", "docs", "coverage"],
        plugins: {
            "@stylistic": stylistic,
            "simple-import-sort": importSort,
        },
        rules: {
            "@stylistic/arrow-parens": ["error", "always"],
            "@stylistic/brace-style": ["error", "1tbs"],
            "@stylistic/indent": ["error", 4],
            "@stylistic/indent-binary-ops": ["error", 4],
            "@stylistic/quotes": ["error", "double"],
            "@stylistic/semi": ["error", "always"],
            "jsdoc/check-tag-names": ["warn", { definedTags: ["remarks", "category", "experimental"] }],
            "jsdoc/require-description": "warn",
            "jsdoc/require-template": "warn",
            "jsdoc/require-returns": "off",
            "jsdoc/require-throws": "warn",
            "jsdoc/sort-tags": "warn",
            "jsdoc/valid-types": "off",
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
        },
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            parserOptions: {
                projectService: {
                    allowDefaultProject: ["*.js", "*.mjs"],
                },
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
);
