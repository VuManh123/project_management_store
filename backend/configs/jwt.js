module.exports = {
    secret : process.env.JWT_SECRET || 'secret',

    ttl: '1h',
    
    refreshTtl: '1y'
}
