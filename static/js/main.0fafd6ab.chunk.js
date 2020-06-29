(this.webpackJsonpsudoku=this.webpackJsonpsudoku||[]).push([[0],{15:function(e,t,n){e.exports=n(28)},20:function(e,t,n){},27:function(e,t,n){},28:function(e,t,n){"use strict";n.r(t);for(var a=n(0),r=n.n(a),o=n(6),u=n.n(o),c=(n(20),n(3)),l=n(2),i=n(11),s=n(14),f=n(4),v={},b=0;b<9;b++)for(var h=0;h<9;h++){var m=3*Math.floor(b/3)+1+Math.floor(h/3),d=b%3*3+1+h%3;v[String(m)+String(d)]=""}var g=Object(f.b)({name:"square",initialState:{board:v,highlight:[],active:"55",isSolvable:!0},reducers:{setSquare:function(e,t){var n;(n=Number(t.payload.value)?Number(t.payload.value):"")>9&&(n=Number(String(n)[1])),e.board[t.payload.square]=n},setSolution:function(e,t){e.board=t.payload},setSolvable:function(e,t){e.isSolvable=t.payload},resetPuzzle:function(e){e.board=v},highlightNeighbors:function(e,t){e.active=t.payload.active,e.highlight=t.payload.neighbors}}}),p=g.actions,E=p.setSquare,S=p.setSolution,y=(p.setSolvable,p.resetPuzzle),O=p.highlightNeighbors,j=g.reducer,k=function(e){for(var t=[],n=Number(e[0]),a=Number(e[1]),r=3*Math.floor((n-1)/3)+1+Math.floor((a-1)/3),o=0;o<9;o++){t.push(String(n)+String(o+1)),t.push(String(o+1)+String(a));var u=3*Math.floor((r-1)/3)+1+Math.floor(o/3),c=(r-1)%3*3+1+o%3;t.push(String(u)+String(c))}return Object(s.a)(new Set(t.filter((function(t){return t!==e}))))},N=(n(27),function(e){var t=Object(l.b)(),n=String(e.row)+String(e.col),o=k(n),u=Object(l.c)((function(e){return e.square.board[n]})),c=Object(l.c)((function(e){return e.square.active===n})),i=Object(l.c)((function(e){return e.square.highlight.includes(n)}));c&&t(O({active:n,neighbors:o}));var s=function(e){t(O({active:n,neighbors:o}))},f="square "+(c?"active ":"")+(i?"highlight":"");return Object(a.useEffect)((function(){c&&document.getElementById("".concat(n,"input")).focus()}),[c,n]),r.a.createElement("div",null,r.a.createElement("input",{tabIndex:n,className:f,id:n+"input",onChange:function(e){Number(e.target.value)&&t(E({square:n,value:e.target.value}))},value:u,onFocus:s,onClick:s,onKeyDown:function(e){var a=e.keyCode;if(c)if(a>48&&a<=57);else if(8===a||46===a||48===a||96===a)e.preventDefault(),t(E({square:n,value:""}));else if(37===a&&n[1]>1){var r=n[0]+(Number(n[1])-1);document.getElementById("".concat(r,"input")).focus()}else if(39===a&&n[1]<9){var o=n[0]+(Number(n[1])+1);document.getElementById("".concat(o,"input")).focus()}else if(38===a&&n[0]>1){var u=Number(n[0])-1+n[1];document.getElementById("".concat(u,"input")).focus()}else if(40===a&&n[0]<9){var l=Number(n[0])+1+n[1];document.getElementById("".concat(l,"input")).focus()}}}))}),V=function(e){var t=function(e){for(var t=e.box-1,n=[],a=0;a<9;a++){var o=3*Math.floor(t/3)+1+Math.floor(a/3),u=t%3*3+1+a%3,c=String(o)+String(u);n.push(r.a.createElement(N,{row:o,col:u,key:c,square:c}))}return r.a.createElement("td",{className:"box"},n)};return r.a.createElement("table",{className:"board"},r.a.createElement("tbody",null,r.a.createElement("tr",null,r.a.createElement(t,{box:1}),r.a.createElement(t,{box:2}),r.a.createElement(t,{box:3})),r.a.createElement("tr",null,r.a.createElement(t,{box:4}),r.a.createElement(t,{box:5}),r.a.createElement(t,{box:6})),r.a.createElement("tr",null,r.a.createElement(t,{box:7}),r.a.createElement(t,{box:8}),r.a.createElement(t,{box:9}))))};var x=function(){var e=Object(l.b)(),t=Object(l.c)((function(e){return e.square.isSolvable})),n=Object(a.useState)(!1),o=Object(c.a)(n,2),u=o[0],s=o[1],f=Object(l.c)((function(e){return e.square.board}));return r.a.createElement("div",{className:"App"},r.a.createElement("header",{className:"App-header"},"React Sudoku"),r.a.createElement(V,null),u?r.a.createElement("button",{onClick:function(t){s(!1),e(y())}},"Reset"):r.a.createElement(r.a.Fragment,null,r.a.createElement("button",{onClick:function(t){var n=function(e){var t=!0;e=Object(i.a)({},e);var n=Object.keys(e);Object.entries(e).forEach((function(t){var n=Object(c.a)(t,2),a=n[0],r=n[1];e[a]={value:r,possVals:[],neighbors:k(a)}})),n.forEach((function(n){var a=[1,2,3,4,5,6,7,8,9];e[n].neighbors.forEach((function(t){var n=e[t].value;n&&a.includes(n)&&(a=a.filter((function(e){return e!==n})))})),0===a.length&&(t=!1),e[n].possVals=a}));if(t){var a=function e(t){var n=Object.keys(t).filter((function(e){return!t[e].value}));if(0===n.length)return t;if(n.some((function(e){return 0===t[e].possVals.length})))return console.count("badguess"),!1;for(var a=n.sort((function(e,n){return t[e].possVals.length-t[n].possVals.length}))[0],r=function(){var r=[],o=t[a].possVals.shift();t[a].value=o,t[a].neighbors.filter((function(e){return!t[e].value})).forEach((function(e){var n=t[e].possVals.indexOf(o);-1!==n&&t[e].possVals.splice(n,1)}));for(var u=function(){var e=Object.keys(t).find((function(e){return!t[e].value&&1===t[e].possVals.length})),n=t[e].possVals[0];t[e].value=n,r.push(e),t[e].neighbors.filter((function(e){return!t[e].value})).forEach((function(e){var a=t[e].possVals.indexOf(n);-1!==a&&t[e].possVals.splice(a,1)}))};Object.keys(t).some((function(e){return!t[e].value&&1===t[e].possVals.length}));)u();if(!Object.keys(t).filter((function(e){return!t[e].value})).some((function(e){return 0===t[e].possVals.length}))){var c=e(t);if(c&&c)return{v:c}}if(t[a].value="",r.forEach((function(e){t[e].value=""})),n.forEach((function(e){if(a!==e){var n=[1,2,3,4,5,6,7,8,9];t[e].neighbors.forEach((function(e){var a=t[e].value;a&&n.includes(a)&&(n=n.filter((function(e){return e!==a})))})),t[e].possVals=n}})),!(t[a].possVals.length>0))return console.count("badguess"),{v:!1}};t[a].possVals.length>0;){var o=r();if("object"===typeof o)return o.v}return console.count("badguess"),!1}(e);if(a){var r={};return Object.keys(a).forEach((function(e){r[e]=a[e].value})),r}return!1}return!1}(f);n&&(e(S(n)),s(!0))},disabled:!t},t?"Solve!":"No Solution!")))},q=Object(f.b)({name:"counter",initialState:{value:0},reducers:{increment:function(e){e.value+=1},decrement:function(e){e.value-=1},incrementByAmount:function(e,t){e.value+=t.payload}}}),w=q.actions,B=(w.increment,w.decrement,w.incrementByAmount,q.reducer),M=Object(f.a)({reducer:{counter:B,square:j}});Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));u.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(l.a,{store:M},r.a.createElement(x,null))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[15,1,2]]]);
//# sourceMappingURL=main.0fafd6ab.chunk.js.map