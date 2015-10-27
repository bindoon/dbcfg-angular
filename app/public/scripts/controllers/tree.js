'use strict';

angular.module('dbcfgApp')
    // 树结构控件
    .controller('TreeCtrl', ['$scope', '$rootScope', 'remoteServer', function($scope, $rootScope, remoteServer) {

        var oldDataMap = {};

        remoteServer.getMenuCfg(function(data) {
            $scope.list = data;
            oldDataMap = mapData(angular.copy(data), 0);
        });

        function newNode(id, title) {
            return {
                action: 'create',
                id: id,
                title: title,
                items: []
            }
        }

        $scope.editItem = function(scope) {
            $scope.itemShow = scope.$modelValue;

            $('#inputTitle').val($scope.itemShow.title);
            $('#inputLink').val($scope.itemShow.link);
            $('#selectTarget').val($scope.itemShow.target);

            $('.angular-ui-tree-handle').removeClass('active');
            scope.$element.addClass('active');
        }

        $scope.toggle = function(scope) {
            scope.toggle();
        };


        $scope.newItem = function(scope) {
            $scope.list.push(newNode((new Date()).getTime() + '-'  + ($scope.list.length + 1), '新节点-' + ($scope.list.length + 1)));
        };

        $scope.newSubItem = function(scope) {
            var nodeData = scope.$modelValue;

            nodeData.items = nodeData.items ||[];
            nodeData.items.push(newNode((new Date()).getTime() + '-' + (nodeData.items.length + 1), '新节点-' + (nodeData.items.length + 1)));
        };

        $scope.remove = function(scope) {
            scope.remove();
        };

        $scope.saveItem = function() {
            if (!$scope.itemShow.action) {
                $scope.itemShow.action = 'update';
            };
            $scope.itemShow.title = $('#inputTitle').val();
            $scope.itemShow.link = $('#inputLink').val();
            $scope.itemShow.target = $('#selectTarget').val();
        }

        function mapData(items, parentid) {
            var dataMap = {};
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                item.parentid = parentid;
                item.order = i + 1;

                delete item.$$hashKey;

                dataMap[item.id] = item;
                if (item.items && item.items.length) {
                    dataMap = $.extend(dataMap, mapData(item.items, item.id));
                };
            };
            return dataMap;
        }

        function onMsgBox(msg,type) {
            $rootScope.$broadcast('msgBox', {
                msg: {
                    content: msg||"更新成功",
                    type: type||"error"
                },
                time: 3000,
            });
        }

        $scope.saveAll = function() {
            var newDataMap = mapData($scope.list, 0);
            var changelist = [];

            for (var i in newDataMap) { //create or update
                var item = newDataMap[i];
                if (item.action) {
                    changelist.push(item);
                } else if (i in oldDataMap) {   //删除或者移动引起的顺序调整
                    var olditem = oldDataMap[i];
                    if (item.parentid != olditem.parentid || item.order != olditem.order) {
                        item.action = 'update';
                        changelist.push(item);
                    };
                }
            }
            for (var i in oldDataMap) {
                if (!(i in newDataMap)) {
                    var item = oldDataMap[i];
                    item.action = 'delete';
                    changelist.push(oldDataMap[i]);
                };
            }

            remoteServer.submitMenuCfg(changelist,function(json){
                if (json.code == 0) {
                    onMsgBox('更新成功','success');
                };
            })
            console.log(changelist);
        };
    }])
