import { Alert, StyleSheet, Text, View, PermissionsAndroid, ToastAndroid } from 'react-native';
import React, { createContext, useContext, useEffect, useState } from 'react';
import getAuthUser from '../Hooks/getAuthUser';
import getDBconnection from '../Hooks/Sql/getDBconnection';
import setAuthUser from '../Hooks/setAuthUser';
import clearAuthUser from '../Hooks/clearAuthUser';
import loginController from '../Hooks/Controller/User/loginController';
import settingController from '../Hooks/Controller/Setting/settingController';
import storeUsers from '../Hooks/Sql/User/storeuser';
import { InternetStatusContext } from '../App';
import shiftDatabase from '../Hooks/Sql/shiftManagement/shiftDatabase';
import getVehiclePrices from '../Hooks/Controller/vechicles/getVehiclePrices';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {


  const [isLogin, setIslogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [READ_PHONE_STATE, setREAD_PHONE_STATE] = useState(false);

  const [InOutVehicleInfo, setInOutVehicleInfo] = useState([]);

  // store user and is storing the token
  const { storeUser } = setAuthUser();
  // retrive AuthUSer
  const { retrieveAuthUser } = getAuthUser();
  // create user
  const { checkUser, createUser } = getDBconnection();

  // General Setting
  const { generalSetting } = settingController();

  // is internet available
  const isOnline = useContext(InternetStatusContext);

  const { loginHandaler } = loginController();
  const { addNewUserData, getStoreUserData, deleteUserById, getUserByToken, } = storeUsers();
  const { handleGetAllVehiclesRates } = getVehiclePrices()
  const { storeShiftData } = shiftDatabase();

  const { removeAuthUser } = clearAuthUser();

  // check phone permission is grantend or not
  const isPermitted = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        {
          title: 'Phone state access Permission',
          message: 'to access your machine imei',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setREAD_PHONE_STATE(true);
        // console.log('You can use this');
      } else {
        setREAD_PHONE_STATE(false);
        // console.log('permission denied');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const [isBlueToothEnable, setIsBlueToothEnable] = useState(false);
  async function checkPermissions() {
    try {
      console.log("TRYING TO GET PRINTER PERMISSION")
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          'com.pos.permission.SECURITY',
          'com.pos.permission.ACCESSORY_DATETIME',
          'com.pos.permission.ACCESSORY_LED',
          'com.pos.permission.ACCESSORY_BEEP',
          'com.pos.permission.ACCESSORY_RFREGISTER',
          'com.pos.permission.CARD_READER_ICC',
          'com.pos.permission.CARD_READER_PICC',
          'com.pos.permission.CARD_READER_MAG',
          'com.pos.permission.COMMUNICATION',
          'com.pos.permission.PRINTER',
          'com.pos.permission.ACCESSORY_RFREGISTER',
          'com.pos.permission.EMVCORE',
        ]).then(result => {
          if (
            result['android.permission.ACCESS_COARSE_LOCATION'] &&
            result['android.permission.ACCESS_FINE_LOCATION'] &&
            result['android.permission.READ_EXTERNAL_STORAGE'] &&
            result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
          ) {
            BleManager.enableBluetooth()
              .then(() => {
                setIsBlueToothEnable(true);
                console.log(
                  'The bluetooth is already enabled or the user confirm',
                );
              })
              .catch(error => {
                console.log('The user refuse to enable bluetooth', error);
              });
          } else if (
            result['android.permission.ACCESS_COARSE_LOCATION'] ||
            result['android.permission.ACCESS_FINE_LOCATION'] ||
            result['android.permission.READ_EXTERNAL_STORAGE'] ||
            result['android.permission.WRITE_EXTERNAL_STORAGE'] ===
              'never_ask_again'
          ) {
            console.log('The user refuse to enable some permission.');
          }
        });
      }
    } catch (error) {
      console.log('Error checking Bluetooth status:', error);
    }
  }

  // useEffect(() => {
  //   checkPermissions();
  // }, []);

  //handle offline login
  const offlineLogin = async (mobile, password) => {
    setLoading(true);
    const user = await getStoreUserData(mobile);
    console.log("______________ 0000000000000000000 _________________", user)
    if (!user) {
      ToastAndroid.showWithGravity(
        'NO User Found With this id',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      setLoading(false);
      return;
    }

    if (password == user.stPassword) {
      setIslogin(true);
      storeUser(user.token);
      setLoading(false);
      return;
    }
    ToastAndroid.showWithGravity(
      'please check your id and password',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );

    // alert('please check your id and password');
    setLoading(false);
  };

  //handle online login
  const onlineLogin = async (mobile, password) => {
    console.log('mobile', 'password');

    await loginHandaler(mobile, password)
      .then(res => {
        // console.log("__________________________________________________<>",res)
        setLoading(true);
        const data = res.data;
        if (!data) {
          return ToastAndroid.showWithGravity(
            'server issue',
            ToastAndroid.LONG,
            ToastAndroid.TOP,
          );
        }

        const location = data?.location?.[0]?.loction
        const companyname = data?.subclient?.[0]?.sub_client_name

        if (!location) {
          return ToastAndroid.showWithGravity(
            'location not found',
            ToastAndroid.LONG,
            ToastAndroid.TOP,
          );
        }
        if (!companyname) {
          return ToastAndroid.showWithGravity(
            'subclient not found',
            ToastAndroid.LONG,
            ToastAndroid.TOP,
          );
        }

        // if (data?.user?.allow_flag != 'Y') {
        //   setLoading(false);
        //   ToastAndroid.showWithGravity(
        //     'YOUR MACHINE IS NOT REGISTERED',
        //     ToastAndroid.LONG,
        //     ToastAndroid.TOP,
        //   );
        //   console.log("YOUR MACHINE IS  NOT ASSIGN")
        //   // alert('you machine not registered');
        //   return;
        // }
        if (data.status) {
          // delete user
          deleteUserById(data.user.user_id)
            .then(() => {
              // ADD NEW USER
              addNewUserData(data?.user, data.token, location, companyname)
                .then(async () => {
                  await handleGetAllVehiclesRates(data.token, data.user.sub_client_id)
                  setIslogin(data.status);
                  storeUser(data.token);
                  setLoading(false);
                  // STORE SHIFT DATA
                  // storeShiftData(data.shift)
                  //   .then(() => {
                  //     setIslogin(data.status);
                  //     storeUser(data.token);
                  //     setLoading(false);
                  //   })
                  // .catch(err => {
                  //   console.error(err);
                  //   // alert(err);
                  // });
                })
                .catch(err => {
                  console.log(err);
                  // alert(err);
                });
            })
            .catch(err => {

              console.log(err);
              // alert(err);
            });
          return;
        }

        if (!data.status) {
          // Alert.alert(data.message);
          console.log(data)
          setLoading(false);
          return;
        }
      })
      .catch(err => {
        // alert(err);
        console.error(err.message)
        setLoading(false);
      });
  };

  // handle login
  const login = async (mobile, password) => {
    if (READ_PHONE_STATE) {
      setLoading(true);
      if (isOnline) {
        await onlineLogin(mobile, password);
      }

      if (!isOnline) {
        console.log('offline login start');
        await offlineLogin(mobile, password);
      }
      setLoading(false);
    } else {
      Alert.alert(
        'phone state permission',
        'you have to give us the phone state permission to continue',
        [
          {
            text: 'Cancel',
            // onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'OK', onPress: () => {isPermitted(); checkPermissions();} },
        ],
      );
      // isPermitted()
    }
  };

  // handle sign up
  const signUp = (mobile, password) => {
    setLoading(true);
    createUser(mobile, password)
      .then(() => {
        setLoading(false);
        storeUser(mobile);
        setIslogin(true);
      })
      .catch(error => console.warn('alredy registered'));
    setLoading(false);
  };

  // handle logout
  const logOut = () => {
    removeAuthUser()
      .then(() => setIslogin(false))
      .catch(error => console.warn(error.message));
  };

  // check in every app launch that user is logged in or not
  const isAuth = async () => {
    setLoading(true);
    const user = await retrieveAuthUser();
    if (user) {
      // getSettings()
      setIslogin(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    isPermitted();
    checkPermissions();
    isAuth();

  }, []);
  return (
    <AuthContext.Provider
      value={{ isLogin, login, loading, logOut, signUp, generalSetting }}>
      {children}
    </AuthContext.Provider>
  );
};

// ofline login
// checkUser(mobile, password).then((res) => {
//   if (res) {
//     setIslogin(res)
//     storeUser(mobile)
//     setLoading(false)
//     return
//   }
//   console.warn('please register first or check your username and password')
//   setLoading(false)
// })
