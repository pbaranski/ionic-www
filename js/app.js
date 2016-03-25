// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'restangular', 'ngStorage', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

}
).run(
    function ($rootScope, $http, $localStorage) {
        // Update request headers if user credentials are present in local storage
        if ($localStorage.authentication_username && $localStorage.authentication_api_key) {
            $http.defaults.headers.common.Authorization = 'ApiKey ' +
                $localStorage.authentication_username + ':' + $localStorage.authentication_api_key;
        }
    }
).run(
    function ($rootScope) {
        // Save local settings to rootScope
        $rootScope.localSettings = $$localSettings;
    }
).config(
    function ($httpProvider, RestangularProvider) {
        var backendDomain = null;
        if ($$localSettings.rawBackendDomain) {
            backendDomain = $$localSettings.rawBackendDomain + '/api/v1'
        } else {
            backendDomain = $$localSettings.backendDomain + '/api/v1'
        }
        RestangularProvider.setBaseUrl(backendDomain);
        RestangularProvider.setOnElemRestangularized(
            function(elem, isCollection, route) {
                elem.addRestangularMethod('getMetaList', 'get');
                return elem;
            }
        );
        RestangularProvider.addResponseInterceptor(
            function (data, operation, what, url, response, deferred) {
                // Making sure getList gives us array
                if (operation === 'getList') {
                    return response.data.objects ? response.data.objects : response.data;
                }
                return response.data;
            }
        );
        RestangularProvider.addFullRequestInterceptor(
            function (element, operation, what, url, headers) {
                if (localStorage['ngStorage-authentication_api_key'] && localStorage['ngStorage-authentication_username']) {
                    headers.Authorization = 'ApiKey ' + localStorage['ngStorage-authentication_username'].replace(/"/g,"") + ':' + localStorage['ngStorage-authentication_api_key'].replace(/"/g,"");
                }
                return {'headers': headers}
            }
        )
    }
)
.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
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
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
