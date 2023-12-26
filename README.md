# Foams mobile app

The iOS and Android mobile application for the Foams platform. Built with React Native.

## Requirements

For local development, at a minimum you will need a macOS machine to build/run the app for iOS. To build/run for Android, macOS, Windows, or Linux can be used.

## Getting started

Follow the [React Native "Getting Started" instructions](http://reactnative.dev/docs/getting-started):
- Select the **"React Native CLI Quickstart"** option
- Select your **"Development OS"**: macOS, Windows, or Linux
- Select your **"Target OS"**: iOS or Android
- Follow the instructions to install/setup the dependencies

## Install
    $ npm install
    $ cd ios
    $ pod install
    $ cd ..

## Running the project

### iOS
You must be using a Mac.
How you run the project for iOS depends on the Mac processor:
- Intel Mac
    - A. Run from Terminal:
        - Run `npx react-native run-ios`
        - This should open Metro in a new Terminal, and open the simulator to run the app
    - B. Run from Xcode:
        - Open the workspace file for the project, and run the app through Xcode
- Apple Silicon (M1/M2) Mac
    - On Apple Silicon Macs you may get an error: *'"launchPackager.command” can’t be opened because (null) is not allowed to open documents in Terminal.'*
    - If so, first you'll need to start Metro by double-clicking to run the `launchPackager.command` file manually, found at `'node_modules' > 'react-native' > 'scripts'`
    - Then open the workspace file for the project, and run the app through Xcode running in Rosetta (Google it)

### Android 
    $ npx react-native run-android
* A file called  **launchPackager.command** should be automatically opened in a command window to run Metro (if it gets opened in a text editor you'll need to run in manually).

## Deploying the project

### iOS
1. Open the project in Xcode (via `ios` folder)
2. Bump the build version
    - From Xcode, select the 
3. 'Archive' (build) the app
    - From Xcode, go to 'Product' -> 'Archive'
    - Make sure you have the required certs and provisioning profiles on your machine
4. Upload the build to Apple Connect
    - From Xcode, go to 'Window' -> 'Organizer'

### Android 
Run the following:
    
    $ cd android
    $ ./gradlew bundleRelease

The file that can be uploaded to the [Google Play Console](https://play.google.com) will be generated to:<br />
`~/android/app/build/outputs/bundle/release/app-release.aab`

Make sure you have the required private signing cert on your machine and is pointed to in the local gradle properties file.
More instructions are are in the React Native ["Publishing to Google Play Store" documentation](http://reactnative.dev/docs/signed-apk-android).
