
# INSTALL and RUNNING 

1. git clone https://github.com/timoweave/mobile_class.git [assign2](https://github.com/timoweave/mobile_class.git) 
1. cd ionic/conFusion
1. npm run images-server (python -m SimpleHTTPServer ...)
1. npm run ionic-lab (APP, ios+android) or npm run ionic-ios or npm run ionic-android
1. browser will open the app (should have launched on your browser)

# EMULATING on IOS

1. ionic build ios
1. ionic emulate ios

# NOTE

1. add resolve, localstorage
1. add icon to the menu (left-menu)
1. add Popup, loading, hiding (done loading), and timeout to simulte async...
   (SPA should be fast, and does not need to do it. Just a sample of making use of services.js)
1. ionic cannot let you turn on the ionic-delete-button for just one ion-item of a
   ion-list in ion-content. even if I try ng-show it.... (tl;dr)
