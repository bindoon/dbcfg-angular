'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularApp
 */
angular.module('dashboardApp')
  .controller('DbCfgCtrl', ['$scope','$rootScope','$http','$q','$routeParams','$location' ,function ($scope, $rootScope, $http, $q,$routeParams,$location) {

    // $scope.htmlcontent = 'test';
    //         $scope.disabled = false;

        $rootScope.checkActive   = function(currentActiveRoute, route){
            if(route === '/'){
                return currentActiveRoute === route;
            }else{
                return new RegExp('^'+ route, 'i').test(currentActiveRoute);
            }
        };
        $rootScope.currentActiveRoute    = $location.path();
        //监听路由变化
        $rootScope.$on('$routeChangeSuccess', function() {
            $scope.currentActiveRoute  = $location.path();
        });

        var apiUrl = 'http://'+location.host.split(':')[0]+':3000/dbcfg';
        $scope.condition = {};
        $scope.pagination = {
            totalItems:0,
            currentPage: 1,
            totalPage:1
        }
        $scope.showAdd = false;

        $scope.myOptions = [
            {
                "id": 1,
                "label": "输入框"
            },
            {
                "id": 2,
                "label": "选择框"
            },
            {
                "id": 3,
                "label": "富文本编辑"
            }
        ];

        function onMsgBox(msg,type) {
            $rootScope.$broadcast('msgBox', {
                msg: {
                    content: msg||"更新成功",
                    type: type||"error"
                },
                time: 3000,
            });
        }
        function dealData(param){
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
        function queryData() {
            dealData({
                op:'query',
                table: $routeParams.table,
                condition:JSON.stringify($scope.condition),
                pagination:JSON.stringify($scope.pagination),
            }).then(function(data){
                if (data.result) {
                    var columns = data.result.columns;
                    for (var i = 0; i < columns.length; i++) {
                        var column = columns[i];
                        column.ctype = column.ctype||1;
                    };

                    $scope.columns = columns;
                    $scope.list = data.result.list;
                    $scope.condition = data.result.condition;
                    $scope.pagination = data.result.pagination;
                    $scope.showAdd = false;
                } else {
                    onMsgBox(data.error.msg,'error');
                }
            });
        }
        queryData();

        $scope.addDataOnclick = function() {
            $scope.showAdd=true;
            $scope.selectAllAdd = true;
            setTimeout(function(){
                $("body").animate({scrollTop:$("#myform_add").offset().top},500);
            },10);
        }

        function getSelectList(formid) {
            var list = [];
            $('#'+formid+' .J-data-list').each(function(){
                var data = {};
                var checkbox = $(this).find('input.J-selected');
                if (!checkbox.prop('checked')) {
                    return;
                };
                $(this).find('input,select,textarea').each(function(){
                    var name = $(this).attr('name');
                    if (!name) {
                        return;
                    };
                    var val = $(this).val();
                    data[name]=val;
                });
                list.push(data);
            });
            return list;
        }

        $scope.modifyDataOnclick = function(){
            var list = getSelectList('myform');
            if (list.length==0) {
                onMsgBox('请勾选需要更新的行');
                return;
            };

            dealData({
                op:'update',
                table:  $routeParams.table,
                list:JSON.stringify(list)
            }).then(function(data){
                if (data.result&&data.result.code==0) {
                    onMsgBox(data.result.msg,'success');
                    queryData();
                };
            })
        }

        $scope.deleteDataOnclick = function(){
            var list = getSelectList('myform');
            if (list.length==0) {
                onMsgBox('请勾选需要删除的行');
                return;
            };

            dealData({
                op:'delete',
                table:  $routeParams.table,
                list:JSON.stringify(list)
            }).then(function(data){
                if (data.result&&data.result.code==0) {
                    onMsgBox(data.result.msg,'success');
                    queryData();
                };
            })
        }

        $scope.submitData = function(){
            var list = getSelectList('myform_add');
            if (list.length==0) {
                onMsgBox('请至少勾选一个需要添加的数据');
                return;
            };

            dealData({
                op:'insert',
                table:  $routeParams.table,
                list:JSON.stringify(list)
            }).then(function(data){
                if (data.result&&data.result.code==0) {
                    onMsgBox(data.result.msg,'success');
                    queryData();
                } else {
                    onMsgBox(data.error.msg,'error');
                }
            })
        }

        $scope.searchOnclick = function(){
            $scope.condition = {};
            $('#myform_search input').each(function(){
                var name = $(this).attr('name');
                if (!name) {
                    return;
                };
                var val = $(this).val();
                if (val) {
                    $scope.condition[name]=val;
                };
            });

            queryData();
        }

        $scope.saveColumnMap = function() {
            var list = getSelectList('editColumn');
            if (list.length==0) {
                onMsgBox('请至少勾选一个需要修改的数据');
                return;
            };

            dealData({
                op:'dbcfg',
                table:$routeParams.table,
                list:JSON.stringify(list)
            }).then(function(data){
                if (data.result&&data.result.code==0) {
                    onMsgBox(data.result.msg,'success');
                    queryData();
                } else {
                    onMsgBox(data.error.msg,'error');
                }
            })
        }

        $scope.pageChanged = function() {
            queryData();
        }
  }]);
