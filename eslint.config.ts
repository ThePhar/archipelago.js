import type { RulesConfig } from "@eslint/core";
import eslint from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import vitest from "@vitest/eslint-plugin";
import { defineConfig } from "eslint/config";
import { jsdoc } from "eslint-plugin-jsdoc";
import packageJson from "eslint-plugin-package-json";
import importSort from "eslint-plugin-simple-import-sort";
import tslint from "typescript-eslint";

// these PREFERENCES have been INFERRED from the code base. prior to the change that adds this, there was no explicit
// ESLint configuration for them one way or the other. after fixing some oversights that had prevented some ESLint rules
// from running on some files, it looks like there are some strong preferences for these non-defaults. there are other
// rule configurations that are needed for completely different reasons, so separate them out like this.
const inferredPreferences: RulesConfig = {
    "@stylistic/member-delimiter-style": ["error", {
        multiline: {
            delimiter: "none",
            requireLast: true,
        },
        singleline: {
            delimiter: "comma",
            requireLast: false,
        },
    }],
    "@stylistic/operator-linebreak": ["error", "after", {
        overrides: {
            "|": "before",
        },
    }],
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/non-nullable-type-assertion-style": "off",
};

export default defineConfig(
    {
        ignores: ["node_modules", "dist", "docs", "coverage"],
    },
    {
        files: ["**/*.ts"],
        extends: [
            eslint.configs.recommended,
            tslint.configs.recommendedTypeChecked,
            tslint.configs.stylisticTypeChecked,
            stylistic.configs.customize({
                arrowParens: true,
                braceStyle: "1tbs",
                indent: 4,
                quotes: "double",
                semi: true,
            }),
            jsdoc({
                config: "flat/recommended-typescript",
                rules: {
                    "jsdoc/check-tag-names": ["warn", { definedTags: ["remarks", "category", "experimental"] }],
                    "jsdoc/require-description": "warn",
                    "jsdoc/require-template": "warn",
                    "jsdoc/require-returns": "off",
                    "jsdoc/require-throws": "warn",
                    "jsdoc/require-throws-type": "off",
                    "jsdoc/sort-tags": "warn",
                    "jsdoc/valid-types": "off",
                },
            }),
        ],
        plugins: {
            "simple-import-sort": importSort,
        },
        rules: {
            ...inferredPreferences,
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
        },
        languageOptions: {
            parserOptions: {
                projectService: true,
            },
        },
    },
    {
        files: ["package.json"],
        extends: [
            packageJson.configs.recommended,
            packageJson.configs.stylistic,
        ],
    },
    {
        files: ["test/**/*.ts"],
        extends: [
            vitest.configs.recommended,
        ],
        settings: {
            vitest: {
                typecheck: true,
            },
        },
    },
);
