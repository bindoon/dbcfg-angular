(function(n){function A(a){for(var a=a.toUpperCase(),c=0,b=0,d=B.length;b<d;++b)for(var f=B[b],e=f[1].length;a.substr(0,e)==f[1];a=a.substr(e))c+=f[0];return c}function C(a){for(var a=a.toUpperCase(),c=D.length,b=1,d=1;0<a.length;d*=c)b+=D.indexOf(a.charAt(a.length-1))*d,a=a.substr(0,a.length-1);return b}var j=n.Editor,E=j.$,l=j.dtd,z=j.utils,F=function(){var a=this.children;return 1==a.length&&a[0]||null},G=function(a){for(var c,b=0,d=this.children.length;b<d;b++){c=this.children[b];if(a(c)||c.name&&
(c=c.firstChild(a)))return c}return null};j.htmlParser.fragment.implement({firstChild:G,onlyChild:F});j.htmlParser.element.implement({firstChild:G,onlyChild:F,addStyle:function(a,c,b){var d="";if("string"===typeof c)d+=a+":"+c+";";else{if("object"===typeof a)for(var f in a)a.hasOwnProperty(f)&&(d+=f+":"+a[f]+";");else d+=a;b=c}if(!this.attributes)this.attributes={};a=this.attributes.style||"";a=(b?[d,a]:[a,d]).join(";");this.attributes.style=a.replace(/^;|;(?=;)/,"")},getAncestor:function(a){for(var c=
this.parent;c&&(!c.name||!c.name.match(a));)c=c.parent;return c},removeAnyChildWithName:function(a){for(var c=this.children,b=[],d,f=0;f<c.length;f++)d=c[f],d.name&&(d.name==a&&(b.push(d),c.splice(f--,1)),b=b.concat(d.removeAnyChildWithName(a)));return b}});l.parentOf=function(a){var c={},b;for(b in this)-1==b.indexOf("$")&&this[b][a]&&(c[b]=1);return c};var J=/^([.\d]*)+(em|ex|px|gd|rem|vw|vh|vm|ch|mm|cm|in|pt|pc|deg|rad|ms|s|hz|khz){1}?/i,H=/^(?:\b0[^\s]*\s*){1,4}$/,u={ol:{decimal:/\d+/,"lower-roman":/^m{0,4}(cm|cd|d?c{0,3})(xc|xl|l?x{0,3})(ix|iv|v?i{0,3})$/,
"upper-roman":/^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/,"lower-alpha":/^[a-z]+$/,"upper-alpha":/^[A-Z]+$/},ul:{disc:/[l\u00B7\u2002]/,circle:/[\u006F\u00D8]/,square:/[\u006E\u25C6]/}},B=[[1E3,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]],D="ABCDEFGHIJKLMNOPQRSTUVWXYZ",v,w=0,r=null,I=j.plugins.pastefromword={utils:{createListBulletMarker:function(a,c){var b=new j.htmlParser.element("kse:listbullet");b.attributes=
{"kse:listsymbol":a[0]};b.add(new j.htmlParser.text(c));return b},isListBulletIndicator:function(a){if(/mso-list\s*:\s*Ignore/i.test(a.attributes&&a.attributes.style))return!0},isContainingOnlySpaces:function(a){return(a=a.onlyChild())&&/^(:?\s|&nbsp;)+$/.test(a.value)},resolveList:function(a){var c=a.attributes,b;if((b=a.removeAnyChildWithName("kse:listbullet"))&&b.length&&(b=b[0])){a.name="kse:li";if(c.style)c.style=I.filters.stylesFilter([["text-indent"],["line-height"],[/^margin(:?-left)?$/,null,
function(a){a=a.split(" ");a=z.convertToPx(a[3]||a[1]||a[0]);!w&&null!==r&&a>r&&(w=a-r);r=a;c["kse:indent"]=w&&Math.ceil(a/w)+1||1}],[/^mso-list$/,null,function(a){var a=a.split(" "),b=Number(a[0].match(/\d+/)),a=Number(a[1].match(/\d+/));1==a&&(b!==v&&(c["kse:reset"]=1),v=b);c["kse:indent"]=a}]])(c.style,a)||"";c["kse:indent"]||(r=0,c["kse:indent"]=1);Object.merge(c,b.attributes);return!0}v=r=w=null;return!1},getStyleComponents:function(){var a=j.document,c=n.DOM.create('<div style="position:absolute;left:-9999px;top:-9999px;"></div>',
a);a.body().append(c);return function(a,d,f){c.style(a,d);for(var a={},d=f.length,e=0;e<d;e++)a[f[e]]=c.style(f[e]);return a}}(),listDtdParents:l.parentOf("ol")},filters:{flattenList:function(a,c){var c="number"===typeof c?c:1,b=a.attributes,d;switch(b){case "a":d="lower-alpha";break;case "1":d="decimal"}for(var f=a.children,e,g=0;g<f.length;g++)if(e=f[g],e.name in l.$listItem){var i=e.attributes,h=e.children,j=h[h.length-1];j.name in l.$list&&(a.add(j,g+1),--h.length||f.splice(g--,1));e.name="kse:li";
b.start&&!g&&(i.value=b.start);I.filters.stylesFilter([["tab-stops",null,function(a){(a=a.split(" ")[1].match(J))&&(r=z.convertToPx(a[0]))}],1==c?["mso-list",null,function(a){a=a.split(" ");a=Number(a[0].match(/\d+/));a!==v&&(i["kse:reset"]=1);v=a}]:null])(i.style);i["kse:indent"]=c;i["kse:listtype"]=a.name;i["kse:list-style-type"]=d}else if(e.name in l.$list){arguments.callee.apply(this,[e,c+1]);f=f.slice(0,g).concat(e.children).concat(f.slice(g+1));a.children=[];e=0;for(h=f.length;e<h;e++)a.add(f[e])}delete a.name;
b["kse:list"]=1},assembleList:function(a){for(var c=a.children,b,d,f,e,g,i,a=[],h,x,o,k,m,q,p=0;p<c.length;p++)if(b=c[p],"kse:li"==b.name)if(b.name="li",d=b.attributes,o=(o=d["kse:listsymbol"])&&o.match(/^(?:[(]?)([^\s]+?)([.\u3001)]?)$/),k=m=q=null,d["kse:ignored"])c.splice(p--,1);else{d["kse:reset"]&&(i=e=g=null);f=Number(d["kse:indent"]);f!=e&&(x=h=null);if(o){if(x&&u[x][h].test(o[1]))k=x,m=h;else for(var l in u)for(var s in u[l])if(u[l][s].test(o[1]))if("ol"==l&&/alpha|roman/.test(s)){if(h=/roman/.test(s)?
A(o[1]):C(o[1]),!q||h<q)q=h,k=l,m=s}else{k=l;m=s;break}!k&&(k=o[2]?"ol":"ul")}else k=d["kse:listtype"]||"ol",m=d["kse:list-style-type"];x=k;h=m||("ol"==k?"decimal":"disc");m&&m!=("ol"==k?"decimal":"disc")&&b.addStyle("list-style-type",m);if("ol"==k&&o){switch(m){case "decimal":q=Number(o[1]);break;case "lower-roman":case "upper-roman":q=A(o[1]);break;case "lower-alpha":case "upper-alpha":q=C(o[1])}b.attributes.value=q}if(i){if(f>e)a.push(i=new j.htmlParser.element(k)),i.add(b),g.add(i);else{if(f<
e){e-=f;for(var n;e--&&(n=i.parent);)i=n.parent}i.add(b)}c.splice(p--,1)}else a.push(i=new j.htmlParser.element(k)),i.add(b),c[p]=i;g=b;e=f}else i&&(i=e=g=null);for(p=0;p<a.length;p++)if(i=a[p],l=j.plugins.pastefromword.filters.stylesFilter,s=/list-style-type:(.*?)(?:;|$)/,n=i.children,c=n.length,e=h=h=void 0,h=i.attributes,!s.exec(h.style)){for(g=0;g<c;g++)if(h=n[g],h.attributes.value&&Number(h.attributes.value)==g+1&&delete h.attributes.value,h=s.exec(h.attributes.style))if(h[1]==e||!e)e=h[1];else{e=
null;break}if(e){for(g=0;g<c;g++)h=n[g].attributes,h.style&&(h.style=l([["list-style-type"]])(h.style)||"");i.addStyle("list-style-type",e)}}v=r=w=null},falsyFilter:function(){return!1},stylesFilter:function(a,c){return function(b,d){var f=[];(b||"").replace(/&quot;/g,'"').replace(/\s*([^ :;]+)\s*:\s*([^;]+)\s*(?=;|$)/g,function(b,e,g){e=e.toLowerCase();"font-family"==e&&(g=g.replace(/["']/g,""));for(var j,k,m,l=0,n=a.length;l<n;l++)if(m=a[l])if(b=m[0],j=m[1],k=m[2],m=m[3],e.match(b)&&(!j||g.match(j))){e=
m||e;c&&(k=k||g);"function"===typeof k&&(k=k(g,d,e));k&&k.push&&(e=k[0],k=k[1]);"string"===typeof k&&f.push([e,k]);return}!c&&f.push([e,g])});for(var e=0,g=f.length;e<g;e++)f[e]=f[e].join(":");return f.length?f.join(";")+";":!1}},elementMigrateFilter:function(a,c){return function(b){a=c?(new j.style(a,c)).styleDefinition:a;b.name=a.element;Object.merge(b.attributes,z.clone(a.attributes));b.addStyle(j.style.getStyleText(a))}},styleMigrateFilter:function(a,c){var b=this.elementMigrateFilter;return function(d,
f){var e=new j.htmlParser.element(null),g={};g[c]=d;b(a,g)(e);e.children=f.children;f.children=[e]}},bogusAttrFilter:function(a,c){if(-1==c.name.indexOf("kse:"))return!1},applyStyleFilter:null},getRules:function(a,c){var b=Object.merge({},l.$block,l.$listItem,l.$tableContent),d=a.config,f=this.filters,e=f.falsyFilter,g=f.stylesFilter,i=f.elementMigrateFilter,h=this.filters.styleMigrateFilter.bind(this.filters),r=this.utils.createListBulletMarker,o=f.flattenList,k=f.assembleList,m=this.utils.isListBulletIndicator,
q=this.utils.isContainingOnlySpaces,p=this.utils.resolveList,v=function(a){a=z.convertToPx(a);return isNaN(a)?a:a+"px"},s=this.utils.getStyleComponents,w=this.utils.listDtdParents,y=!1!==d.pasteFromWordRemoveFontStyles,u=!1!==d.pasteFromWordRemoveStyles;return{elementNames:[[/meta|link|script/,""]],root:function(a){a.filterChildren(c);k(a)},elements:{"^":function(a){var c;n.env.firefox&&(c=f.applyStyleFilter)&&c(a)},$:function(a){var t=a.name||"",e=a.attributes;if(t in b&&e.style)e.style=g([[/^(:?width|height)$/,
null,v]])(e.style)||"";if(t.match(/h\d/)){a.filterChildren(c);if(p(a))return;i(d.format[t])(a)}else if(t in l.$inline)a.filterChildren(c),q(a)&&delete a.name;else if(-1!=t.indexOf(":")&&-1==t.indexOf("kse")){a.filterChildren(c);if("v:imagedata"==t){if(t=a.attributes["o:href"])a.attributes.src=t;a.name="img";return}delete a.name}t in w&&(a.filterChildren(c),k(a))},style:function(a){if(n.env.firefox){var a=(a=a.onlyChild().value.match(/\/\* Style Definitions \*\/([\s\S]*?)\/\*/))&&a[1],c={};if(a)a.replace(/[\n\r]/g,
"").replace(/(.+?)\{(.+?)\}/g,function(a,b,e){for(var b=b.split(","),a=b.length,d=0;d<a;d++)b[d].trim().replace(/^(\w+)(\.[\w-]+)?$/g,function(a,b,d){b=b||"*";d=d.substring(1,d.length);d.match(/MsoNormal/)||(c[b]||(c[b]={}),d?c[b][d]=e:c[b]=e)})}),f.applyStyleFilter=function(a){var b=c["*"]?"*":a.name,d=a.attributes&&a.attributes["class"];b in c&&(b=c[b],"object"==typeof b&&(b=b[d]),b&&a.addStyle(b,!0))}}return!1},p:function(a){var t;if(/MsoListParagraph/.exec(a.attributes["class"])){var b=a.firstChild(function(a){return a.$text&&
!q(a.parent)});(t=(b=b&&b.parent)&&b.attributes,b=t)&&!b.style&&(b.style="mso-list: Ignore;")}a.filterChildren(c);p(a)||(d.enterMode==E.ENTER_BR?(delete a.name,a.add(new j.htmlParser.element("br"))):i(d.format[d.enterMode==E.ENTER_P?"p":"div"])(a))},div:function(a){var c=a.onlyChild();if(c&&"table"===c.name){var b=a.attributes;c.attributes=Object.merge(c.attributes,b);b.style&&c.addStyle(b.style);c=new j.htmlParser.element("div");c.addStyle("clear","both");a.add(c);delete a.name}},td:function(a){if(a.getAncestor("thead"))a.name=
"th"},ol:o,ul:o,dl:o,font:function(a){if(m(a.parent))delete a.name;else{a.filterChildren(c);var b=a.attributes,d=b.style,e=a.parent;"font"==e.name?(Object.merge(e.attributes,a.attributes),d&&e.addStyle(d),delete a.name):(d=d||"",b.color&&("#000000"!=b.color&&(d+="color:"+b.color+";"),delete b.color),b.face&&(d+="font-family:"+b.face+";",delete b.face),b.size&&(d+="font-size:"+(3<b.size?"large":3>b.size?"small":"medium")+";",delete b.size),a.name="span",a.addStyle(d))}},span:function(a){if(m(a.parent))return!1;
a.filterChildren(c);if(q(a))return delete a.name,null;if(m(a)){var b=a.firstChild(function(a){return a.value||"img"==a.name}),e=(b=b&&(b.value||"l."))&&b.match(/^(?:[(]?)([^\s]+?)([.)]?)$/);if(e)return b=r(e,b),(a=a.getAncestor("span"))&&/ mso-hide:\s*all|display:\s*none /.test(a.attributes.style)&&(b.attributes["kse:ignored"]=1),b}if(e=(b=a.attributes)&&b.style)b.style=g([["line-height"],[/^font-family$/,null,!y?h(d.font.style,"family"):null],[/^font-size$/,null,!y?h(d.fontsize.style,"size"):null],
[/^color$/,null,!y?h(d.color.forestyle,"color"):null],[/^background-color$/,null,!y?h(d.color.backstyle,"color"):null]])(e,a)||"";return null},b:i(d.basicstyles.bold),i:i(d.basicstyles.italic),u:i(d.basicstyles.underline),s:i(d.basicstyles.strike),sup:i(d.basicstyles.superscript),sub:i(d.basicstyles.subscript),a:function(a){var b=a.attributes,c=b&&b.href||"";if(b&&!c&&b.name)delete a.name;else if(n.env.webkit&&c.match(/file:\/\/\/[\S]+#/i))b.href=c.replace(/file:\/\/\/[^#]+/i,"")},"kse:listbullet":function(a){a.getAncestor(/h\d/)&&
!d.pasteFromWordNumberedHeadingToList&&delete a.name}},attributeNames:[[/^onmouse(:?out|over)/,""],[/^onload$/,""],[/(?:v|o):\w+/,""],[/^lang/,""]],attributes:{style:g(u?[[/^list-style-type$/,null],[/^margin$|^margin-(?!bottom|top)/,null,function(a,b,c){if(b.name in{p:1,div:1}){b="ltr"==d.contentsDirection?"margin-left":"margin-right";if("margin"==c)a=s(c,a,[b])[b];else if(c!=b)return null;if(a&&!H.test(a))return[b,a]}return null}],[/^clear$/],[/^border.*|margin.*|vertical-align|float$/,null,function(a,
b){if("img"==b.name)return a}],[/^width|height$/,null,function(a,b){if(b.name in{table:1,td:1,th:1,img:1})return a}]]:[[/^mso-/],[/-color$/,null,function(a){if("transparent"==a)return!1;if(n.env.firefox)return a.replace(/-moz-use-text-color/g,"transparent")}],[/^margin$/,H],["text-indent","0cm"],["page-break-before"],["tab-stops"],["display","none"],y?[/font-?/]:null],u),width:function(a,b){if(b.name in l.$tableContent)return!1},border:function(a,b){if(b.name in l.$tableContent)return!1},"class":e,
bgcolor:e,valign:u?e:function(a,b){b.addStyle("vertical-align",a);return!1}},comment:n.env.ie?e:function(a,b){var x;var t;var c=a.match(/<img.*?>/),d=a.match(/^\[if !supportLists\]([\s\S]*?)\[endif\]$/);if(d)return t=(c=d[1]||c&&"l.")&&c.match(/>(?:[(]?)([^\s]+?)([.)]?)</),d=t,r(d,c);return n.env.firefox&&c?(c=j.htmlParser.fragment.fromHtml(c[0]).children[0],(x=(d=(d=b.previous)&&d.value.match(/<v:imagedata[^>]*o:href=['"](.*?)['"]/))&&d[1],d=x)&&(c.attributes.src=d),c):!1}}}},K=new Class({initialize:function(){this.dataFilter=
new j.htmlParser.filter},toHTML:function(a){var a=j.htmlParser.fragment.fromHtml(a),c=new j.htmlParser.basicWriter;a.writeHtml(c,this.dataFilter);return c.getHtml(!0)}});j.cleanWord=function(a,c){n.env.firefox&&(a=a.replace(/(<\!--\[if[^<]*?\])--\>([\S\s]*?)<\!--(\[endif\]--\>)/gi,"$1$2$3"));var b=new K,d=b.dataFilter;d.addRules(j.plugins.pastefromword.getRules(c,d));c.fireEvent("beforeCleanWord",{filter:d});try{a=b.toHTML(a,!1)}catch(f){alert(c.lang.pastefromword.error)}a=a.replace(/kse:.*?".*?"/g,
"");a=a.replace(/style=""/g,"");return a=a.replace(/<span>/g,"")}})(Klass);
