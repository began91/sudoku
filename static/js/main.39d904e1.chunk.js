(this.webpackJsonpsudoku=this.webpackJsonpsudoku||[]).push([[0],{15:function(e,t,n){e.exports=n(28)},20:function(e,t,n){},27:function(e,t,n){},28:function(e,t,n){"use strict";n.r(t);for(var r=n(0),a=n.n(r),o=n(6),c=n.n(o),u=(n(20),n(3)),l=n(2),i=n(14),s=n(13),f=n(4),b={},m=0;m<9;m++)for(var v=0;v<9;v++){var d=3*Math.floor(m/3)+1+Math.floor(v/3),h=m%3*3+1+v%3;b[String(d)+String(h)]=""}var g=Object(f.b)({name:"square",initialState:{board:b,highlight:[],active:"55",isSolvable:!0},reducers:{setSquare:function(e,t){var n;(n=Number(t.payload.value)?Number(t.payload.value):"")>9&&(n=Number(String(n)[1])),e.board[t.payload.square]=n},setSolution:function(e,t){e.board=t.payload},setSolvable:function(e,t){e.isSolvable=t.payload},resetPuzzle:function(e){e.board=b},highlightNeighbors:function(e,t){e.active=t.payload.active,e.highlight=t.payload.neighbors}}}),E=g.actions,p=E.setSquare,S=E.setSolution,j=E.setSolvable,O=E.resetPuzzle,y=E.highlightNeighbors,N=g.reducer,q=function(e){for(var t=[],n=Number(e[0]),r=Number(e[1]),a=3*Math.floor((n-1)/3)+1+Math.floor((r-1)/3),o=0;o<9;o++){t.push(String(n)+String(o+1)),t.push(String(o+1)+String(r));var c=3*Math.floor((a-1)/3)+1+Math.floor(o/3),u=(a-1)%3*3+1+o%3;t.push(String(c)+String(u))}return Object(s.a)(new Set(t.filter((function(t){return t!==e}))))},x=function(e){e=Object(i.a)({},e);var t=!0,n=function(e,t){var n=[1,2,3,4,5,6,7,8,9];return q(e).forEach((function(e){var r=t[e];r&&n.includes(r)&&(n=n.filter((function(e){return e!==r})))})),n};0!==Object.entries(e).filter((function(e){var t=Object(u.a)(e,2);t[0];return!!t[1]})).filter((function(t){var n=Object(u.a)(t,2);return!function(t,n){return!q(t).some((function(t){return e[t]===n}))}(n[0],n[1])})).length?(j(!1),t=!1):S(e);if(t){var r=function e(t){var r=Object.entries(t).findIndex((function(e){var t=Object(u.a)(e,2);t[0];return!t[1]}));if(-1===r){return[t,!0,!0]}for(var a=Object.entries(t)[r][0],o=!1,c=!0;c&&!o;){for(var l=n(a,t);l.length>0&&!o;){var i=l.shift();t[a]=i;var s=e(t),f=Object(u.a)(s,3);t=f[0],o=f[1],c=f[2]}return 0!==l.length||o||(t[a]="",c=!1),[t,o,c]}}(e),a=Object(u.a)(r,3),o=a[0],c=a[1],l=a[2];return console.log(c?"solved":"unsolved",l?"solvable":"unsolvable"),c?o:null}return console.log("unsolvable"),null},k=(n(27),function(e){var t=Object(l.b)(),n=String(e.row)+String(e.col),o=q(n),c=Object(l.c)((function(e){return e.square.board[n]})),u=Object(l.c)((function(e){return e.square.active===n})),i=Object(l.c)((function(e){return e.square.highlight.includes(n)}));u&&t(y({active:n,neighbors:o}));var s=function(e){t(y({active:n,neighbors:o}))},f="square "+(u?"active ":"")+(i?"highlight":"");return Object(r.useEffect)((function(){u&&document.getElementById("".concat(n,"input")).focus()}),[u,n]),a.a.createElement("div",null,a.a.createElement("input",{tabIndex:n,className:f,id:n+"input",onChange:function(e){Number(e.target.value)&&t(p({square:n,value:e.target.value}))},value:c,onFocus:s,onClick:s,onKeyDown:function(e){var r=e.keyCode;if(u)if(r>48&&r<=57);else if(8===r||46===r||48===r||96===r)e.preventDefault(),t(p({square:n,value:""}));else if(37===r&&n[1]>1){var a=n[0]+(Number(n[1])-1);document.getElementById("".concat(a,"input")).focus()}else if(39===r&&n[1]<9){var o=n[0]+(Number(n[1])+1);document.getElementById("".concat(o,"input")).focus()}else if(38===r&&n[0]>1){var c=Number(n[0])-1+n[1];document.getElementById("".concat(c,"input")).focus()}else if(40===r&&n[0]<9){var l=Number(n[0])+1+n[1];document.getElementById("".concat(l,"input")).focus()}}}))}),w=function(e){var t=function(e){for(var t=e.box-1,n=[],r=0;r<9;r++){var o=3*Math.floor(t/3)+1+Math.floor(r/3),c=t%3*3+1+r%3,u=String(o)+String(c);n.push(a.a.createElement(k,{row:o,col:c,key:u,square:u}))}return a.a.createElement("td",{className:"box"},n)};return a.a.createElement("table",{className:"board"},a.a.createElement("tbody",null,a.a.createElement("tr",null,a.a.createElement(t,{box:1}),a.a.createElement(t,{box:2}),a.a.createElement(t,{box:3})),a.a.createElement("tr",null,a.a.createElement(t,{box:4}),a.a.createElement(t,{box:5}),a.a.createElement(t,{box:6})),a.a.createElement("tr",null,a.a.createElement(t,{box:7}),a.a.createElement(t,{box:8}),a.a.createElement(t,{box:9}))))};var B=function(){var e=Object(l.b)(),t=Object(l.c)((function(e){return e.square.isSolvable})),n=Object(r.useState)(!1),o=Object(u.a)(n,2),c=o[0],i=o[1],s=Object(l.c)((function(e){return e.square.board}));return a.a.createElement("div",{className:"App"},a.a.createElement("header",{className:"App-header"},"React Sudoku"),a.a.createElement(w,null),c?a.a.createElement("button",{onClick:function(t){i(!1),e(O())}},"Reset"):a.a.createElement("button",{onClick:function(t){var n=x(s);e(S(n)),i(!0)},disabled:!t},t?"Solve!":"No Solution!"))},M=Object(f.b)({name:"counter",initialState:{value:0},reducers:{increment:function(e){e.value+=1},decrement:function(e){e.value-=1},incrementByAmount:function(e,t){e.value+=t.payload}}}),I=M.actions,C=(I.increment,I.decrement,I.incrementByAmount,M.reducer),z=Object(f.a)({reducer:{counter:C,square:N}});Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(a.a.createElement(a.a.StrictMode,null,a.a.createElement(l.a,{store:z},a.a.createElement(B,null))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[15,1,2]]]);
//# sourceMappingURL=main.39d904e1.chunk.js.map