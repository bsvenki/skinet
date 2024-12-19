export const environment = {
    production: true,
    apiUrl: 'api/',
    "fileReplacements": [
        {
            "replace": "src/environments/environment.ts",
            "with": "src/environments/environments.prod.ts"
        }                
    ],
}