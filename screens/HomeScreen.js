import { View, Text, Button, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import useAuth from '../hooks/useAuth';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons'
import Swiper from 'react-native-deck-swiper';
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import generateId from '../lib/generateid';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const swipeRef = useRef(null);
  const [profiles, setProfiles] = useState([])

  useLayoutEffect(() => onSnapshot(doc(db, 'users', user.uid), snapshot => {
    if (!snapshot.exists()) {
      navigation.navigate('Modal')
    }
  }));

  useEffect(() => {
    let unsub;

    const fetchCards = async () => {
      const passes = await getDocs(
        collection(db, 'users', user.uid, 'passes')
      ).then(
        (snapshot) => snapshot.docs.map((doc) => doc.id))

      const swipes = await getDocs(
        collection(db, 'users', user.uid, 'swipes')).then(
          (snapshot) => snapshot.docs.map((doc) => doc.id))

      const passedUserIds = passes.length > 0 ? passes : ['test'];
      const swipedUserIds = swipes.length > 0 ? swipes : ['test'];

      unsub = onSnapshot(
        query(
          collection(db, 'users'),
          where('id', 'not-in', [...passedUserIds, ...swipedUserIds])),
        (snapshot) => {
          setProfiles(
            snapshot.docs
              .filter((doc) => doc.id !== user.uid)
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
          )
        })
    }
    fetchCards();
    return unsub;
  }, [db]);

  const swipeLeft = (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    console.log(`You swiped PASS on ${userSwiped.displayName}`);
    setDoc(doc(db, 'users', user.uid, 'passes', userSwiped.id), userSwiped);

  }
  const swipeRight = async (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    const loggedInProfile = await (
      await getDoc(doc(db, 'users', user.uid))).data();

    getDoc(doc(db, 'users', userSwiped.id, 'swipes', user.uid)).then(
      (documentSnapshot) => {
        if (documentSnapshot.exists()) {
          console.log(`Valio, jums pavyko susijungti su ${userSwiped.displayName}`)

          setDoc(doc(db, 'users', user.uid, 'swipes', userSwiped.id), userSwiped);

          //CREATE A MATCH
          setDoc(doc(db, 'matches', generateId(user.uid, userSwiped.id)), {
            users: {
              [user.uid]: loggedInProfile,
              [userSwiped.id]: userSwiped,
            },
            userMatched: [user.uid, userSwiped.id],
            timestamp: serverTimestamp(),
          });
          navigation.navigate('Match', {
            loggedInProfile,
            userSwiped
          });

        } else {
          console.log(`You swiped on ${userSwiped.displayName} (${userSwiped.job})`)
          setDoc(doc(db, 'users', user.uid, 'swipes', userSwiped.id), userSwiped);
        }
      }
    );
  };

  return (
    <SafeAreaView className='flex-1'>
      <View className='flex-row items-center justify-between px-5'>
        <TouchableOpacity onPress={logout}>
          <Image className='h-10 w-10 rounded-full' source={{ uri: user.photoURL }} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Modal')}>
          <Image className='h-16 w-14' source={require('../tinder-logo.png')} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ChatScreen')}>
          <Ionicons name='chatbubbles-sharp' size={30} color='#FF5864' />
        </TouchableOpacity>
      </View>

      <View className='flex-1 -mt-6'>
        <Swiper
          ref={swipeRef}
          containerStyle={{ backgroundColor: 'transparent' }}
          cards={profiles}
          stackSize={5}
          cardIndex={0}
          animateCardOpacity
          verticalSwipe={false}
          onSwipedLeft={(cardIndex) => {
            swipeLeft(cardIndex)
            console.log('Pavykes')
          }}
          onSwipedRight={(cardIndex) => {
            swipeRight(cardIndex);
            console.log('Nepavykes')
          }}
          backgroundColor={'#4FD0E9'}
          overlayLabels={{
            left: {
              title: 'NOPE',
              style: {
                label: {
                  textAlign: 'right',
                  color: 'red',
                },
              },
            },
            right: {
              title: 'MATCH',
              style: {
                label: {
                  color: '#4DED30',
                },
              },
            },
          }}
          renderCard={(card) => card ? (
            <View key={card.id} className=' relative bg-white h-3/4 rounded-xl'>
              <Image className='absolute top-0 h-full w-full rounded-xl' source={{ uri: card.photoURL }} />

              <View className='absolute bottom-0 bg-white w-full flex-row 
              justify-between items-between h-20 px-6 py-2 rounded-b-xl shadow-xl'>
                <View>
                  <Text className='text-xl font-bold'>{card.displayName}</Text>
                  <Text>{card.job}</Text>
                </View>
                <Text className='text-2xl font-bold'>{card.age}</Text>
              </View>

            </View>
          ) : (
            <View className='relative bg-white h-3/4 rounded-xl justify-center items-center shadow-xl'>
              <Text className='font-bold pb-5'>No more profiles</Text>
              <Image style={{ height: 100, width: 100 }} className='h-20 w-full' source={{ uri: 'https://links.papareact.com/6gb' }} />
            </View>
          )} />
      </View>
      <View className='flex flex-row justify-evenly'>
        <TouchableOpacity onPress={() => swipeRef.current.swipeLeft()} className='items-center justify-center rounded-full w-16 h-16 bg-red-200'>
          <Entypo name='cross' size={24} color='red' />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => swipeRef.current.swipeRight()} className='items-center justify-center rounded-full w-16 h-16 bg-green-200'>
          <AntDesign name='heart' size={24} color='green' />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen