import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { Foundation} from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'


const Header = ({title, callEnabled}) => {
    const navigation = useNavigation();

  return (
    <View className='p-2 flex-row items-center justify-between'>
     <View className='flex flex-row items-center'>
<TouchableOpacity onPress={()=> navigation.goBack()} className='p-2'>
<Ionicons name='chevron-back-outline' size={34} color='#FF5864' />
</TouchableOpacity>
<Text className='text-2xl font-bold pl-2'>{title}</Text>
     </View>



    </View>
  )
}

export default Header