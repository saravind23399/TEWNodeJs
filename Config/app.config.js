/*
    Author : Aravind S
    Date : 14-JANUARY-2019
    Description : The master configuration for the Application. 
    
                                                *** Change with Care ***
                            *** Do not change anything if you don't know what you're doing ***

*/

// The Master Configuration Document
config = {

    // Database Configuration
    database: {
        name: 'mongodb://admin:tewmepco2019@ds251804.mlab.com:51804/tewmepco'
    },

    // Application Configuration
    application: {
        env: 'development',
        secret: 'secret'
    },

    // Pagination Configuration
    pagination: {
        perPage: 10
    },

    // Mailing Configuration
    mailCredentials: {
        service: 'gmail',
        auth: {
            user: 'saravind23399@gmail.com',
            pass: 'Aravindiam29#'
        }
    }
}

// Exports Master Configuration
module.exports = config;