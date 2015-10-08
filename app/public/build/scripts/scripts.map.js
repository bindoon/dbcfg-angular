'use strict';

/**
 * @ngdoc overview
 * @name dashboardApp
 * @description
 * # dashboardApp
 *
 * Main module of the application.
 */
angular
  .module('dashboardApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'textAngular',
    'ui.bootstrap'
  ])
  .config(["$routeProvider", function ($routeProvider) {
    $routeProvider
      .when('/dbcfg/:table', {
        templateUrl: 'views/dbcfg.html',
        controller: 'DbCfgCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);

'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularApp
 */
angular.module('dashboardApp')
  .controller('MainCtrl', ["$scope", function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);

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




angular.module('dashboardApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/about.html',
    "<p>This is the about view.</p>"
  );


  $templateCache.put('views/dbcfg.html',
    "<ol class=breadcrumb><li><a href=#>Home</a></li><li><a href=#>Library</a></li><li class=active>Data</li></ol><button type=button class=\"btn btn-primary btn-sm\" style=\"float: right;\n" +
    "  margin-top: -50px;\n" +
    "  margin-right: 20px\" data-toggle=modal data-target=#myModal>映射配置</button><div class=\"modal fade\" id=myModal tabindex=-1 role=dialog aria-labelledby=myModalLabel aria-hidden=true><div class=modal-dialog style=width:800px><div class=modal-content><div class=modal-header><button type=button class=close data-dismiss=modal aria-label=Close><span aria-hidden=true>&times;</span></button><h5 class=modal-title id=myModalLabel>映射配置</h5></div><div class=modal-body><table class=\"table table-striped\" id=editColumn><thead><tr><th class=tc width=5%><input class=allChoose type=checkbox ng-model=selectAllColumn></th><th>列名称</th><th>映射名称</th><th>类别</th><th>配置</th></tr></thead><tbody><tr ng-repeat=\"column in columns\" class=J-data-list><td class=tc><input type=checkbox ng-checked=selectAllColumn class=J-selected></td><td>{{column.name}}<input type=hidden name=column value={{column.name}}></td><td><input name=mapname value={{column.mapname}}></td><td><select name=ctype><option ng-repeat=\"value in myOptions\" value={{value.id}} ng-selected=\"value.id==column.ctype\">{{value.label}}</option></select></td><td><textarea name=config jsoneditor>{{column.config}}</textarea></td></tr></tbody></table></div><div class=modal-footer><button type=button class=\"btn btn-primary\" data-ok=modal ng-click=saveColumnMap()>保存</button> <button type=button class=\"btn btn-default\" data-dismiss=modal>取消</button></div></div></div></div><div class=search-wrap><div class=search-content><form id=myform_search method=post><table class=\"table table-striped\"><tbody><tr><td ng-repeat=\"column in columns\">{{column.mapname}}:<input name={{column.name}} value={{condition[column.name]}}></td></tr></tbody></table><input class=\"btn btn-primary btn-sm\" value=搜索 type=submit ng-click=searchOnclick()></form></div></div><div class=result-wrap><form name=myform id=myform method=post><div class=result-title><div class=result-list><a ng-click=addDataOnclick() href=javascript:;><i class=icon-font></i>新增数据</a> <a href=javascript:void(0) ng-click=modifyDataOnclick()><i class=icon-font></i>批量更新</a> <a href=javascript:void(0) ng-click=deleteDataOnclick()><i class=icon-font></i>批量删除</a></div></div><div class=result-content><table class=\"table table-striped table-bordered\"><thead><tr><th class=tc width=5%><input class=allChoose type=checkbox ng-model=selectAll></th><th ng-repeat=\"column in columns\">{{column.mapname}}</th></tr></thead><tbody><tr ng-repeat=\"item in list\" class=J-data-list><td class=tc><input type=checkbox ng-checked=selectAll class=J-selected><input type=hidden name=_id value=\"{{item._id}}\"></td><td ng-repeat=\"column in columns\"><input ng-if=\"column.ctype==1\" name={{column.name}} value={{item[column.name]}}><select ng-if=\"column.ctype==2\" name={{column.name}} d={{item[column.name]}}><option ng-repeat=\"value in column.configValue\" value={{value.v}} ng-selected=\"value.v==item[column.name]\">{{value.n}}</option></select><textarea ng-if=\"column.ctype==3\" name={{column.name}} editor ng-click=openEditor(this)>{{item[column.name]}}</textarea></td></tr></tbody></table></div><div class=result-title><div class=result-list><a ng-click=addDataOnclick(); href=javascript:;><i class=icon-font></i>新增数据</a> <a href=javascript:void(0) ng-click=modifyDataOnclick()><i class=icon-font></i>批量更新</a> <a href=javascript:void(0) ng-click=deleteDataOnclick()><i class=icon-font></i>批量删除</a></div></div><pagination total-items=pagination.totalItems ng-hide=\"pagination.totalPage==1\" items-per-page=pagination.itemsPerPage boundary-links=true ng-model=pagination.currentPage ng-change=pageChanged() previous-text=上一页 next-text=下一页 first-text=\"<<\" last-text=\">>\" max-size=10></pagination></form><form name=myform id=myform_add method=post ng-show=showAdd><div class=result-content><table class=\"table table-striped table-bordered\" width=100%><tbody><tr><th class=tc width=5%><input class=allChoose type=checkbox ng-model=selectAllAdd></th><th ng-repeat=\"column in columns\">{{column.mapname}}</th></tr><tr ng-repeat=\"item in [0,1,2]\" class=J-data-list><td class=tc><input type=checkbox ng-checked=selectAllAdd class=J-selected></td><td ng-repeat=\"column in columns\"><input ng-if=\"column.ctype==1\" name={{column.name}} value={{item[column.name]}}><select ng-if=\"column.ctype==2\" name={{column.name}} d={{item[column.name]}}><option ng-repeat=\"value in column.configValue\" value={{value.v}} ng-selected=\"value.v==item[column.name]\">{{value.n}}</option></select><textarea ng-if=\"column.ctype==3\" name={{column.name}} editor></textarea></td></tr></tbody></table></div><button type=button class=\"btn btn-primary btn-lg\" ng-click=submitData()>提交</button> <button type=button class=\"btn btn-default btn-lg\" ng-click=\"showAdd=false\">取消</button></form></div>"
  );


  $templateCache.put('views/editor.html',
    "<div class=\"modal fade\" tabindex=-1 role=dialog aria-labelledby=myModalLabel aria-hidden=true><div class=modal-dialog style=width:1200px><div class=modal-content><div class=modal-header><button type=button class=close data-dismiss=modal aria-label=Close><span aria-hidden=true>&times;</span></button><h5 class=modal-title>内容编辑</h5></div><div class=modal-body><div text-angular ng-model=htmlcontent></div></div><div class=modal-footer><button type=button class=\"btn btn-primary btn-lg\" data-ok=modal ng-click=saveContent()>保存</button> <button type=button class=\"btn btn-default btn-lg\" data-dismiss=modal>取消</button></div></div></div></div>"
  );


  $templateCache.put('views/jsoneditor.html',
    "<div class=\"modal fade\" tabindex=-1 role=dialog aria-labelledby=myModalLabel aria-hidden=true><div class=modal-dialog style=width:1200px><div class=modal-content><div class=modal-header><button type=button class=close data-dismiss=modal aria-label=Close><span aria-hidden=true>&times;</span></button><h5 class=modal-title>内容编辑</h5></div><div class=modal-body><div class=\"json-editor expanded\"></div></div><div class=modal-footer><button type=button class=\"btn btn-default\" data-dismiss=modal>关闭</button></div></div></div></div>"
  );


  $templateCache.put('views/main.html',
    "<div class=jumbotron><h1>'Allo, 'Allo!</h1><p class=lead><img src=images/yeoman.png alt=\"I'm Yeoman\"><br>Always a pleasure scaffolding your apps.</p><p><a class=\"btn btn-lg btn-success\" ng-href=\"#/\">Splendid!<span class=\"glyphicon glyphicon-ok\"></span></a></p></div><div class=\"row marketing\"><h4>HTML5 Boilerplate</h4><p>HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.</p><h4>Angular</h4><p>AngularJS is a toolset for building the framework most suited to your application development.</p><h4>Karma</h4><p>Spectacular Test Runner for JavaScript.</p></div>"
  );


  $templateCache.put('views/msgbox.html',
    "<div class=\"page-notification-wrap page-notification-bottom-right\"><div ng-repeat=\"notify in messages\" ng-show=\"notify.time !== -3\" class=\"page-notification page-notification-{{notify.msg.type}}\"><button ng-show=\"notify.time !==-2\" ng-click=hide($index) class=page-notification-close-button>×</button><div class=page-notification-message ng-bind-html=notify.msg.content></div></div></div>"
  );

}]);
