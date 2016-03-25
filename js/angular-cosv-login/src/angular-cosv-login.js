/**
 *
 * Standard angular login service for cosvauth backend API service.
 *
 * Example usage:
 *
 *  angular.module('mymodule', ['ngCosvLogin']).controller('MyController' function(cosvLogin) {
 *      cosvLogin(
 *          // login
 *          'bart'
 *          // password
 *          '123123'
 *          // Success Callback
 *          function (JSONDataFromServer) {
 *              alert('Welcome ' + JSONDataFromServer.username);
 *              $location.path('home');
 *          },
 *          // Failure Callback
 *          function (responseFromServer) {
 *              alert('Email or password incorrect')
 *          }
 *      ).finally(
 *          $scope.showLoadingIcon = false
 *      )
 *  }
 *
 *  Sets varibles in $localStorage:
 *  - authentication_username
 *  Private value - no need to ever use outside of the service.
 *
 *  - authentication_api_key
 *  Private value - no need to ever use outside of the service.
 *
 *  - authentication_user_id
 *  Id of currently logged user - useful when making backend requests
 *
 *  - authentication_candidate_id
 *  Id of currently logged candidate - useful when making backend requests
 *
 *  - authentication_is_email_verified
 *  Boolean value saying whether currently logged user has confirmed email address
 *
 */
angular.module('ngCosvLogin', ['ngStorage', 'restangular']).service(
    "cosvLogin",
    function ($http, $localStorage, Restangular) {
        return function (email, password, successCallback, failureCallback) {
            var cosvauth = Restangular.all('cosvauth');
            var user = cosvauth.all('user');
            return user.all('login').post(
                {
                    email: email,
                    password: password
                }
            ).then(
                // Success
                function (JSONDataFromServer) {
                    $localStorage.authentication_username = JSONDataFromServer.username;
                    $localStorage.authentication_api_key = JSONDataFromServer.api_key;
                    $localStorage.authentication_user_id = JSONDataFromServer.user_id;
                    $localStorage.authentication_candidate_id = JSONDataFromServer.candidate_id;
                    $localStorage.authentication_is_email_verified = JSONDataFromServer.is_email_confirmed;
                    $localStorage.authentication_email = JSONDataFromServer.email;
                    $http.defaults.headers.common.Authorization =
                        'ApiKey ' + JSONDataFromServer.username + ':'
                            + JSONDataFromServer.api_key;
                    successCallback(JSONDataFromServer)
                },
                // Failure
                function (responseFromServer) {
                    failureCallback(responseFromServer)
                }
            )
        };
    }
);