import { View, Text } from 'react-native'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import * as Google from 'expo-auth-session/providers/google';
import { IOS_CLIENT, ANDROID_CLIENT, EXPO_CLIENT } from '@env'
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { async } from '@firebase/util';

const AuthContext = createContext({});
WebBrowser.maybeCompleteAuthSession();

const config = {
    androidClientId: ANDROID_CLIENT,
    iosClientId: IOS_CLIENT,
    expoClientId: EXPO_CLIENT,
    scopes: ['profile', 'email'],
    permissions: ['public_profile', 'email', 'gender', 'location']
}

export const AuthProvider = ({ children }) => {
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [loadingInicial, setLoadingInicial] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser(user);
        } else {
            setUser(null);
        }
        setLoadingInicial(false);
    }),
        []);

    const logout = () => {
        setLoading(true);
        signOut(auth).catch((error) => setError(error)).finally(() => setLoading(false));
    };

    const [request, response, promptAsync] = Google.useAuthRequest(config);

    const signInWithGoogle = async () => {
        setLoading(true);
        await
            promptAsync().then(async (response) => {
                if (response?.type === 'success') {
                    const { idToken, accessToken } = response.authentication;
                    const credential = GoogleAuthProvider.credential(idToken, accessToken);
                    await signInWithCredential(auth, credential);
                }
                return Promise.reject();
            }).catch(error => setError(error))
                .finally(() => setLoading(false));
    };
    const memoedValue = useMemo(() => ({
        user,
        loading,
        error,
        logout,
        signInWithGoogle
    }), [user, loading, error])
    return (
        <AuthContext.Provider value={memoedValue}>
            {!loadingInicial && children}
        </AuthContext.Provider>
    )
}
export default function useAuth() {
    return useContext(AuthContext);
}
