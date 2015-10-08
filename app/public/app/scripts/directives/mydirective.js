'use strict';

/**
 * @ngdoc directive
 * @name taeDashboardApp.directive:myDirective
 * @description
 * # myDirective
 */
angular.module('dashboardApp')
    .directive('msgBox', ['$rootScope','$timeout', '$sce', function ($rootScope,$timeout,$sce) {
        return {
            restrict: 'A',
            scope: true,
            transclude: true,
            replace: true,
            templateUrl: 'views/msgbox.html',

            link: function (scope,element,attrs) {
                scope.messages = [];//历史消息
                scope.hide = function (index) {
                    scope.messages[index].time = -3;
                };

                //监听全局消息
                /**
                 *   {
                 *      key:"unique", 消息的唯一标示, 通常在有些消息需要手动程序通知其关闭的时候用到，比如上传文件需要不定期的等待。否则可以为空
                 *       msg:{
                 *           content:消息具体信息,
                 *           type:error/success/warning/info, 消息类型
                 *      }
                 *      time:-1/-2/-3/>1 大于1为默认time后消息消失，-1等待用户手动关闭，-2 等待程序通知 -3 为关闭状态,指令内部使用
                 *   }
                 */
                $rootScope.$on('msgBox', function (event, notify, order) {
                    if (!order || order == "show") {
                        // console.log('show');
                        notify.msg.content = $sce.trustAsHtml(notify.msg.content);
                        // console.log(notify);

                        if (notify.key != ''){
                            // console.log('this is a unique msg');
                            var found=false;
                            for (var i = 0; i < scope.messages.length; i++) {
                                if (scope.messages[i].key === notify.key) {
                                    found=true;
                                    scope.messages[i].time = notify.msg.time;
                                    scope.messages[i].msg.content = notify.msg.content;
                                    if (notify.time > 0) {
                                        $timeout(function () {
                                            scope.messages[i].time = -3;
                                        }, notify.time);
                                    }
                                    break;
                                }
                            }
                            if (!found){
                                scope.messages.push(notify);
                                // console.log($scope.messages);
                                var index = scope.messages.length - 1;
                                if (notify.time > 0) {
                                    // console.log(notify.time);
                                    $timeout(function () {
                                        scope.messages[index].time = -3;
                                    }, notify.time)
                                }
                            }
                        }
                        else {
                            scope.messages.push(notify);
                            // console.log($scope.messages);
                            var index = scope.messages.length - 1;
                            if (notify.time > 0) {
                                // console.log(notify.time);
                                $timeout(function () {
                                    scope.messages[index].time = -3;
                                }, notify.time)
                            }
                        }
                    } else if (order && order == "hide") {
                        // console.log('hide');
                        for (var i = 0; i < scope.messages.length; i++) {
                            if (scope.messages[i].key === notify.key) {
                                scope.messages[i].time = -3;
                            }
                        }
                    }

                });
            }
        }
    }])
    .directive('dateptimepicker', ['$cacheFactory','$filter',
        function($cacheFactory,$filter) {
            return {
                restrict: 'A',
                require: '?ngModel',
                scope: {
                    select: '&',
                    startTime: '=',
                    endTime: '='
                },
                link: function(scope, element, attrs, ngModel) {
                    if (!ngModel) return;

                    var optionsObj = {
                        format: 'Y-m-d',
                        lang: 'ch',
                        timepicker: false,
                        maxDate: $filter('date')(new Date(),'yyyy/MM/dd')
                    };

                    //startDate和endDate配合使用
                    optionsObj.onShow = function(ct){
                        if(scope.startTime && scope.startTime != ""){
                            var st = scope.startTime.split(" ");
                            if(st[0]){
                                var min = st[0].replace(/-/g, '/');
                                var max = new Date(min).getTime() + (90*24*60*60*1000);
                                if(max>new Date().getTime()){
                                    max = new Date().getTime();
                                }
                                this.setOptions({
                                    minDate: min,
                                    maxDate: $filter('date')(new Date(max),'yyyy/MM/dd')
                                })
                            }
                        }
                        if(scope.endTime && scope.endTime != ""){
                            var st = scope.endTime.split(" ");
                            if(st[0]){
                                var max = st[0].replace(/-/g, '/');
                                this.setOptions({
                                    maxDate: max,
                                    minDate: $filter('date')(new Date(new Date(max).getTime() - (90*24*60*60*1000)),'yyyy/MM/dd')
                                })
                            }
                        }
                    }

                    var updateModel = function(dateTxt) {
                        scope.$apply(function(){
                            ngModel.$setViewValue(dateTxt);
                        });
                    };

                    optionsObj.onSelectDate = function(dateTxt, input$) {
                        updateModel(dateTxt.dateFormat('Y-m-d'));
                        if (scope.select){
                            scope.$apply(function(){
                                scope.select({datetime: dateTxt.dateFormat('Y-m-d')});
                            })
                        }
                        // console.log(dateTxt.dateFormat('Y-m-d H:i'));
                    };

                    optionsObj.onSelectTime = function(timeTxt, input$) {
                        updateModel(timeTxt.dateFormat('Y-m-d'));
                        if (scope.select){
                            scope.$apply(function(){
                                scope.select({datetime: timeTxt.dateFormat('Y-m-d')});
                            })
                        }
                        // console.log(timeTxt.dateFormat('Y-m-d H:i'));
                    };

                    ngModel.$render = function(){
                        if(ngModel.$viewValue == ""){
                            element.val("");
                        }else{
                            element.datetimepicker({value: ngModel.$viewValue || '', format: 'Y-m-d'});
                        }
                    };
                    element.datetimepicker(optionsObj);
                }
            }
        }
    ])
    .directive('editorContainer',['$rootScope',function(rootScope){
        return {
            restrict: 'A',
            scope: true,
            replace:true,
            templateUrl: 'views/editor.html',

            link: function ($scope,element,attrs) { 

                $scope.target = null;
                //确认按钮
                $scope.saveContent=  function(){
                    $scope.target.val($scope.htmlcontent);
                    $scope.disabled = true;
                };
                rootScope.$on('showEditor',function(event, target) {
                    element.modal('show');
                    $scope.target = target;
                    $scope.htmlcontent = target.val();
                    $scope.disabled = false;
                })
            }
        }
    }])
    .directive('editor', ['$rootScope',function(rootScope){
        return {
            restrict: 'A',
            scope: true,
            link: function (scope, element, attrs, editorContainer) { 
                element.on('click',function(){
                    rootScope.$broadcast('showEditor',element);
                })
            }
        }
    }])
    .directive('jsoneditorContainer',['$rootScope',function(rootScope){
        return {
            restrict: 'A',
            scope: true,
            replace:true,
            templateUrl: 'views/jsoneditor.html',

            link: function ($scope,element,attrs) { 

                rootScope.$on('showjsonEditor',function(event, target) {
                    element.modal('show');
                    var json = JSON.parse(target.val());
                    element.find('.json-editor').jsonEditor(json,{ change: function(newjson) {  
                        target.val(JSON.stringify(newjson));  
                    }});
                })
            }
        }
    }])
    .directive('jsoneditor', ['$rootScope',function(rootScope){
        return {
            restrict: 'A',
            scope: true,
            link: function (scope, element, attrs, editorContainer) { 
                element.on('click',function(){
                    rootScope.$broadcast('showjsonEditor',element);
                })
            }
        }
    }])

;



