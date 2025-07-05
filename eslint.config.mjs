import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),

    // AÑADE ESTE OBJETO PARA DESACTIVAR LA REGLA:
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
        }
    }
];
//esto es para que no de error al importar el archivo
export default eslintConfig;