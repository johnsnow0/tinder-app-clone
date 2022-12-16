import { View, Text } from 'react-native'
import React, { createContext, useContext } from 'react'
import * as Google from 'expo-auth-session'
import {IOS_CLIENT, ANDROID_CLIENT} from '@env'

const AuthContext = createContext({});

const config = {
    androidClientId: {ANDROID_CLIENT},
    iosClientId: {IOS_CLIENT},
    scopes: ['profile', 'email'],
    permissions: ['public_profile', 'email', 'gender', 'location']
}

export const AuthProvider = ({children}) => {
    const signInWithGoogle = async() => {
 Google.logInAsync(config).then(async (logInResult) => {
    if(logInResult.type === 'success') {

    }
 });
    }
  return (
    <AuthContext.Provider value={{
        user: null,
        signInWithGoogle
    }}>
     {children}
    </AuthContext.Provider>
  )
}
export default function useAuth() {
    return useContext(AuthContext);
}
