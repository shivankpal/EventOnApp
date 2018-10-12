cd android && ./gradlew assembleRelease --console plain
cd ..
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ~/Desktop/key/zootout.keystore -storepass zootout android/app/build/outputs/apk/app-release-unsigned.apk zootout
zipalign -f -v 4 android/app/build/outputs/apk/app-release-unsigned.apk android/app/build/outputs/apk/app-release.apk