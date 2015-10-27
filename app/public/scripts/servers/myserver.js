'use strict';

angular.module('dbcfgApp')
  .factory('remoteServer', [ '$rootScope', '$http', '$q', '$routeParams', '$location', function( $rootScope, $http, $q, $routeParams, $location) {


    function postRequest(apiUrl, param) {
      var defer = $q.defer();

      $http({
          method: 'POST',
          url: apiUrl,
          data: param,
          cache: false
        })
        .success(function(data) {
          defer.resolve(data);
        }).error(function() {
          defer.reject();
        });

      return defer.promise;
    }



    return {
      getMenuCfg : function(cb) {
        postRequest('/menucfg',{}).then(function(data){
          cb&&cb(data.result.list);
        })
      },
      submitMenuCfg : function(data,cb) {
        postRequest('/menucfg',{op:'update',data: JSON.stringify(data)}).then(function(data){
          cb&&cb(data);
        })
      }
    }
  }])
