import { View, Text, Image } from 'react-native'
import React from 'react'

const SenderMessage = ({message}) => {
  return (
    <View className='bg-purple-600 rounded-lg rounded-tr-none px-5 py-3 mx-3 my-2 ml-auto' style={{alignSelf: 'flex-start'}}>
        <Image className='h-12 w-12 rounded-full absolute top-0 -left-14' source={{uri: message.photoURL}} />
      <Text className='text-white'>{message.message}</Text>
    </View>
  )
}

export default SenderMessage