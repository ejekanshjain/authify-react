import React from 'react'

export default React.createContext({
    user: {
        userId: '',
        role: {
            id: '',
            name: ''
        },
        refreshToken: '',
        token: '',
        issuedAt: 0,
        expiresAt: 0
    },
    signIn: (userId, roleId, roleName, refreshToken, token, issuedAt, expiresAt) => { },
    signOut: async () => { },
    getToken: async () => ({ token: '', refreshToken: '' }),
    getProfile: async () => { }
})