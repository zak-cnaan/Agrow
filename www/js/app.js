var db = null;

angular.module('myapp', ['ionic', 'myapp.controllers', 'myapp.services', 'ngCordova'])

    .run(function($ionicPlatform, $cordovaSQLite) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }


            if(window.cordova) {
                // App syntax
                db = $cordovaSQLite.openDB("myapp1.db");
            } else {
                // Ionic serve syntax
                db = window.openDatabase("myapp1.db", "1.0", "My app", -1);
            }

            //$cordovaSQLite.execute(db, "DROP TABLE team");

            /*$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS  team (id integer primary key, name text)")*/
            $cordovaSQLite.execute(db, "SELECT name FROM sqlite_master WHERE name='team'")
                .then(function (result) {
                    if(result.rows.length == 0){
                        $cordovaSQLite.execute(db, "CREATE TABLE team (id integer primary key, name text)")
                            .then (function (){
                            var values = [
                                {id: 1, name: "zak"},
                                {id: 2, name: "cnaan"}
                            ]
                            for (var i=0;i<values.length;++i){
                                var parameters = [values[i].id, values[i].name];
                                $cordovaSQLite.execute(db, "INSERT INTO team (id, name) VALUES (?,?)", parameters)
                            }

                        });
                    }
                })
        });
    })

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
   /* .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })*/

  // Each tab has its own nav history stack:
      .state('team-index', {
          url: '/team',
          templateUrl: 'templates/team/list.html',
          cache: false,
          controller: 'TeamCtrl'
      })
      .state('team-item', {
          url: '/team/:id',
          templateUrl: 'templates/team/item.html',
          controller: 'TeamCtrl'
      })
      .state('team-edit', {
          url: '/team/edit/:id',
          templateUrl: 'templates/team/edit.html',
          controller: 'TeamCtrl'
      })
  /*.state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });*/

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/team');

});
