import{S as Y,i as Z,s as x,e as v,t as S,k as q,c as p,a as k,g as D,d as a,n as C,b as d,J as ee,f as j,H as o,K as te,I as O,L as A,A as se,M as ne,h as K,j as ae,N as re,m as ie,O as le,o as oe,x as ce,u as ue,v as de}from"../chunks/vendor-06f73bce.js";function fe(w){let s,i;return{c(){s=v("div"),i=S("No meetings found for the next 24 hours.")},l(t){s=p(t,"DIV",{});var l=k(s);i=D(l,"No meetings found for the next 24 hours."),l.forEach(a)},m(t,l){j(t,s,l),o(s,i)},p:O,d(t){t&&a(s)}}}function me(w){let s,i,t=w[0].name+"",l,c,E,_=w[0].startTime.toString()+"",g,m,u,f,b=w[0].link+"",h,n;return{c(){s=v("div"),i=v("strong"),l=S(t),c=q(),E=v("div"),g=S(_),m=q(),u=v("div"),f=v("a"),h=S(b),this.h()},l(e){s=p(e,"DIV",{});var r=k(s);i=p(r,"STRONG",{});var T=k(i);l=D(T,t),T.forEach(a),r.forEach(a),c=C(e),E=p(e,"DIV",{});var y=k(E);g=D(y,_),y.forEach(a),m=C(e),u=p(e,"DIV",{});var V=k(u);f=p(V,"A",{href:!0});var z=k(f);h=D(z,b),z.forEach(a),V.forEach(a),this.h()},h(){d(f,"href",n=w[0].link)},m(e,r){j(e,s,r),o(s,i),o(i,l),j(e,c,r),j(e,E,r),o(E,g),j(e,m,r),j(e,u,r),o(u,f),o(f,h)},p(e,r){r&1&&t!==(t=e[0].name+"")&&K(l,t),r&1&&_!==(_=e[0].startTime.toString()+"")&&K(g,_),r&1&&b!==(b=e[0].link+"")&&K(h,b),r&1&&n!==(n=e[0].link)&&d(f,"href",n)},d(e){e&&a(s),e&&a(c),e&&a(E),e&&a(m),e&&a(u)}}}function he(w){let s,i,t,l,c,E,_,g,m,u,f,b,h,n,e,r,T,y,V,z,U;function H(M,R){if(M[0])return me;if(M[1]!==void 0)return fe}let N=H(w),I=N&&N(w);return{c(){s=v("section"),i=v("div"),t=v("div"),l=v("h4"),c=S("Random Virtual Meeting"),E=q(),_=v("div"),g=v("div"),m=v("button"),u=S("Get A Random Meeting"),f=q(),b=v("div"),I&&I.c(),h=q(),n=v("div"),e=v("a"),r=S("Ideas?"),T=S(`
                \u2022 Meetings sourced from
                `),y=v("a"),V=S("virtual-na.org"),this.h()},l(M){s=p(M,"SECTION",{class:!0});var R=k(s);i=p(R,"DIV",{class:!0});var J=k(i);t=p(J,"DIV",{class:!0});var $=k(t);l=p($,"H4",{class:!0});var B=k(l);c=D(B,"Random Virtual Meeting"),B.forEach(a),E=C($),_=p($,"DIV",{class:!0});var G=k(_);g=p(G,"DIV",{class:!0});var P=k(g);m=p(P,"BUTTON",{class:!0});var W=k(m);u=D(W,"Get A Random Meeting"),W.forEach(a),P.forEach(a),f=C(G),b=p(G,"DIV",{class:!0});var F=k(b);I&&I.l(F),F.forEach(a),G.forEach(a),h=C($),n=p($,"DIV",{class:!0});var L=k(n);e=p(L,"A",{href:!0,target:!0});var Q=k(e);r=D(Q,"Ideas?"),Q.forEach(a),T=D(L,`
                \u2022 Meetings sourced from
                `),y=p(L,"A",{href:!0,target:!0});var X=k(y);V=D(X,"virtual-na.org"),X.forEach(a),L.forEach(a),$.forEach(a),J.forEach(a),R.forEach(a),this.h()},h(){d(l,"class","title is-4 has-text-centered"),d(m,"class","button is-fullwidth svelte-1cf5j7t"),m.disabled=w[2],ee(m,"is-loading",w[2]),d(g,"class","block"),d(b,"class","block is-shadowless has-text-centered"),d(_,"class","block"),d(e,"href","https://github.com/bmlt-enabled/randomvm/issues"),d(e,"target","_blank"),d(y,"href","https://virtual-na.org/meetings"),d(y,"target","_blank"),d(n,"class","box is-shadowless p-3 m-0 has-text-centered"),d(t,"class","card p-5"),d(i,"class","container"),d(s,"class","section p-5")},m(M,R){j(M,s,R),o(s,i),o(i,t),o(t,l),o(l,c),o(t,E),o(t,_),o(_,g),o(g,m),o(m,u),o(_,f),o(_,b),I&&I.m(b,null),o(t,h),o(t,n),o(n,e),o(e,r),o(n,T),o(n,y),o(y,V),z||(U=te(m,"click",w[3]),z=!0)},p(M,[R]){R&4&&(m.disabled=M[2]),R&4&&ee(m,"is-loading",M[2]),N===(N=H(M))&&I?I.p(M,R):(I&&I.d(1),I=N&&N(M),I&&(I.c(),I.m(b,null)))},i:O,o:O,d(M){M&&a(s),I&&I.d(),z=!1,U()}}}function _e(w,s,i){let t,l,c=[],E=!1,_=A();class g{constructor(n){this.name=n.meeting_name,this.startTime=this.getAdjustedStartTime(n),this.link=n.comments}getAdjustedStartTime(n){const e=parseInt(n.weekday_tinyint)===1?7:parseInt(n.weekday_tinyint)-1;let r=A().tz(n.time_zone||"UTC",!0).set({hour:parseInt(n.start_time.split(":")[0]),minute:parseInt(n.start_time.split(":")[1]),second:0}).isoWeekday(e);return r=r.clone().tz(A.tz.guess()),A.tz(A.tz.guess())>r&&r.add(1,"weeks"),r}}se(()=>{f()});function m(h){const n=[];if(h)for(const e of h)n.push(new g(e));return n}function u(h){const n=h.length<3?h.length:3,e=[];let r=30;for(;h.length>e.length;){for(const T of h.filter(y=>!e.includes(y))){const y=A.tz(A.tz.guess()),V=T.startTime.diff(y,"minutes");if(V>=-10&&V<=r&&(e.push(T),e.length>=n&&r>30))break}if(e.length>=n||r>1440)break;r+=15}return e}async function f(){i(2,E=!0);try{const e=await(await ne("https://bmlt.virtual-na.org/main_server/client_interface/jsonp/?switcher=GetSearchResults&data_field_key=weekday_tinyint,start_time,time_zone,meeting_name,comments")).json(),r=m(e);i(1,l=u(r)),c=[],b(),i(2,E=!1)}catch(h){console.log("parsing failed",h)}}function b(){if(A().diff(_,"seconds")>900){f(),_=A();return}l.length?c.length==l.length&&(c.length>1?c=[c.pop()]:c=[]):i(0,t=null);const h=l.filter(n=>!c.includes(n));i(0,t=h[Math.floor(Math.random()*h.length)]),c.push(t)}return[t,l,E,b]}class ve extends Y{constructor(s){super();Z(this,s,_e,he,x,{})}}function pe(w){let s,i,t,l,c,E,_,g,m;return g=new ve({}),{c(){s=v("link"),i=v("link"),t=v("meta"),l=v("meta"),c=v("script"),_=q(),ae(g.$$.fragment),this.h()},l(u){const f=re('[data-svelte="svelte-1ouqje7"]',document.head);s=p(f,"LINK",{rel:!0,href:!0}),i=p(f,"LINK",{rel:!0,href:!0}),t=p(f,"META",{name:!0,content:!0}),l=p(f,"META",{name:!0,content:!0}),c=p(f,"SCRIPT",{src:!0,"data-auto-a11y":!0});var b=k(c);b.forEach(a),f.forEach(a),_=C(u),ie(g.$$.fragment,u),this.h()},h(){d(s,"rel","manifest"),d(s,"href","manifest.json"),d(i,"rel","apple-touch-icon"),d(i,"href","apple-icon-180.png"),d(t,"name","mobile-web-app-capable"),d(t,"content","yes"),d(l,"name","apple-mobile-web-app-capable"),d(l,"content","yes"),document.title="Random Virtual Meeting",le(c.src,E="https://use.fontawesome.com/releases/v5.15.4/js/all.js")||d(c,"src",E),d(c,"data-auto-a11y","true")},m(u,f){o(document.head,s),o(document.head,i),o(document.head,t),o(document.head,l),o(document.head,c),j(u,_,f),oe(g,u,f),m=!0},p:O,i(u){m||(ce(g.$$.fragment,u),m=!0)},o(u){ue(g.$$.fragment,u),m=!1},d(u){a(s),a(i),a(t),a(l),a(c),u&&a(_),de(g,u)}}}class be extends Y{constructor(s){super();Z(this,s,null,pe,x,{})}}export{be as default};
