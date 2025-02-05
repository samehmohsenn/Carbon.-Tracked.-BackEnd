// utils/testRoutes.js
const http = require('http');

const testRoutes = () => {
    const testCases = [
        {
            method: 'GET',
            path: '/api/emissions',
            userId: '67a0da25abf40089ff088e97'
        },
        {
            method: 'POST',
            path: '/api/emissions',
            userId: '67a0da25abf40089ff088e97',
            body: {
                data: {
                    electricity: 1000,
                    fuel: 500
                },
                month: "January 2021"
            }
        }
    ];

    testCases.forEach(testCase => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: testCase.path,
            method: testCase.method,
            headers: {
                'Content-Type': 'application/json',
                'user-id': testCase.userId
            }
        };

        const req = http.request(options, (res) => {
            console.log(`${testCase.method} ${testCase.path}: ${res.statusCode}`);
            
            res.on('data', (chunk) => {
                console.log('Response:', chunk.toString());
            });
        });

        if (testCase.body) {
            req.write(JSON.stringify(testCase.body));
        }

        req.on('error', (error) => {
            console.error('Test Error:', error);
        });

        req.end();
    });
};

module.exports = {testRoutes};