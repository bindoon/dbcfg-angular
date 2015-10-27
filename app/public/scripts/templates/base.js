angular.module('dbcfgApp').run(['$templateCache', function($templateCache) {
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


  $templateCache.put('views/menu.html',
    "<div class=sidebar-wrap><div class=sidebar-title><h1>菜单</h1></div><div class=sidebar-content><ul ng-cloak class=sidebar-list><li ng-repeat=\"route in routes\"><a href=javascript:;>{{route.name}}</a><ul class=sub-menu ng-if=route.subroutes><li ng-repeat=\"subroute in route.subroutes\" class={{subroute.class}} ng-class=\"{'on':checkActive(currentActiveRoute, subroute.router)}\"><a ng-href=#{{subroute.router}}>{{subroute.name}}</a></li></ul></li></ul></div></div>"
  );


  $templateCache.put('views/msgbox.html',
    "<div class=\"page-notification-wrap page-notification-bottom-right\"><div ng-repeat=\"notify in messages\" ng-show=\"notify.time !== -3\" class=\"page-notification page-notification-{{notify.msg.type}}\"><button ng-show=\"notify.time !==-2\" ng-click=hide($index) class=page-notification-close-button>×</button><div class=page-notification-message ng-bind-html=notify.msg.content></div></div></div>"
  );


  $templateCache.put('views/tree.html',
    "<div class=col-lg-6><div class=page-header><h1>目录树 <small>拖拽点击编辑</small></h1></div><a href=javascript:; ng-click=newItem()>新增根节点</a><script type=text/ng-template id=items_renderer.html><div ui-tree-handle >\n" +
    "    <a class=\"btn  btn-xs\" data-nodrag ng-click=\"toggle(this)\"><span class=\"glyphicon\" ng-class=\"{'glyphicon-chevron-right': collapsed, 'glyphicon-chevron-down': !collapsed}\"></span></a>\n" +
    "    {{item.title}}\n" +
    "    <a class=\"pull-right btn btn-danger btn-xs\" data-nodrag ng-click=\"remove(this)\"><span class=\"glyphicon glyphicon-remove\"></span></a>\n" +
    "    <a class=\"pull-right btn btn-primary btn-xs\" data-nodrag ng-click=\"newSubItem(this);\" style=\"margin-right: 8px;\"><span class=\"glyphicon glyphicon-plus\"></span></a>\n" +
    "    <a class=\"pull-right btn btn-success btn-xs\" data-nodrag ng-click=\"editItem(this)\" style=\"margin-right: 8px;\"><span class=\"glyphicon glyphicon-edit\"></span></a>\n" +
    "  </div>\n" +
    "  <ol ui-tree-nodes=\"options\" ng-model=\"item.items\" ng-class=\"{hidden: collapsed}\">\n" +
    "    <li ng-if=\"item.items\" ng-repeat=\"item in item.items\" ui-tree-node ng-include=\"'items_renderer.html'\">\n" +
    "    </li>\n" +
    "  </ol></script><div ui-tree=options><ol ui-tree-nodes ng-model=list><li ng-repeat=\"item in list\" ui-tree-node ng-include=\"'items_renderer.html'\"></li></ol></div></div><div class=col-lg-6><div class=page-header><h1>节点信息 <small>详细信息</small></h1></div><form ng-if=itemShow.id class=form-horizontal style=\"background-color: #f5f5f5;padding: 9.5px;border: 1px solid #ccc\"><div class=form-group><label for=inputTitle class=\"col-sm-2 control-label\">标题</label><div class=col-sm-10><input id=inputTitle class=form-control data-text={{itemShow.title}} value={{itemShow.title}} placeholder=title></div></div><div class=form-group><label for=inputLink class=\"col-sm-2 control-label\">链接</label><div class=col-sm-10><input class=form-control id=inputLink value={{itemShow.link}} placeholder=\"\"></div></div><div class=form-group><label for=target class=\"col-sm-2 control-label\">打开方式</label><div class=col-sm-10><select id=selectTarget value={{itemShow.target}}><option value=0>本窗口</option><option value=1>新窗口</option></select></div></div><div class=form-group><div class=\"col-sm-offset-2 col-sm-10\"><button type=submit class=\"btn btn-default\" ng-click=saveItem()>保存</button></div></div></form></div><div class=col-lg-12><button type=button class=\"btn btn-primary\" data-ok=modal ng-click=saveAll()>保存</button></div>"
  );

}]);
