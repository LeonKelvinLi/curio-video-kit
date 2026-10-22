(function(){
const W=1080,H=1920,T=16,TY=2050,SEABED=2200;
const clamp=(x,a=0,b=1)=>x<a?a:x>b?b:x, lerp=(a,b,p)=>a+(b-a)*p, inv=(a,b,x)=>clamp((x-a)/(b-a));
const E={lin:p=>p,io:p=>p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2,out:p=>1-Math.pow(1-p,3),in:p=>p*p*p,
  back:p=>{const c=1.70158,c3=c+1;return 1+c3*Math.pow(p-1,3)+c*Math.pow(p-1,2)},sine:p=>-(Math.cos(Math.PI*p)-1)/2};
const hash=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)};
const noise1=x=>{const i=Math.floor(x),f=x-i,u=f*f*(3-2*f);return lerp(hash(i),hash(i+1),u)*2-1};
function track(keys,t){if(t<=keys[0][0])return keys[0][1];for(let i=1;i<keys.length;i++){if(t<=keys[i][0]){const k0=keys[i-1],k1=keys[i],p=(E[k1[2]]||E.io)(inv(k0[0],k1[0],t));return k0[1].map((a,j)=>lerp(a,k1[1][j],p))}}return keys[keys.length-1][1]}
const C=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const mixc=(a,b,p)=>a.map((v,i)=>Math.round(lerp(v,b[i],p)));
const rgb=(c,al)=>`rgba(${c[0]},${c[1]},${c[2]},${al==null?1:al})`;
const WT_N=C("#0f2d42"),WT_D=C("#3c93b0"),WD_N=C("#03090f"),WD_D=C("#1a4f66"),SKT_N=C("#02060c"),SKB_N=C("#122640"),SKT_D=C("#5ea6cc"),SKB_D=C("#cfe6f0");
const ACC="#ffc83d",DISP='"Barlow Condensed","Arial Narrow",Arial,sans-serif',MONO='"IBM Plex Mono",Consolas,monospace';

/* ▶ YOUR CALL — the ending question (see the note in chat).
   Answerable questions gave Curio its only YouTube comments; open "what would you do"
   questions get more replies but fewer shares. Add variants to A/B test; the Ending
   button on the page cycles through them. */
const QUESTIONS=[
  {text:"Would you have waited, or swum for it?",chips:["WAIT","SWIM"]},
  // TODO(you): add 1–2 variants here, e.g. {text:"...",chips:["A","B"]}
];
let qIndex=0;

const CAM=[[0,[40,-30,1.05]],[1.1,[10,20,.95]],[2.65,[0,1880,.86]],[3.05,[20,1985,.98],"out"],[4.15,[105,1996,2.6]],[7.05,[114,1992,2.8],"sine"],[7.85,[330,1880,1.15]],[9.0,[360,1985,1.5]],[9.85,[332,2006,2.3]],[10.35,[330,2008,2.6],"out"],[11.35,[330,2008,2.75],"lin"],[12.15,[420,1560,.95]],[14.05,[420,640,.95],"sine"],[15.25,[40,-30,1.05]],[16,[40,-30,1.05],"lin"]];

function waveY(x,t){return Math.sin(x*.006+t*1.6)*12+Math.sin(x*.013-t*2.1)*5-36*Math.exp(-Math.pow(x/320,2))*Math.exp(-Math.pow((t-.45)/.25,2))}
function tugState(t){
  const flip=E.io(inv(.42,1.22,t)),sink=E.io(inv(1.12,2.68,t));
  let a=Math.PI*flip,y=lerp(waveY(0,t)-8,TY,sink),x=Math.sin(flip*Math.PI)*60*(1-sink);
  if(sink>0&&sink<1)a+=Math.sin(t*5)*.05*Math.sin(sink*Math.PI);
  if(t>2.68){const u=t-2.68;y=TY+16*Math.exp(-5*u)*Math.sin(16*u)}
  return {x,y,a};
}
const hoursAt=t=>t<4.6?0:t>6.9?60:60*E.sine(inv(4.6,6.9,t));
function diverState(t){const p=E.io(inv(7.25,9.2,t));return {x:lerp(860,470,p),y:lerp(1380,1995,p)+Math.sin(t*1.8)*5,reach:E.out(inv(9.95,10.28,t)),vis:t>7.15&&t<11.8,a:inv(7.15,7.5,t)*(1-inv(11.4,11.8,t))}}
function bellState(t){const p=E.sine(inv(11.6,14.3,t));return {x:430,y:lerp(1960,170,p),a:inv(11.45,11.8,t)*(1-inv(14.3,14.6,t))}}
function state(t){
  const c=track(CAM,t),z=c[2];
  let cam=[c[0]+noise1(t*.6)*5/z,c[1]+noise1(t*.5+9)*5/z,z];
  {const B0=bellState(t),w=E.io(inv(11.7,12.4,t))*(1-E.io(inv(14.0,14.5,t)));if(w>0)cam=[lerp(cam[0],B0.x-40,w),lerp(cam[1],B0.y-90,w),lerp(cam[2],1.55,w)]}
  const h=hoursAt(t);let dl=0;if(t>=4.4){const tod=(4.8+h)%24;dl=clamp(Math.sin((tod-6)/12*Math.PI))*.85}if(t>11.4)dl*=1-E.io(inv(11.4,12.6,t));
  const tug=tugState(t);
  let sh=0;if(t>2.68&&t<3.3)sh=12*Math.exp(-8*(t-2.68));if(t>10.3&&t<10.9)sh=Math.max(sh,20*Math.exp(-7*(t-10.3)));
  const Bs=bellState(t);return {t,cam,h,dl,tug,depth:t>11.6?clamp(Bs.y/TY)*30:clamp(tug.y/TY)*30,
    xray:E.io(inv(2.85,3.35,t))*(1-.85*E.io(inv(7.2,8.2,t)))*(1-E.io(inv(11.4,12,t))),
    dark:.55*E.io(inv(7.2,8.2,t))*(1-E.io(inv(11.3,12.2,t))),
    shake:[noise1(t*42)*sh,noise1(t*42+50)*sh],D:diverState(t),B:bellState(t)};
}

