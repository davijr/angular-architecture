
const proxy = [
    {
        context: '/api',
        target: 'http://bzdf-frontend-dev.gcp.cloud.us.hsbc:8080/api',
        pathRewrite: { '^/api': '' }
    }
];

module.exports = proxy;