const APP_CONFIG = {
    //apiBaseUrl: 'https://a43d0a96.ngrok.io/SiiLifeAgency',
    apiBaseUrl: 'https://lifeagency.siicanada.com:3232/SiiLifeAgency',   
    //apiBaseUrl: 'http://10.168.2.158:8080/SiiLifeAgency',   
    azureApp: {
        client_id: '786e088e-1200-4677-8a8f-0aec6034dbdf',
        redirectUrl: 'http://localhost:8081/',
        authorityHost: 'https://login.microsoftonline.com/97ea3789-7e74-411d-b3b6-3db58dc16903/oauth2/authorize',
        tenant: '97ea3789-7e74-411d-b3b6-3db58dc16903',
        client_secret: '1J0bKceNM7/h+L3DP64r0HuWB7YlwtW38VQCIZOQAQo=',

        // client_id: '8f663882-0077-4148-afa2-bc9bdd977b1c',
        // redirectUrl: 'http://localhost:8081/',
        // authorityHost: 'https://login.microsoftonline.com/064ee340-3ef7-4e87-8e56-d1f46b367125/oauth2/authorize',
        // tenant: '064ee340-3ef7-4e87-8e56-d1f46b367125',
        // client_secret: 'TRhhzrgcnBsrqXx9SbYlEdvfIRBqGIa0WgAhZjhc3ZE=',

        resources: [
            'https://graph.microsoft.com'
        ]
    },
    token: 'azure_token',
    admGroup: 'grp-app-lifeagency-adm'
    //admGroup: 'grp-sec-sync-teams-lifeagency'
};

module.exports = Object.freeze(APP_CONFIG);