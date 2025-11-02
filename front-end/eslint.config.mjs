// Import du preset de règles ESLint pour JavaScript moderne
import js from "@eslint/js";

// Import des variables globales (par exemple window, document, etc.)
import globals from "globals";

// Import du plugin ESLint spécifique à React
import pluginReact from "eslint-plugin-react";

// Import de la fonction utilitaire pour définir une config ESLint
import { defineConfig } from "eslint/config";


export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"], // Cible tous les fichiers JS et JSX
    plugins: { js },                  // Active le plugin JS (les règles recommandées JS)
    extends: ["js/recommended"],     // Étend les règles recommandées du plugin JS
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],  // Cible aussi tous les fichiers JS et JSX
    languageOptions: {
      globals: globals.browser,         // Définit les globals spécifiques au navigateur (window, document...)
    },
  },
  // Ajoute les règles recommandées en mode "flat" du plugin React
  pluginReact.configs.flat.recommended,
]);

/*
defineConfig : une fonction utilitaire qui aide à mieux typer et valider la config ESLint

Le tableau passé à defineConfig permet de combiner plusieurs configurations ciblant des fichiers ou options différentes

Le plugin React est ajouté via sa config recommandée en mode flat (nouveau mode de config d’ESLint, plus flexible)
*/