/* ---- drawing primitives ---- */
function poly(ctx,pts,fill){ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.closePath();ctx.fillStyle=fill;ctx.fill()}
function seg(ctx,a,b,c,d){ctx.beginPath();ctx.moveTo(a,b);ctx.lineTo(c,d);ctx.stroke()}
function rr(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function circ(ctx,x,y,r,fill){ctx.beginPath();ctx.arc(x,y,Math.max(0,r),0,6.2832);ctx.fillStyle=fill;ctx.fill()}

function makeView(S,vp){
  const z=S.cam[2],cx=vp.x+vp.w/2,cy=vp.y+vp.h*vp.fy;
  return {z,toS:(wx,wy)=>[cx+(wx-S.cam[0])*z,cy+(wy-S.cam[1])*z],toW:(sx,sy)=>[S.cam[0]+(sx-cx)/z,S.cam[1]+(sy-cy)/z],vp};
}

function drawTug(ctx,S,V){
  const t=S.t,[sx,sy]=V.toS(S.tug.x,S.tug.y),xr=S.xray;
  ctx.save();ctx.translate(sx,sy);ctx.rotate(S.tug.a);ctx.scale(V.z,V.z);
  ctx.globalAlpha=1-.8*xr;
  poly(ctx,[[-250,-20],[232,-30],[276,-58],[244,38],[150,86],[-200,86],[-256,40]],"#27384a");
  poly(ctx,[[-253,30],[246,26],[244,38],[150,86],[-200,86],[-256,40]],"#8e3a2d");
  poly(ctx,[[-200,86],[150,86],[120,70],[-180,70]],"#7a3227");
  poly(ctx,[[-250,-20],[232,-30],[236,-22],[-250,-12]],"#e6e0cf");
  for(let i=0;i<6;i++)circ(ctx,-200+i*80,4,13,"#12171d");
  poly(ctx,[[-60,-20],[130,-20],[124,-112],[-54,-112]],"#e4e0d4");
  poly(ctx,[[96,-20],[130,-20],[124,-112],[92,-112]],"#c2bdae");
  poly(ctx,[[-10,-112],[120,-112],[112,-172],[-2,-172]],"#ece8dc");
  poly(ctx,[[84,-112],[120,-112],[112,-172],[80,-172]],"#cfcabd");
  poly(ctx,[[-14,-172],[124,-172],[120,-184],[-10,-184]],"#2b3a4a");
  const lit=t<1.1?1:Math.max(0,1-(t-1.1)/.4);
  for(let i=0;i<4;i++){ctx.fillStyle=lit>.05?`rgba(255,205,120,${.3+.65*lit})`:"#1d2c3a";ctx.fillRect(4+i*27,-160,20,22)}
  for(let i=0;i<5;i++){ctx.fillStyle="#1d2c3a";ctx.fillRect(-44+i*32,-90,18,18)}
  poly(ctx,[[-48,-112],[-20,-112],[-24,-152],[-46,-152]],"#2b3a4a");poly(ctx,[[-47,-140],[-22,-140],[-23,-147],[-46,-147]],"#c98500");
  ctx.strokeStyle="#cfd6dc";ctx.lineWidth=5;seg(ctx,60,-184,60,-262);seg(ctx,40,-236,80,-236);
  poly(ctx,[[-236,-20],[-214,-20],[-216,-46],[-234,-46]],"#2b3a4a");
  ctx.globalAlpha=1;
  if(xr>.01){
    ctx.save();ctx.globalAlpha=xr;
    poly(ctx,[[-246,-12],[228,-22],[238,32],[148,78],[-196,78],[-248,36]],"rgba(16,48,66,.88)");
    ctx.strokeStyle="rgba(143,190,214,.65)";ctx.lineWidth=2.2;
    [[-170,-12,-170,78],[-40,-14,-40,78],[60,-16,60,78],[150,-18,150,74]].forEach(l=>seg(ctx,l[0],l[1],l[2],l[3]));seg(ctx,-246,10,232,6);
    ctx.beginPath();ctx.moveTo(-168,78);ctx.lineTo(-42,78);for(let x=-42;x>=-168;x-=6)ctx.lineTo(x,48+Math.sin(x*.09+t*3)*1.8);ctx.closePath();ctx.fillStyle="rgba(196,230,243,.92)";ctx.fill();
    ctx.strokeStyle="rgba(255,200,61,.85)";ctx.lineWidth=3;ctx.strokeRect(-170,10,130,68);
    ctx.fillStyle="rgba(8,20,30,.85)";ctx.fillRect(-256,22,86,26);ctx.strokeStyle="rgba(143,190,214,.5)";ctx.lineWidth=2;ctx.strokeRect(-256,22,86,26);
    ctx.restore();
  }
  ctx.restore();
}
function drawPerson(ctx,S,V){
  const a=S.xray;if(a<.05||S.t<2.8)return;const t=S.t,bob=Math.sin(t*2.4)*1.6,[hx,hy]=V.toS(105,1986+bob);
  ctx.save();ctx.globalAlpha=a;ctx.translate(hx,hy);ctx.scale(V.z,V.z);
  poly(ctx,[[-11,12],[11,12],[9,40],[-9,40]],"#8fa3b2");
  ctx.lineCap="round";ctx.strokeStyle="#b98a6c";ctx.lineWidth=5;seg(ctx,-10,15,-19,30+Math.sin(t*1.7)*3);seg(ctx,10,15,18,-6);
  ctx.strokeStyle="#5d6f7d";ctx.lineWidth=6;seg(ctx,-4,40,-6,56);seg(ctx,4,40,7,56);
  circ(ctx,0,0,11,"#b98a6c");ctx.beginPath();ctx.arc(0,-2,11.5,Math.PI,0);ctx.fillStyle="#241b16";ctx.fill();
  ctx.restore();
}
function drawBubbles(ctx,S,V){
  const t=S.t;if(t<1.1||t>4.6)return;
  for(let i=0;i<46;i++){const ts=1.15+i*.034,age=t-ts;if(age<0||age>1.7)continue;const st=tugState(ts);
    const wx=st.x+(hash(i)-.5)*260+Math.sin(age*6+i)*10,wy=st.y+(hash(i+7)-.5)*60-age*(260+hash(i+3)*200);if(wy<6)continue;
    const r=(4+hash(i+11)*10)*(1+age*.3)*V.z,[x,y]=V.toS(wx,wy),al=Math.min(1,age*6)*(1-age/1.7);
    ctx.strokeStyle=`rgba(210,236,248,${.7*al})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,r,0,6.2832);ctx.stroke();circ(ctx,x-r*.35,y-r*.35,r*.25,`rgba(255,255,255,${.5*al})`)}
}
function drawSplash(ctx,S,V){
  const age=S.t-.95;if(age<0||age>.9)return;
  for(let i=0;i<34;i++){const vx=(hash(i+40)-.5)*520,vy=-(320+hash(i+41)*460),wx=(hash(i+42)-.5)*320+vx*age,wy=vy*age+.5*1300*age*age;if(wy>12)continue;
    const [x,y]=V.toS(wx,wy);circ(ctx,x,y,(3+hash(i+43)*6)*V.z,`rgba(230,244,250,${.85*(1-age/.9)})`)}
}
function drawSilt(ctx,S,V){
  const age=S.t-2.68;if(age<0||age>2.4)return;
  for(let i=0;i<46;i++){const dir=hash(i+60)*2-1,dist=(60+hash(i+61)*300)*E.out(clamp(age/1.3)),wx=dir*dist+(dir>0?150:-150),wy=SEABED-8-hash(i+62)*90*E.out(clamp(age/1.6));
    const [x,y]=V.toS(wx,wy);circ(ctx,x,y,(10+hash(i+63)*16)*(.6+age*.4)*V.z,`rgba(120,132,118,${.07*(1-age/2.4)})`)}
}
function drawSeabed(ctx,S,V){
  const vp=V.vp,[,sy]=V.toS(0,SEABED);if(sy>vp.y+vp.h+60)return;
  ctx.beginPath();let first=true;for(let sx=vp.x-24;sx<=vp.x+vp.w+24;sx+=20){const wx=V.toW(sx,0)[0],wy=SEABED+Math.sin(wx*.008)*12+noise1(wx*.01)*10,[,yy]=V.toS(wx,wy);if(first){ctx.moveTo(sx,yy);first=false}else ctx.lineTo(sx,yy)}
  ctx.lineTo(vp.x+vp.w+24,vp.y+vp.h+24);ctx.lineTo(vp.x-24,vp.y+vp.h+24);ctx.closePath();
  const g=ctx.createLinearGradient(0,sy-20,0,sy+260*V.z);g.addColorStop(0,rgb(mixc(C("#28363b"),C("#46605f"),S.dl)));g.addColorStop(1,"#060b0e");ctx.fillStyle=g;ctx.fill();
  [[-420,10,60],[-260,4,34],[560,8,70],[700,2,40],[120,-2,26]].forEach((r,i)=>{const [x,y]=V.toS(r[0],SEABED+r[1]),s=r[2]*V.z;poly(ctx,[[x-s,y+s*.3],[x-s*.6,y-s*.55],[x+s*.2,y-s*.7],[x+s,y+s*.3]],i%2?"#1d2a2e":"#233237")});
}
function drawDiver(ctx,S,V){
  const D=S.D;if(!D.vis)return;const [x,y]=V.toS(D.x,D.y),z=V.z;
  ctx.save();ctx.globalAlpha=D.a;
  ctx.strokeStyle="rgba(226,190,80,.75)";ctx.lineWidth=3*z;ctx.beginPath();ctx.moveTo(x+20*z,y-22*z);const [ux,uy]=V.toS(D.x+260,D.y-1500);ctx.quadraticCurveTo(x+170*z,y-220*z,ux,uy);ctx.stroke();
  ctx.translate(x,y);ctx.scale(z,z);ctx.rotate(-.1);
  poly(ctx,[[44,-10],[96,-4],[98,8],[48,10]],"#18232e");poly(ctx,[[96,-9],[130,-16],[132,10],[98,10]],"#d8a935");
  poly(ctx,[[-30,-14],[46,-16],[52,10],[-26,14]],"#1b2733");poly(ctx,[[-6,-27],[40,-27],[40,-15],[-6,-15]],"#c4c8cc");
  circ(ctx,-42,-4,20,"#d8a935");circ(ctx,-51,-4,10,"#12202a");circ(ctx,-54,-23,5.5,"#fff4d4");
  const ex=lerp(-40,-125,D.reach),ey=lerp(18,10,D.reach);ctx.lineCap="round";ctx.strokeStyle="#1b2733";ctx.lineWidth=9;seg(ctx,-26,6,ex,ey);circ(ctx,ex,ey,7.5,"#2d3c49");
  ctx.restore();
}
function drawLamp(ctx,S,V){
  const D=S.D;if(!D.vis)return;const al=D.a*inv(7.3,7.9,S.t),[lx,ly]=V.toS(D.x-54,D.y-24),[tx,ty]=V.toS(262,2012);
  const ang=Math.atan2(ty-ly,tx-lx),L=520*V.z,sp=.21;
  ctx.save();ctx.globalCompositeOperation="lighter";
  const g=ctx.createRadialGradient(lx,ly,0,lx,ly,L);g.addColorStop(0,`rgba(255,236,190,${.5*al})`);g.addColorStop(.6,`rgba(255,230,180,${.16*al})`);g.addColorStop(1,"rgba(255,230,180,0)");
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(lx+Math.cos(ang-sp)*L,ly+Math.sin(ang-sp)*L);ctx.lineTo(lx+Math.cos(ang+sp)*L,ly+Math.sin(ang+sp)*L);ctx.closePath();ctx.fill();
  circ(ctx,lx,ly,14*V.z,`rgba(255,244,212,${.6*al})`);ctx.restore();
}
function drawHand(ctx,S,V){
  const t=S.t,em=E.out(inv(9.55,10,t));if(em<=0||t>11.75)return;const grab=E.out(inv(10.28,10.42,t)),[x,y]=V.toS(lerp(244,302,em),2014);
  ctx.save();ctx.globalAlpha=1-inv(11.4,11.75,t);ctx.translate(x,y);ctx.scale(V.z,V.z);
  poly(ctx,[[-72,-7],[-8,-9],[-6,8],[-72,9]],"#8f6a55");poly(ctx,[[-10,-11],[9,-12],[14,8],[-8,10]],"#c39a7e");
  ctx.lineCap="round";ctx.strokeStyle="#c39a7e";ctx.lineWidth=5;
  for(let i=0;i<4;i++){const fy=-9+i*5.5,a1=grab*.9+i*.04,a2=a1+grab*1.1,kx=12,mx=kx+Math.cos(a1)*11,my=fy+Math.sin(a1)*11;ctx.beginPath();ctx.moveTo(kx,fy);ctx.lineTo(mx,my);ctx.lineTo(mx+Math.cos(a2)*9,my+Math.sin(a2)*9);ctx.stroke()}
  ctx.beginPath();ctx.moveTo(0,8);ctx.lineTo(10,15-grab*4);ctx.lineTo(16,12-grab*9);ctx.stroke();
  ctx.restore();
}
function drawBell(ctx,S,V){
  const B=S.B;if(B.a<=0)return;const [x,y]=V.toS(B.x,B.y),z=V.z,[ux,uy]=V.toS(B.x,B.y-2400);
  ctx.save();ctx.globalAlpha=B.a;ctx.strokeStyle="rgba(200,206,212,.6)";ctx.lineWidth=3*z;seg(ctx,x,y-60*z,ux,uy);
  ctx.translate(x,y);ctx.scale(z,z);rr(ctx,-48,-64,96,128,44);ctx.fillStyle="#d8a935";ctx.fill();
  ctx.fillStyle="#9c7520";ctx.fillRect(-48,8,96,10);circ(ctx,0,-14,26,"#0d1a24");circ(ctx,-9,-14,8,"#b98a6c");circ(ctx,10,-12,8,"#d8a935");
  ctx.restore();
}
function drawCallout(ctx,S,V,small){
  const t=S.t,a=inv(3.35,3.6,t)*(1-inv(6.8,7.2,t));if(a<=0)return;const p=E.back(inv(3.38,3.75,t)),z=V.z;
  const [cx,cy]=V.toS(105,1987);ctx.save();ctx.globalAlpha=a;
  ctx.strokeStyle=ACC;ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(cx,cy,80*z*p,30*z*p,0,0,6.2832);ctx.stroke();
  const [bx,by0]=V.toS(182,1972),[,by1]=V.toS(182,2002);ctx.lineWidth=3;seg(ctx,bx,by0,bx,by1);seg(ctx,bx-10,by0,bx+10,by0);seg(ctx,bx-10,by1,bx+10,by1);
  const lx=Math.min(cx+40,V.vp.x+V.vp.w-360),ly=Math.max(cy-30*z-120,V.vp.y+60);
  ctx.lineWidth=2.5;seg(ctx,cx+20,cy-26*z*p,lx+30,ly+34);
  ctx.font=`700 ${small?34:40}px ${DISP}`;const label="AIR POCKET  ≈ 1.2 m",tw=ctx.measureText(label).width;
  rr(ctx,lx,ly-8,tw+32,58,12);ctx.fillStyle="rgba(8,14,20,.82)";ctx.fill();ctx.strokeStyle="rgba(255,200,61,.6)";ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle=ACC;ctx.textAlign="left";ctx.textBaseline="middle";ctx.fillText(label,lx+16,ly+21);
  const na=inv(2.95,3.2,t)*(1-inv(4.3,4.6,t));
  if(na>0){const [px,py]=V.toS(105,2048);ctx.globalAlpha=na;ctx.font=`600 ${small?26:30}px ${DISP}`;const nl="HARRISON OKENE · SHIP'S COOK",nw=ctx.measureText(nl).width;rr(ctx,px-nw/2-14,py+16,nw+28,44,10);ctx.fillStyle="rgba(8,14,20,.8)";ctx.fill();ctx.fillStyle="#e9eef3";ctx.textAlign="center";ctx.fillText(nl,px,py+39)}
  ctx.restore();
}

function drawScene(ctx,S,vp){
  const V=makeView(S,vp),t=S.t,dl=S.dl;
  ctx.save();ctx.beginPath();ctx.rect(vp.x,vp.y,vp.w,vp.h);ctx.clip();
  const g=ctx.createLinearGradient(0,vp.y,0,vp.y+vp.h);g.addColorStop(0,rgb(mixc(SKT_N,SKT_D,dl)));g.addColorStop(1,rgb(mixc(SKB_N,SKB_D,dl)));ctx.fillStyle=g;ctx.fillRect(vp.x,vp.y,vp.w,vp.h);
  const [,surf]=V.toS(0,0);
  if(surf>vp.y){
    for(let i=0;i<70;i++){const [x,y]=V.toS(hash(i)*3200-1600,-50-hash(i+50)*1300);if(y>surf-20||y<vp.y||x<vp.x||x>vp.x+vp.w)continue;const tw=.5+.5*Math.sin(t*3+i*1.7);ctx.fillStyle=`rgba(230,238,255,${(.25+.6*hash(i+9)*tw)*(1-dl)})`;ctx.fillRect(x,y,2.6,2.6)}
    const [mx,my]=V.toS(380,-380),mr=46*V.z;const mg=ctx.createRadialGradient(mx,my,mr*.6,mx,my,mr*4);mg.addColorStop(0,`rgba(230,236,255,${.25*(1-dl)})`);mg.addColorStop(1,"rgba(230,236,255,0)");ctx.fillStyle=mg;ctx.fillRect(mx-mr*4,my-mr*4,mr*8,mr*8);circ(ctx,mx,my,mr,`rgba(238,240,248,${.95*(1-dl)})`);
  }
  // water
  const d0=clamp(V.toW(0,Math.max(vp.y,surf))[1]/SEABED),d1=clamp(V.toW(0,vp.y+vp.h)[1]/SEABED);
  const wt=mixc(WT_N,WT_D,dl),wd=mixc(WD_N,WD_D,dl*.7);
  const wg=ctx.createLinearGradient(0,Math.max(vp.y,surf),0,vp.y+vp.h);wg.addColorStop(0,rgb(mixc(wt,wd,Math.pow(d0,.7))));wg.addColorStop(1,rgb(mixc(wt,wd,Math.pow(d1,.7))));
  ctx.beginPath();let first=true;for(let sx=vp.x-20;sx<=vp.x+vp.w+20;sx+=16){const wx=V.toW(sx,0)[0],[,yy]=V.toS(wx,waveY(wx,t));if(first){ctx.moveTo(sx,yy);first=false}else ctx.lineTo(sx,yy)}
  ctx.lineTo(vp.x+vp.w+20,vp.y+vp.h+20);ctx.lineTo(vp.x-20,vp.y+vp.h+20);ctx.closePath();ctx.fillStyle=wg;ctx.fill();
  if(surf>vp.y-200){ctx.strokeStyle=`rgba(190,225,240,${.35+.3*dl})`;ctx.lineWidth=2.5;ctx.stroke()}
  // light shafts
  if(surf<vp.y+vp.h&&V.toW(0,vp.y+vp.h)[1]>0&&S.cam[1]<1300){ctx.save();ctx.globalCompositeOperation="lighter";for(let i=0;i<6;i++){const x0=-560+i*230+Math.sin(t*.3+i)*40,[ax,ay]=V.toS(x0,0),[bx,by]=V.toS(x0+60,0),[cx2,cy2]=V.toS(x0+480,1500),[dx,dy]=V.toS(x0+260,1500);
    const sg=ctx.createLinearGradient(0,ay,0,dy);sg.addColorStop(0,`rgba(170,215,235,${(.05+.03*Math.sin(t*.8+i))*(.35+dl)})`);sg.addColorStop(1,"rgba(170,215,235,0)");ctx.fillStyle=sg;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.lineTo(cx2,cy2);ctx.lineTo(dx,dy);ctx.closePath();ctx.fill()}ctx.restore()}
  if(dl>.02){const lg=ctx.createLinearGradient(0,vp.y,0,vp.y+vp.h*.7);lg.addColorStop(0,`rgba(130,200,225,${.22*dl})`);lg.addColorStop(1,"rgba(130,200,225,0)");ctx.fillStyle=lg;ctx.fillRect(vp.x,vp.y,vp.w,vp.h)}
  drawSplash(ctx,S,V);drawTug(ctx,S,V);drawPerson(ctx,S,V);drawBubbles(ctx,S,V);drawSeabed(ctx,S,V);drawSilt(ctx,S,V);drawBell(ctx,S,V);drawDiver(ctx,S,V);
  if(S.dark>0){ctx.fillStyle=`rgba(1,4,8,${S.dark})`;ctx.fillRect(vp.x,vp.y,vp.w,vp.h)}
  drawLamp(ctx,S,V);drawHand(ctx,S,V);
  // marine snow, in front, screen-space parallax
  for(let i=0;i<80;i++){const px=vp.x+((hash(i+200)*vp.w+Math.sin(t*.4+i)*14-S.cam[0]*.08*(.5+hash(i+201)))%vp.w+vp.w)%vp.w,py=vp.y+((hash(i+202)*vp.h-t*(14+hash(i+203)*26)-S.cam[1]*.12*(.5+hash(i+204)))%vp.h+vp.h)%vp.h;if(py<surf+6)continue;circ(ctx,px,py,1.4+hash(i+205)*2.2,`rgba(200,225,235,${.18+.3*hash(i+206)})`)}
  drawCallout(ctx,S,V,vp.h<1200);
  // vignette
  const vg=ctx.createRadialGradient(vp.x+vp.w/2,vp.y+vp.h/2,vp.h*.25,vp.x+vp.w/2,vp.y+vp.h/2,vp.h*.78);vg.addColorStop(0,"rgba(0,0,0,0)");vg.addColorStop(1,"rgba(0,0,0,.42)");ctx.fillStyle=vg;ctx.fillRect(vp.x,vp.y,vp.w,vp.h);
  ctx.restore();
}

/* ---- captions ---- */
const LINES=[
 {t0:.05,t1:2.3,at:[.05,.22,.62,1.05,1.25],text:"This tugboat flipped and sank."},
 {t0:2.4,t1:4.3,at:[2.4,2.52,2.75,2.95,3.02,3.3,3.4],text:"The cook found a pocket of air."},
 {t0:4.4,t1:7.0,at:[4.4,4.52,4.85,4.98,5.15,5.45],text:"He breathed it for 60 hours."},
 {t0:7.1,t1:9.0,at:[7.1,7.42,7.62,7.74,8.1],text:"Divers came to recover bodies."},
 {t0:9.1,t1:11.4,at:[9.1,9.28,9.48,9.58,9.66,9.95,10.08,10.15,10.3],text:"One reached for a hand… and it grabbed back.",slam:8},
 {t0:11.55,t1:14.15,at:[11.55,11.68,11.9,12.15,12.45,12.7,12.8],text:"He still needed 2.5 days to decompress."},
 {t0:14.25,t1:16,q:true}
];
function lineWords(L){
  if(!L.q||L.at)return {words:(L.text||QUESTIONS[qIndex].text).split(" "),at:L.at};
  const words=QUESTIONS[qIndex].text.split(" "),n=words.length,span=1.15,at=words.map((w,i)=>L.t0+i*span/n);return {words,at};
}
const layoutCache={};
function layoutLine(ctx,key,words,font,maxW){
  const ck=key+"|"+font+"|"+words.join(" ");if(layoutCache[ck])return layoutCache[ck];
  ctx.font=font;const sp=ctx.measureText(" ").width,ws=words.map(w=>ctx.measureText(w).width),rows=[[]];let cw=0;
  ws.forEach((w,i)=>{if(cw>0&&cw+sp+w>maxW){rows.push([]);cw=0}rows[rows.length-1].push(i);cw+=(cw>0?sp:0)+w});
  const pos=[];rows.forEach((r,ri)=>{const tot=r.reduce((s,i)=>s+ws[i],0)+sp*(r.length-1);let x=-tot/2;r.forEach(i=>{pos[i]={x:x+ws[i]/2,row:ri};x+=ws[i]+sp})});
  return layoutCache[ck]={pos,rows:rows.length};
}
function drawCaptions(ctx,S){
  const t=S.t;
  for(const L of LINES){if(t<L.t0||t>L.t1)continue;const {words,at}=lineWords(L);
    const q=!!L.q,size=q?92:76,font=`700 ${size}px ${DISP}`,lay=layoutLine(ctx,L.t0,words,font,q?860:900),lh=size*1.12;
    const baseY=q?1010-((lay.rows-1)*lh)/2:548,exit=q?0:inv(L.t1-.18,L.t1,t);
    ctx.save();ctx.font=font;ctx.textAlign="center";ctx.textBaseline="middle";ctx.lineJoin="round";
    if(q){const pa=E.out(inv(L.t0-.05,L.t0+.25,t)),ph=lay.rows*lh+60;ctx.globalAlpha=pa;rr(ctx,90,baseY-lh/2-30,900,ph,26);ctx.fillStyle="rgba(6,12,18,.72)";ctx.fill();ctx.globalAlpha=1}
    let active=-1;at.forEach((a,i)=>{if(t>=a)active=i});
    words.forEach((w,i)=>{if(t<at[i])return;const p=inv(at[i],at[i]+.16,t);let sc=lerp(.72,1,E.back(p)),col=i===active?ACC:"#ffffff";
      if(L.slam===i){const sp=inv(at[i],at[i]+.24,t);sc=lerp(1.9,1,E.back(sp));col="#ff9b4a"}
      const wk=w.toLowerCase().replace(/[^a-z]/g,"");let ky=0,kr=0,kx=1;
      if(wk==="sank"){const k=E.io(inv(at[i]+.1,at[i]+.65,t));ky=k*44;kr=k*.1;if(i!==active)col="#9fd4ee"}
      if(wk==="air"){sc*=1+.22*Math.sin(Math.PI*inv(at[i],at[i]+.42,t));col=i===active?"#d6f4ff":col}
      if(wk==="grabbed"){kx=1-.22*Math.sin(Math.PI*inv(at[i]+.08,at[i]+.4,t))}
      const x=540+lay.pos[i].x,y=baseY+lay.pos[i].row*lh-exit*24+ky;
      ctx.save();ctx.globalAlpha=clamp((t-at[i])/.06)*(1-exit);ctx.translate(x,y);ctx.rotate(kr);ctx.scale(sc*kx,sc);
      ctx.lineWidth=12;ctx.strokeStyle="rgba(4,9,14,.55)";ctx.strokeText(w,0,0);ctx.fillStyle=col;ctx.fillText(w,0,0);ctx.restore()});
    if(q){const ch=QUESTIONS[qIndex].chips;ch.forEach((c,i)=>{const ct=(L.chipAt||L.t0+1.3)+i*.16,p=E.back(inv(ct,ct+.3,t));if(p<=0)return;const cx=540+(i-(ch.length-1)/2)*260,cy=baseY+lay.rows*lh+40;
      ctx.save();ctx.translate(cx,cy);ctx.scale(p,p);rr(ctx,-110,-40,220,80,40);ctx.fillStyle=i?"rgba(57,135,229,.9)":"rgba(255,200,61,.95)";ctx.fill();ctx.font=`800 46px ${DISP}`;ctx.fillStyle=i?"#ffffff":"#1b1404";ctx.fillText(c,0,3);ctx.restore()})}
    ctx.restore();
  }
}
function drawBandCaption(ctx,S){
  const t=S.t;
  for(const L of LINES){if(t<L.t0||t>L.t1)continue;const {words,at}=lineWords(L);const groups=[];for(let i=0;i<words.length;i+=3)groups.push(i);
    let gi=0;groups.forEach((s,k)=>{if(t>=at[s])gi=k});const s=groups[gi],ws=words.slice(s,s+3);if(t<at[s])return;
    let hi=0;ws.forEach((w,i)=>{if(w.length>ws[hi].length)hi=i});
    ctx.save();ctx.font=`700 66px ${DISP}`;ctx.textBaseline="middle";const sp=ctx.measureText(" ").width,wd=ws.map(w=>ctx.measureText(w).width),tot=wd.reduce((a,b)=>a+b,0)+sp*(ws.length-1);let x=540-tot/2;
    ws.forEach((w,i)=>{ctx.fillStyle=i===hi?"#f2c14e":"#ffffff";ctx.textAlign="left";ctx.fillText(w,x,265);x+=wd[i]+sp});ctx.restore();
  }
}

/* ---- HUD ---- */
function pill(ctx,x,y,text,font,align){ctx.font=font;const w=ctx.measureText(text).width+36,x0=align==="right"?x-w:x;rr(ctx,x0,y,w,52,26);ctx.fillStyle="rgba(6,12,18,.6)";ctx.fill();ctx.strokeStyle="rgba(255,255,255,.16)";ctx.lineWidth=2;ctx.stroke();ctx.fillStyle="#e9eef3";ctx.textAlign="left";ctx.textBaseline="middle";ctx.fillText(text,x0+18,y+27);return w}
function drawHUD(ctx,S){
  const t=S.t;ctx.save();
  // context pill
  const pa=E.back(inv(.25,.6,t));ctx.save();ctx.globalAlpha=clamp(pa);ctx.translate(lerp(-60,0,clamp(pa)),0);pill(ctx,48,205,"JASCON-4 · GULF OF GUINEA · 26 MAY 2013",`600 28px ${DISP}`);ctx.restore();
  // depth gauge
  const ga=Math.max(inv(.55,.85,t)*(1-inv(7.2,7.6,t)),inv(11.9,12.2,t)*(1-inv(14.0,14.3,t)));
  if(ga>0){ctx.save();ctx.globalAlpha=ga;const gx=66,gy0=690,gy1=1330,yy=m=>lerp(gy0,gy1,m/30);
    ctx.strokeStyle="rgba(233,238,243,.55)";ctx.lineWidth=3;seg(ctx,gx,gy0,gx,gy1);
    ctx.font=`500 24px ${MONO}`;ctx.fillStyle="rgba(233,238,243,.75)";ctx.textAlign="left";ctx.textBaseline="middle";
    for(let m=0;m<=30;m+=2.5){const maj=m%10===0;ctx.lineWidth=maj?3:2;seg(ctx,gx,yy(m),gx+(maj?26:14),yy(m));if(maj)ctx.fillText(m+" m",gx+34,yy(m))}
    const my=yy(S.depth);ctx.fillStyle=ACC;ctx.beginPath();ctx.moveTo(gx-4,my);ctx.lineTo(gx-26,my-14);ctx.lineTo(gx-26,my+14);ctx.closePath();ctx.fill();
    ctx.font=`700 46px ${DISP}`;const dv=S.depth.toFixed(S.depth>=29.95?0:1)+" m";const dw=ctx.measureText(dv).width;rr(ctx,gx+30,my-30,dw+28,60,12);ctx.fillStyle="rgba(6,12,18,.75)";ctx.fill();ctx.fillStyle=ACC;ctx.fillText(dv,gx+44,my+2);
    ctx.font=`600 24px ${DISP}`;ctx.fillStyle="rgba(233,238,243,.7)";ctx.fillText("DEPTH",gx-8,gy0-34);ctx.restore()}
  // hours counter
  const ca=inv(3.3,3.6,t)*(1-inv(11.2,11.5,t));
  if(ca>0){ctx.save();ctx.globalAlpha=ca;const rx=1032,h=S.h,lock=t>6.9?E.out(1-inv(6.9,7.3,t)):0;
    ctx.font=`600 26px ${DISP}`;ctx.textAlign="right";ctx.textBaseline="alphabetic";ctx.fillStyle="rgba(233,238,243,.75)";ctx.fillText("HOURS TRAPPED",rx,300);
    const dh=104,dwid=62,top=314;ctx.font=`800 ${dh}px ${DISP}`;ctx.textAlign="center";ctx.textBaseline="top";
    const units=h%10,tens=Math.floor(h/10)%10,fu=h-Math.floor(h),ft=Math.floor(units)===9?fu:0;
    [[tens,ft,rx-dwid*1.5-6],[Math.floor(units),fu,rx-dwid*.5]].forEach(([d,f,x])=>{d=Math.floor(d);ctx.save();ctx.beginPath();ctx.rect(x-dwid/2-4,top,dwid+8,dh);ctx.clip();
      ctx.fillStyle=lock>0?`rgb(255,${Math.round(200+55*(1-lock))},${Math.round(61+194*(1-lock))})`:"#ffffff";
      if(h>=60){ctx.fillText(String(d),x,top)}else{ctx.fillText(String(d),x,top-f*dh);ctx.fillText(String((d+1)%10),x,top+(1-f)*dh)}ctx.restore()});
    if(lock>0){ctx.strokeStyle=`rgba(255,200,61,${lock})`;ctx.lineWidth=4;rr(ctx,rx-dwid*2-22,top-8,dwid*2+30,dh+16,14);ctx.stroke()}
    // date chip with sun/moon
    const tod=(4.8+h),day=26+Math.floor(tod/24),dl=S.dl;ctx.textBaseline="middle";const dx=rx-196,dy=top+dh+40;
    ctx.font=`600 28px ${DISP}`;const lab=day+" MAY";const lw=ctx.measureText(lab).width;rr(ctx,rx-lw-86,dy-24,lw+86,48,24);ctx.fillStyle="rgba(6,12,18,.6)";ctx.fill();
    if(dl>.15){circ(ctx,rx-lw-56,dy,11,"#ffd76a")}else{circ(ctx,rx-lw-56,dy,11,"#e8ecf4");circ(ctx,rx-lw-50,dy-4,10,"rgba(14,24,34,1)")}
    ctx.fillStyle="#e9eef3";ctx.textAlign="right";ctx.fillText(lab,rx-18,dy+1);
    const dayFlip=[19.2,43.2].map(hh=>hh);dayFlip.forEach(hh=>{const tt=4.6+2.3*Math.acos(1-2*hh/60)/Math.PI,k=inv(tt,tt+.35,t)*(1-inv(tt+.35,tt+.7,t));if(k>0){ctx.strokeStyle=`rgba(255,200,61,${k})`;ctx.lineWidth=3;rr(ctx,rx-lw-90,dy-28,lw+94,56,28);ctx.stroke()}});
    void dx;ctx.restore()}
  // decompression bar
  const ba=inv(11.75,12.0,t)*(1-inv(14.1,14.35,t));
  if(ba>0){ctx.save();ctx.globalAlpha=ba;const p=E.io(inv(12,13.9,t)),x1=1032,w=400,y=335;
    ctx.font=`600 26px ${DISP}`;ctx.textAlign="right";ctx.fillStyle="rgba(233,238,243,.75)";ctx.fillText("DECOMPRESSION",x1,y-16);
    rr(ctx,x1-w,y,w,26,13);ctx.fillStyle="rgba(6,12,18,.65)";ctx.fill();if(p>0){rr(ctx,x1-w,y,Math.max(26,w*p),26,13);ctx.fillStyle=ACC;ctx.fill()}
    ctx.font=`800 64px ${DISP}`;ctx.fillStyle="#ffffff";ctx.textBaseline="top";ctx.fillText((p*2.5).toFixed(1)+" DAYS",x1,y+40);ctx.restore()}
  // footnote
  ctx.globalAlpha=.6;ctx.font=`500 24px ${DISP}`;ctx.textAlign="left";ctx.textBaseline="alphabetic";ctx.fillStyle="#e9eef3";ctx.fillText("Illustration · not to scale · Wikipedia; ABC News, Dec 2013",48,1450);
  ctx.font=`700 30px ${DISP}`;ctx.globalAlpha=.75;ctx.fillText("curio",48,1492);
  ctx.restore();
}
let grain=null;
function fx(ctx,S,vp){
  const t=S.t;
  if(!grain){grain=document.createElement("canvas");grain.width=grain.height=180;const g=grain.getContext("2d"),id=g.createImageData(180,180);let s=11;for(let i=0;i<id.data.length;i+=4){s=(s*16807)%2147483647;const v=s%255;id.data[i]=id.data[i+1]=id.data[i+2]=v;id.data[i+3]=255}g.putImageData(id,0,0)}
  ctx.save();ctx.beginPath();ctx.rect(vp.x,vp.y,vp.w,vp.h);ctx.clip();ctx.globalAlpha=.045;ctx.globalCompositeOperation="overlay";const f=Math.floor(t*24),ox=(f*53)%180,oy=(f*97)%180;
  for(let x=vp.x-ox;x<vp.x+vp.w;x+=180)for(let y=vp.y-oy;y<vp.y+vp.h;y+=180)ctx.drawImage(grain,x,y);ctx.restore();
  let fl=0;if(t>=10.3&&t<10.39)fl=.65*(1-inv(10.3,10.39,t));if(t>15.82)fl=Math.max(fl,.5*inv(15.82,16,t));
  if(fl>0){ctx.fillStyle=`rgba(235,245,255,${fl})`;ctx.fillRect(vp.x,vp.y,vp.w,vp.h)}
}

function render(ctx,t,mode){
  const S=state(t);
  if(mode==="full"){
    ctx.save();ctx.translate(S.shake[0],S.shake[1]);
    const pz=t>15.6?1+.12*E.in(inv(15.6,16,t)):1;if(pz>1){ctx.translate(540,800);ctx.scale(pz,pz);ctx.translate(-540,-800)}
    drawScene(ctx,S,{x:-24,y:-24,w:W+48,h:H+48,fy:.56});ctx.restore();
    drawHUD(ctx,S);drawCaptions(ctx,S);fx(ctx,S,{x:0,y:0,w:W,h:H});
  }else{
    const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#1c242d");g.addColorStop(.5,"#11171e");g.addColorStop(1,"#0a0f14");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    const vp={x:0,y:450,w:W,h:880,fy:.5};
    ctx.save();ctx.translate(S.shake[0]*.6,S.shake[1]*.6);drawScene(ctx,S,vp);ctx.restore();fx(ctx,S,vp);
    drawBandCaption(ctx,S);
    ctx.font=`500 30px ${DISP}`;ctx.textAlign="center";ctx.textBaseline="alphabetic";ctx.fillStyle="rgba(220,226,232,.75)";ctx.fillText("Curio mechanism illustration",540,1400);
    ctx.font=`600 32px ${DISP}`;ctx.textAlign="right";ctx.fillStyle="rgba(220,226,232,.6)";ctx.fillText("curio",1010,1560);
  }
}

/* ---- sound (WebAudio, synthesized) ---- */
const Snd={ac:null,out:null,noise:null,drone:null,on:false,
  init(){if(this.ac)return true;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;this.ac=new AC();const comp=this.ac.createDynamicsCompressor();this.out=this.ac.createGain();this.out.gain.value=.55;this.out.connect(comp);comp.connect(this.ac.destination);
    const len=this.ac.sampleRate,b=this.ac.createBuffer(1,len,len),d=b.getChannelData(0);let s=7;for(let i=0;i<len;i++){s=(s*16807)%2147483647;d[i]=s/2147483647*2-1}this.noise=b;return true},
  env(g,w,a,pk,dur){g.gain.setValueAtTime(.0001,w);g.gain.exponentialRampToValueAtTime(pk,w+a);g.gain.exponentialRampToValueAtTime(.0001,w+dur)},
  boom(w,f0,f1,dur,pk){const o=this.ac.createOscillator(),g=this.ac.createGain();o.frequency.setValueAtTime(f0,w);o.frequency.exponentialRampToValueAtTime(f1,w+dur);this.env(g,w,.01,pk,dur);o.connect(g);g.connect(this.out);o.start(w);o.stop(w+dur+.05)},
  hiss(w,dur,fr,q,pk,type){const s=this.ac.createBufferSource();s.buffer=this.noise;const f=this.ac.createBiquadFilter();f.type=type||"bandpass";f.frequency.value=fr;f.Q.value=q;const g=this.ac.createGain();this.env(g,w,Math.min(.08,dur*.3),pk,dur);s.connect(f);f.connect(g);g.connect(this.out);s.start(w,Math.random()*.4);s.stop(w+dur+.05)},
  tone(w,fr,dur,pk,type){const o=this.ac.createOscillator(),g=this.ac.createGain();o.type=type||"sine";o.frequency.value=fr;this.env(g,w,.005,pk,dur);o.connect(g);g.connect(this.out);o.start(w);o.stop(w+dur+.05)},
  chirp(w,f0,f1,dur,pk){const o=this.ac.createOscillator(),g=this.ac.createGain();o.frequency.setValueAtTime(f0,w);o.frequency.exponentialRampToValueAtTime(f1,w+dur);this.env(g,w,.004,pk,dur);o.connect(g);g.connect(this.out);o.start(w);o.stop(w+dur+.05)},
  setDrone(on){const ac=this.ac;if(!this.drone){const g=ac.createGain();g.gain.value=.0001;const f=ac.createBiquadFilter();f.type="lowpass";f.frequency.value=230;[55,55.7,82.4].forEach(fr=>{const o=ac.createOscillator();o.type="sawtooth";o.frequency.value=fr;o.connect(f);o.start()});f.connect(g);g.connect(this.out);this.drone=g}
    this.drone.gain.cancelScheduledValues(ac.currentTime);this.drone.gain.setTargetAtTime(on?.05:.0001,ac.currentTime,.4)}
};
const EVENTS=[
 [.12,w=>Snd.hiss(w,.9,420,.7,.22,"lowpass")],[.5,w=>Snd.boom(w,70,48,.7,.25)],[1.02,w=>{Snd.boom(w,85,28,1.2,.7);Snd.hiss(w,.6,2400,.5,.25,"highpass")}],
 [2.72,w=>{Snd.boom(w,58,24,.9,.75);Snd.hiss(w,.7,300,.8,.3,"lowpass")}],[2.92,w=>{Snd.tone(w,880,.6,.06);Snd.tone(w+.04,1320,.5,.04)}],
 [3.4,w=>{Snd.tone(w,1568,.5,.12);Snd.tone(w,2352,.35,.05)}],[7.0,w=>Snd.tone(w,440,.9,.12,"triangle")],[7.32,w=>Snd.tone(w,1100,1.6,.08)],
 [9.6,w=>{Snd.boom(w,62,40,.22,.45);Snd.boom(w+.18,56,38,.22,.32)}],[9.98,w=>{Snd.boom(w,62,40,.22,.5);Snd.boom(w+.16,56,38,.22,.36)}],
 [10.3,w=>{Snd.boom(w,90,22,1.4,.9);Snd.hiss(w,.35,1800,.6,.4,"bandpass")}],[11.9,w=>{Snd.tone(w,523,1.2,.08);Snd.tone(w,784,1,.05)}],
 [14.25,w=>{Snd.tone(w,784,.4,.1);Snd.tone(w+.16,1046,.6,.1)}],[15.8,w=>Snd.hiss(w,.25,900,.6,.25,"bandpass")]
];
for(let i=0;i<12;i++)EVENTS.push([1.3+i*.1+hash(i+90)*.06,w=>Snd.chirp(w,300+hash(i+91)*300,700+hash(i+92)*500,.08,.06)]);
(function(){let prevH=0;for(let t=4.6;t<=6.95;t+=.002){const h=Math.floor(hoursAt(t));if(h>prevH){prevH=h;const tt=t;EVENTS.push([tt,w=>Snd.tone(w,2400,.03,.05,"square")]);if(h===19||h===43)EVENTS.push([tt,w=>{Snd.tone(w,660,.5,.07);Snd.tone(w,990,.4,.05)}])}}})();
function fireAudio(a,b){if(!Snd.on||!Snd.ac)return;const now=Snd.ac.currentTime+.02;for(const [et,fn] of EVENTS)if(et>a&&et<=b)fn(now)}

window.OKENE={state,drawScene,drawHUD,drawCaptions,fx,LINES,EVENTS,Snd,E,inv,clamp,W,H};
})();