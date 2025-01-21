use node 14


build for windows:

- Install node js
- Install python
- Install node-gyp

npm install -g node-gyp

npm install --global --production windows-build-tools

-- GIT CONFIG

git check-attr --all 'path file'

.gitattributes

- text eol=lf
  _.png binary
  _.jpg binary
  _.jpeg binary
  _.ico binary
  _.icns binary
  _.gif binary //add gif to binary

---

FOR MAC STORE
entities.plist required app sand box = true
electron react boiltplate cannot use sand box = true mode

"target": [
"mas"
],
"entitlements": "MAC_KEY/entitlements.mas.plist",
"provisioningProfile": "MAC_KEY/embedded.provisionprofile",
"category": "public.app-category.business",
"type": "distribution"

---

FOR electron v8
yarn upgrade electron-rebuild

LINUX: sudo apt install pkg-config

sudo apt-get install libdeb dev cho keytar package

---

Kill process linux app image

ps -ef | grep hanbiro
pkill -9 hanbiro-talk

OPEN QUICK AUTOUPDATE

open HanbiroTalk.app --args auto_update_only

new package
resize-observer-polifill
lru-cache
yarn add axios-extensions

https://webspaceteam.com/electron/how-to-publish-an-electron-application-to-mac-app-store
Go to Certificates, Identifiers & Profiles section at developers.apple.com. At Identifiers section Add new App ID for macOS platform.

Next go to Profiles and create new Provisioning profile for Mac App Store distribution.

Download created profile and place to build folder inside your application source folder. Name it as embedded.provisionprofile

Go to App Store Connect and select My Apps. Add New macOS App.

Select registered on the previous step Bundle ID.

Provide all required information.

Inside build folder create entitlements.mas.plist with at least the following entitlements:

CHANGE name in package.json -> hanbiro-talk to crm-call for updater folder
