module.exports = {
  assets: ["./sources/assets/fonts"],
  dependencies: {
    "@invertase/react-native-apple-authentication": {
      platforms: {
        android: null,
      },
    },
    "@react-native-firebase/app":{
      platforms: {
        android: null,
      },
    },
    "@react-native-firebase/analytics":{
      platforms: {
        android: null,
      }
    },
    "@react-native-firebase/crashlytics":{
      platforms: {
        android: null,
      }
    }
  },
};
