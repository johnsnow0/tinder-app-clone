import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import useAuth from '../hooks/useAuth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation } from '@react-navigation/native';

const ModalScreen = () => {
    const navigation = useNavigation()
    const [image, setImage] = useState(null);
    const [job, setJob] = useState(null);
    const [age, setAge] = useState(null);
    const incompleteForm = !image || !job || !age;

    const updateUserProfile = () => {
        setDoc(doc(db, 'users', user.uid), {
            id: user.uid,
            displayName: user.displayName,
            photoURL: image,
            job: job,
            age: age,
            timeStamp: serverTimestamp()
        }).then(() => navigation.navigate('HomeScreen')).catch((error) => { alert(error.message); })
    }

    const { user } = useAuth();
    return (
        <View className='flex-1 items-center pt-1'>
            <Image
                className='h-20 w-full'
                resizeMode='contain'
                source={{ uri: 'https://links.papareact.com/2pf' }} />

            <Text className='text-xl text-gray-500 p-2 font-bold'>Sveiki {user.displayName}</Text>
            <Text
                className='text-center  p-4 font-bold text-red-400'>Step1. profile pic</Text>
            <TextInput
                value={image}
                onChangeText={setImage}
                className='text-center text-xl pb-2'
                placeholder='Enter profile pic url' />


            <Text className='text-center  p-4 font-bold text-red-400'>Step2. JOb</Text>
            <TextInput
                value={job}
                onChangeText={setJob}
                className='text-center text-xl pb-2'
                placeholder='Enter job' />


            <Text className='text-center  p-4 font-bold text-red-400'>Step3. Age</Text>
            <TextInput
                value={age}
                onChangeText={setAge}
                className='text-center text-xl pb-2'
                placeholder='Enter age' />

            <TouchableOpacity
            onPress={updateUserProfile}
                disabled={incompleteForm}
                className={`w-64 p-3 rounded-xl absolute bottom-12 bg-red-400 ${incompleteForm ? 'bg-gray-400' : 'bg-red-400'}`}>
                <Text className='text-center text-white text-xl'>Update profile</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ModalScreen