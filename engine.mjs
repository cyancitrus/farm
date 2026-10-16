export const CROPS=[['rice','水稻'],['wheat','小麦'],['corn','玉米'],['sugarcane','甘蔗'],['beet','甜菜'],['rapeseed','油菜'],['potato','土豆'],['peanut','花生'],['sweetpotato','红薯'],['rotten','烂菜叶子']].map(([id,name])=>({id,name}));
export const RANKS=['C','B','A','S','V','Phi'];
export const LAND_EFF=[50,80,100,110,120,150];
export const AVATARS=['man','woman','cat','dog','chicken','crest'];
export function timeOfDay(s){return s.ap<=1?'night':s.ap===2?'dusk':'day';}
export function cropStage(growth){return growth<30?'seedling':growth<70?'growing':'mature';}
export function celestialPosition(s){const ap=Math.max(1,Math.min(5,s.ap));return ({5:{x:32,y:29},4:{x:41,y:17},3:{x:54,y:17},2:{x:63,y:29},1:{x:54,y:17}})[ap];}
export function canAutoAdvance(s){return !!s&&s.initializationDone&&s.guideAsked&&!s.dead&&s.phase==='actions'&&s.ap===0&&!s.guess;}

export const LEVEL_AT=[0,3,6,9,12,15];
export const GAME_LIMIT=[23,19,15,12],GAME_PRIZE=[30,60,100,180],GAME_LEVEL=['EZ','HD','IN','AT'];
export const ACHIEVEMENTS=[
 {id:'host',name:'房主有神器',hint:'名字是 __HYC__'},
 {id:'soil',name:'沃土学子',hint:'土地达到沃土'},
 {id:'poor',name:'穷光蛋',hint:'金钱为负数死亡'},
 {id:'ill',name:'林黛玉',hint:'因疾病死亡'},
 {id:'seed',name:'晚起的农民被饿死',hint:'播种时没有种子'},
 {id:'hungry',name:'饿死鬼',hint:'连续两个月没吃饭'},
 {id:'honest',name:'老实人',hint:'没有向李荣军行贿'},
 {id:'cash1',name:'!穷光蛋',hint:'攒到 500 金'},
 {id:'cash2',name:'有钱 λ',hint:'攒到 2,000 金'},
 {id:'cash3',name:'喝酸奶不舔盖',hint:'攒到 10,000 金'},
 {id:'cash4',name:'喝酸奶只舔盖',hint:'攒到 100,000 金'},
 {id:'guessEZ',name:'好的，你是人类',hint:'通过 EZ'},
 {id:'guessHD',name:'！？强强？！',hint:'通过 HD'},
 {id:'guessIN',name:'！？神神？！',hint:'通过 IN'},
 {id:'guessAT',name:'！？龙龙？！',hint:'通过 AT'},
 {id:'donate1',name:'人人都献出一点爱',hint:'首次捐赠'},
 {id:'donate1000',name:'善！',hint:'累计捐赠达到 1,000 金'},
 {id:'donate10000',name:'声名远扬',hint:'累计捐赠达到 10,000 金'},
 {id:'donate100000',name:'兼济天下',hint:'累计捐赠达到 100,000 金'},
 {id:'farm',name:'农业技能高级抄手',hint:'农业技能满级'},
 {id:'body',name:'金刚不坏',hint:'身体素质满级'}
];
const MASK=(1n<<64n)-1n;
export function level(skill){let i=0;while(i<5&&skill>=LEVEL_AT[i+1])i++;return i;}
export function cropId(name){return CROPS.find(c=>c.name===name)?.id||'custom';}
export function cleanSeed(name){const x=String(name).trim().replace(/种子$/,'').slice(0,40)||'水稻';return ['__proto__','constructor','prototype'].includes(x)?'神秘作物':x;}
export function status(s){return s.dead?'已故':s.ill?'生病':s.hunger?'挨饿':'正常';}
export class Farm{
 constructor(state){this.s=state;this.notices=[];}
 static create(name,seed='水稻',appearance={}){
  const s={version:2,avatar:AVATARS.includes(appearance.avatar)?appearance.avatar:'man',gender:appearance.gender==='female'?'female':'male',initializationDone:false,initialSeedChosen:seed!=null,guideAsked:false,guessRulesSeen:false,plantShopTurn:0,waterMisses:0,pendingSettlement:null,dayActions:0,name:String(name).trim().slice(0,32)||'无名农民',money:0,rp:50,kindness:0,donatedTotal:0,land:1,quality:2,body:0,farm:0,month:1,year:1,ap:5,hunger:0,ill:false,illMonths:0,crop:'',growth:0,seeds:{},eff:100,water:false,eaten:false,weather:'sunny',baseWeather:'sunny',phase:'planting',event:null,guess:null,dead:null,achievements:[],bribed:false,taxSeen:0,lastMessage:'',turn:1,rng:String(BigInt(Date.now())^BigInt(Math.floor(Math.random()*0xffffffff)))};
  const g=new Farm(s);s.rp=s.name==='__HYC__'?100:g.rand(1,100);
  s.quality=s.rp>90?5:s.rp>=61?4:s.rp>=31?2:s.rp>=11?1:0;
  s.money=s.rp>=11&&s.rp<=30?100:g.lucky(200,300);
  s.seeds[cleanSeed(seed??'水稻')]=1;if(s.name==='__HYC__')g.award('host');g.beginMonth();g.check();return g;
 }
 chooseInitialSeed(name){const s=this.s;if(s.initializationDone||s.guideAsked)return false;s.seeds={[cleanSeed(name)]:1};s.initialSeedChosen=true;this.check();return true;}
 next(){let x=(BigInt(this.s.rng)+0x9e3779b97f4a7c15n)&MASK;this.s.rng=String(x);x=((x^(x>>30n))*0xbf58476d1ce4e5b9n)&MASK;x=((x^(x>>27n))*0x94d049bb133111ebn)&MASK;return x^(x>>31n);}
 rand(l,r){const range=BigInt(r-l+1),threshold=(1n<<64n)%range;let x;do{x=this.next();}while(x<threshold);return l+Number(x%range);}
 lucky(l,r){let x=this.rand(l,r);if(this.rand(1,100)<=Math.abs(this.s.rp-50)){const y=this.rand(l,r);x=this.s.rp>=50?Math.max(x,y):Math.min(x,y);}return x;}
 award(id){if(!this.s.achievements.includes(id)){this.s.achievements.push(id);this.notices.push(ACHIEVEMENTS.find(a=>a.id===id)?.name||id);}}
 check(){const s=this.s;s.rp=Math.max(0,Math.min(100,s.rp));s.body=Math.min(15,s.body);s.farm=Math.min(15,s.farm);s.growth=Math.max(0,Math.min(100,s.growth));
  if(s.quality===5)this.award('soil');if(s.body>=15)this.award('body');if(s.farm>=15)this.award('farm');
  [500,2000,10000,100000].forEach((v,i)=>{if(s.money>=v)this.award('cash'+(i+1));});
  if(s.dead)return;if(s.money<0)this.die('poor','你破产了。','兜比脸还干净，这回真没法过了。');
  else if(s.ill&&s.hunger>0)this.die('ill','你病倒了。','生病又挨饿，身体先撑不住了。');
  else if(s.illMonths>=3)this.die('ill','你病倒了。','药没吃上，身体先撑不住了。');
  else if(s.hunger>=2)this.die('hungry','你饿死了。','连续两个月没吃饭，身体撑不住了。');
 }
 die(id,title,text){this.s.dead={id,title,text};this.s.phase='dead';this.s.event=null;this.s.guess=null;this.award(id);}
 beginMonth(){const s=this.s;if(s.dead)return;s.dayActions=0;s.eaten=false;s.water=false;s.eff=s.month===1||s.month===7?100:s.eff;
  const roll=this.rand(1,100);s.baseWeather=roll<=50?'sunny':roll<=80?'cloudy':'rainy';s.weather=s.baseWeather;s.water=s.weather==='rainy';
  s.ap=Math.max(0,Math.min(10,5+Math.floor(s.body/3))-(s.ill?2:0)-(s.hunger?2:0)-(s.weather==='rainy'?1:0));
  if(s.month===1||s.month===7){s.crop='';s.growth=0;s.waterMisses=0;s.phase='planting';}
  else this.startEvent();
 }
 plant(name){const s=this.s;if(s.phase!=='planting'||s.dead||!Number.isInteger(s.seeds[name])||s.seeds[name]<=0)return false;s.seeds[name]--;s.crop=name;s.growth=0;this.startEvent();return true;}
 startEvent(){const s=this.s;if(s.dead)return;if(this.rand(1,100)>45){s.event=null;s.phase='actions';return;}
  const roll=this.rand(1,100),good=15+Math.floor(s.rp*0.6);const id=roll<=good?this.rand(13,18):roll<=good+10?this.rand(8,12):this.rand(1,7);
  const e={id,amount:0,disaster:null};if(id===2){e.disaster=s.month>=3&&s.month<=5?'frost':s.month>=6&&s.month<=8?'drought':s.month>=9&&s.month<=11?'locust':'snow';s.weather=e.disaster;}
  if(id===4)e.amount=120-this.lucky(40,80);if(id===6)e.amount=80-this.lucky(20,60);s.event=e;s.phase='event';
 }
 resolveEvent(choice='ok'){const s=this.s,e=s.event;if(!e||s.dead)return {ok:false};let text='';const pay=(n)=>{if(s.money<n)return false;s.money-=n;return true;};
  switch(e.id){
   case 1:s.taxSeen++;if(choice==='a'&&pay(100)){s.bribed=true;s.rp-=10;text='你花费100金，暗地里打通了关系，这一周期加征的税款收不到你的头上了。但是你总觉得良心有点过不去';}else{s.eff-=30;if(!s.bribed)this.award('honest');text='税款将在你本周期的收成中结算';}break;
   case 2:if(choice==='a'&&pay(30)){s.eff-=5;text='你的努力减少了灾害影响';}else{s.eff-=20;text='自然灾害严重影响了产量';}break;
   case 3:if(choice==='a'&&pay(30)){text='害虫被消灭了。';}else{s.eff-=15;text='虫害影响了作物成长';}break;
   case 4:s.money-=e.amount;text=`仓库进了贼，你损失了${e.amount}金。`;break;
   case 5:s.eff-=10;text='部分作物被踩坏了';break;
   case 6:s.money-=e.amount;text=`粮食发了霉，损失${e.amount}金。`;break;
   case 7:if(choice==='a'&&pay(100))text='花100金免了劳役。';else{s.ap=Math.max(0,s.ap-2);s.rp+=3;text='你去修了路，消耗2个行动点。';}break;
   case 8:if(choice==='a'&&pay(50)){s.rp+=10;s.kindness+=50;text='你的善举被村民记住了';}else{s.rp-=3;text='邻居觉得你有些冷漠';}break;
   case 9:if(choice==='a'&&pay(50)){s.rp+=10;s.kindness+=50;text='你的善举传遍了村庄z';}else{s.rp-=5;text='逃荒的人离开了。';}break;
   case 10:text='天上掉下个棍母母。无事发生。';break;
   case 11:if(choice==='a'&&this.rand(1,100)<=20+Math.floor(s.rp*0.6)){s.farm++;text='你发现这是一根神奇木棍，农业技能增加1';}else text=choice==='a'?'研究半天，你发现它其实只是滚木。':'你觉得晦气，把它扔掉了';break;
   case 12:if(choice==='a'&&pay(100)){if(this.rand(1,100)<=20+Math.floor(s.rp*0.6)){s.eff+=30;text='没想到肥料真的有效！';}else text='你被骗了，这只是普通泥巴';}else text='你没有买这包肥料。';break;
   case 13:s.seeds['甜菜']=(s.seeds['甜菜']||0)+1;text='天上掉下个shz，他掉落了一包甜菜种子。';break;
   case 14:s.farm+=2;text='你翻修旧仓库时发现一本古老农书，农业技能增加2';break;
   case 15:if(choice==='a'){s.farm+=3;text='你学到了很多东西';}else text='你和老人挥了挥手。';break;
   case 16:s.money+=50;text='你走在乡间的小路上，捡到了50金';break;
   case 17:s.money+=100;text='你随手买的彩票中奖了，获得了100金';break;
   case 18:s.eff+=30;text='天上下金坷垃了，作物产量暴增30%';break;
  }s.event=null;s.phase='actions';s.lastMessage=text;this.check();return {ok:true,text};
 }
 act(type){const s=this.s;if(s.dead||s.phase!=='actions'||s.guess||s.ap<=0)return {ok:false,text:'这会儿先歇歇。'};
  let text='',poem='',actor=type;
  if(type==='water'&&s.water)return {ok:false,text:s.baseWeather==='rainy'?'下着雨，田里已经喝饱水了。':'今天已经打过一次水了哦！'};
  if(type==='eat'&&s.eaten)return {ok:false,text:'今天已经吃过一次饭了哦！'};
  if(type==='eat'&&s.money<10)return {ok:false,text:'哟，穷光蛋^-^'};
  if(type==='body'&&s.body>=15)return {ok:false,text:'已经金刚不坏了，歇歇吧。'};
  if(type==='farm'&&s.farm>=15)return {ok:false,text:'高级抄手已经满级了。'};
  switch(type){
   case 'hoe':{const add=[10,15,20,25,28,30][level(s.farm)];s.growth=Math.min(100,s.growth+add);text=`你辛苦地劳作，作物的成长进度增加${add}点。作物当前的成长进度为${s.growth}点`;poem='锄禾日当午，汗滴禾下土。';break;}
   case 'water':s.water=true;text='你打水浇地，作物喝饱了水。';poem='久旱村园豆麦焦，凿池引水灌田苗。';break;
   case 'eat':s.money-=10;s.eaten=true;s.hunger=0;text='你花费10金饱餐一顿。真好，又活了一天！';poem='妇姑荷箪食，童稚携壶浆。';break;
   case 'body':s.body++;text='你锻炼身体，觉得自己有用不完的力气。';poem='闻道偏为五禽戏，出门鸥鸟更相亲。';break;
   case 'farm':s.farm++;text='你学习农业技能，收获满满';poem='旋买犁锄学种田，一声长啸霅溪边。';break;
   default:return {ok:false,text:'换个活儿吧。'};
  }s.ap--;s.dayActions++;s.lastMessage=text;this.check();return {ok:true,text,poem,actor};
 }
 buy(id,customName=''){const s=this.s;if(s.dead||s.guess)return {ok:false,text:'这会儿买不了。'};let price=0,text='';
  if(id==='land'){price=400;text='又添一亩田。';}
  else if(id==='quality'){if(s.quality>=5)return {ok:false,text:'已经是沃土了。'};price=300;text='土地品质提升了。';}
  else if(id==='energy'){price=100;text='你觉得自己充满了力量，行动点+2';}
  else if(id==='medicine'){if(!s.ill)return {ok:false,text:'你身体好着呢。'};price=50;text='你痊愈了';}
  else if(id==='custom'){if(!String(customName).trim().replace(/种子$/,'').trim())return {ok:false,text:'给种子取个名字吧。'};price=100;text='购买成功！欢迎下次光临';}
  else if(CROPS.some(c=>c.id===id)){price=100;text='购买成功！欢迎下次光临';}
  else return {ok:false,text:'店里没有这个。'};
  if(s.money<price)return {ok:false,text:'哟，钱还不够。'};s.money-=price;
  if(id==='land')s.land++;else if(id==='quality')s.quality++;else if(id==='energy'){if(s.ap===0)s.dayActions=Math.max(4,s.dayActions);s.ap+=2;}else if(id==='medicine'){s.ill=false;s.illMonths=0;}
  else {const name=id==='custom'?cleanSeed(customName):CROPS.find(c=>c.id===id).name;s.seeds[name]=(s.seeds[name]||0)+1;}
  s.lastMessage=text;this.check();return {ok:true,text};
 }
 donate(amount){const s=this.s;amount=Math.floor(Number(amount));if(s.dead||!Number.isSafeInteger(amount)||amount<=0||amount>s.money)return {ok:false,text:'这个数可捐不了。'};s.money-=amount;s.kindness+=amount;s.donatedTotal+=amount;s.rp+=Math.max(1,Math.floor(amount/20));this.award('donate1');for(const threshold of [1000,10000,100000])if(s.donatedTotal>=threshold)this.award('donate'+threshold);this.check();return {ok:true,text:'你的善举被村民记住了'};}
 startGuess(difficulty){const s=this.s;if(s.dead||s.phase!=='actions'||s.guess||s.ap<1||!Number.isInteger(difficulty)||difficulty<0||difficulty>3)return false;s.ap--;s.dayActions++;s.guess={difficulty,code:Array.from({length:4},()=>this.rand(0,9)).join(''),history:[]};return true;}
 guess(value){const s=this.s,g=s.guess;if(!g)return {ok:false};if(!/^\d{4}$/.test(value))return {ok:false,text:'必须输入恰好四个数字，允许前导零，本次不计次数。'};const count=[...value].reduce((n,x,i)=>n+(x===g.code[i]),0);g.history.push({value,count});
  if(count===4){s.money+=GAME_PRIZE[g.difficulty];const result={ok:true,count,win:true,code:g.code,reward:GAME_PRIZE[g.difficulty],used:g.history.length};s.guess=null;this.award('guess'+GAME_LEVEL[g.difficulty]);this.check();return result;}
  if(g.history.length>=GAME_LIMIT[g.difficulty]){const code=g.code;s.guess=null;return {ok:true,count,lose:true,code};}return {ok:true,count};
 }
 advance(){const s=this.s;if(s.dead||s.guess||s.phase!=='actions')return {ok:false};const reports=[];
  if(!s.eaten){s.hunger++;reports.push('这个月没吃上饭。');}if(s.ill)s.illMonths++;
  if(!s.water&&s.crop){s.waterMisses++;reports.push('本月忘记打水，最终收益再减20%。');}
  this.check();if(s.dead)return {ok:true,reports};
  if(!s.ill&&this.rand(1,100)<=Math.max(2,7+3*s.hunger+(s.baseWeather==='rainy'?4:0)-Math.floor(s.rp/20))){s.ill=true;s.illMonths=0;reports.push('你着凉生病了，记得去店里拿药。');this.check();if(s.dead)return {ok:true,reports};}
  let settlement=null;
  if(s.month===6||s.month===12){let revenue=0;if(s.growth>=100&&s.crop){const base=Math.floor(s.land*LAND_EFF[s.quality]*Math.max(10,Math.min(200,s.eff))*(level(s.farm)+1)*10/10000);revenue=Math.floor(base*0.8**s.waterMisses);s.money+=revenue;}settlement={year:s.year,cycle:s.month===6?'春种':'秋种',crop:s.crop,growth:s.growth,waterMisses:s.waterMisses,revenue};s.crop='';s.growth=0;}
  s.month++;s.turn++;if(s.month>12){s.month=1;s.year++;}s.pendingSettlement=settlement;this.check();if(!s.dead)this.beginMonth();s.lastMessage=reports.join(' ');return {ok:true,reports,settlement};
 }
}
export function eventInfo(s){const e=s.event;if(!e)return null;const disasters={frost:'倒春寒',drought:'旱灾',locust:'蝗灾',snow:'雪灾'};const data={
 1:['李荣军','你们村新上任的村长李荣军滥用职权，征收大量税款，你选择：','tax',[['a','对李荣军行贿（金钱大于100）',100],['b','算了，任他收去吧']]],
 2:[disasters[e.disaster]||'自然灾害',`你所在的村子发生了${disasters[e.disaster]}，你可以选择补救：`,e.disaster,[['a','花费30金购买物资',30],['b','放弃补救']]],
 3:['田地里出现了大量害虫','田地里出现了大量害虫','pest',[['a','花费30金购买农药',30],['b','放任不管']]],
 4:['夜晚有人偷偷进入你的仓库',`你损失了${e.amount}金`,'thief',null],
 5:['邻村的牛跑进了你的田地','部分作物被踩坏了','cow',null],
 6:['连续阴雨导致储存的粮食腐烂',`你损失了${e.amount}金`,'rainy',null],
 7:['官府要求村民参与修路','官府要求村民参与修路','hoe',[['a','花100金免除',100],['b','花费2行动点参加']]],
 8:['你的邻居遇到了困难','你的邻居遇到了困难，向你借50金','neighbor',[['a','借给他',50],['b','拒绝']]],
 9:['一群逃荒的人来到你的村庄','一群逃荒的人来到你的村庄，请求帮助','neighbor',[['a','给他们50金',50],['b','拒绝']]],
 10:['天上掉下个棍母母','无事发生','tree',null],
 11:['你发现了一根奇怪的木棍','它散发着神秘力量','sapling',[['a','带回家研究'],['b','丢掉']]],
 12:['一个陌生人向你推销神奇肥料','他说可以让作物产量翻倍，售价100金','fertilizer',[['a','购买',100],['b','拒绝']]],
 13:['天上掉下个shz','他掉落了一包甜菜种子','beet',null],
 14:['你翻修旧仓库时发现一本古老农书','农业技能增加2','study',null],
 15:['你遇到了一位隐居老人','老人愿意传授你种地经验','oldman',[['a','学习'],['b','离开']]],
 16:['你走在乡间的小路上','捡到了50金','coins',null],
 17:['你随手买的彩票中奖了','获得了100金','coins',null],
 18:['天上下金坷垃了','作物产量暴增30%','fertilizer',null]
 };const [title,text,image,choices]=data[e.id];return {title,text,image,choices:choices||[['ok','继续']]};}
function assert(c){if(!c)throw new Error('这串存档码读不出来。');}
export function validateState(s){assert(s&&s.version===2&&typeof s.name==='string'&&s.name.length>0&&s.name.length<=32);const integer=(k,a,b)=>assert(Number.isSafeInteger(s[k])&&s[k]>=a&&s[k]<=b);
 s.avatar??='man';if(s.avatar==='seedling')s.avatar='crest';s.gender??='male';s.initializationDone??=true;s.initialSeedChosen??=true;s.guideAsked??=true;s.guessRulesSeen??=false;s.plantShopTurn??=0;s.waterMisses??=0;s.donatedTotal??=0;s.pendingSettlement??=null;s.dayActions??=Math.max(0,5-s.ap);assert(AVATARS.includes(s.avatar)&&['male','female'].includes(s.gender));for(const k of ['initializationDone','initialSeedChosen','guideAsked','guessRulesSeen'])assert(typeof s[k]==='boolean');integer('dayActions',0,1000000);integer('plantShopTurn',0,12000000);integer('waterMisses',0,12);
 if(s.pendingSettlement){const x=s.pendingSettlement;assert(Number.isInteger(x.year)&&x.year>0&&['春种','秋种'].includes(x.cycle)&&typeof x.crop==='string'&&x.crop.length<=40&&Number.isInteger(x.growth)&&x.growth>=0&&x.growth<=100&&Number.isInteger(x.waterMisses)&&x.waterMisses>=0&&x.waterMisses<=12&&Number.isInteger(x.revenue)&&x.revenue>=0);}
 integer('money',-1000000000,1000000000000);integer('rp',0,100);integer('quality',0,5);integer('land',1,1000000);integer('month',1,12);integer('year',1,1000000);integer('turn',1,12000000);integer('ap',0,1000000);integer('body',0,15);integer('farm',0,15);integer('growth',0,100);integer('hunger',0,100);integer('illMonths',0,100);integer('kindness',0,1000000000000);integer('donatedTotal',0,1000000000000);integer('eff',-1000000,1000000);
 assert(['sunny','cloudy','rainy'].includes(s.baseWeather));assert(['sunny','cloudy','rainy','frost','drought','locust','snow'].includes(s.weather));assert(['actions','planting','event','dead'].includes(s.phase));
 assert(typeof s.crop==='string'&&s.crop.length<=40&&typeof s.rng==='string'&&/^\d{1,20}$/.test(s.rng)&&BigInt(s.rng)<=MASK);assert(typeof s.ill==='boolean'&&typeof s.eaten==='boolean'&&typeof s.water==='boolean'&&typeof s.bribed==='boolean');integer('taxSeen',0,12000000);
 assert(s.seeds&&Object.getPrototypeOf(s.seeds)===Object.prototype&&Object.keys(s.seeds).length<=200);for(const [k,v] of Object.entries(s.seeds))assert(k.length>0&&k.length<=40&&!['__proto__','constructor','prototype'].includes(k)&&Number.isSafeInteger(v)&&v>=0&&v<=1000000000);
 assert(Array.isArray(s.achievements)&&s.achievements.every(id=>ACHIEVEMENTS.some(a=>a.id===id)));assert(s.lastMessage===undefined||typeof s.lastMessage==='string'&&s.lastMessage.length<5000);
 if(s.event){assert(s.phase==='event'&&Number.isInteger(s.event.id)&&s.event.id>=1&&s.event.id<=18);assert(Number.isSafeInteger(s.event.amount)&&s.event.amount>=0&&s.event.amount<=1000);if(s.event.id===2)assert(['frost','drought','locust','snow'].includes(s.event.disaster));}else assert(s.phase!=='event');
 if(s.guess){const g=s.guess;assert(s.phase==='actions'&&Number.isInteger(g.difficulty)&&g.difficulty>=0&&g.difficulty<=3&&/^\d{4}$/.test(g.code)&&Array.isArray(g.history)&&g.history.length<GAME_LIMIT[g.difficulty]);for(const h of g.history){assert(/^\d{4}$/.test(h.value)&&h.value!==g.code);assert(h.count===[...h.value].reduce((n,x,i)=>n+(x===g.code[i]),0));}}
 if(s.dead){assert(s.phase==='dead'&&['poor','ill','hungry','seed'].includes(s.dead.id)&&typeof s.dead.title==='string'&&s.dead.title.length<100&&typeof s.dead.text==='string'&&s.dead.text.length<500);}else assert(s.phase!=='dead');return s;
}
export function legacyState(data){let pos=0;const view=new DataView(data.buffer,data.byteOffset,data.byteLength);const u32=()=>{assert(pos+4<=data.length);const x=view.getUint32(pos,true);pos+=4;return x;};const i32=()=>{assert(pos+4<=data.length);const x=view.getInt32(pos,true);pos+=4;return x;};const u64=()=>BigInt(u32())|(BigInt(u32())<<32n);const str=()=>{const n=u32();assert(n<=8192&&pos+n<=data.length);const x=new TextDecoder('gbk').decode(data.slice(pos,pos+n));pos+=n;return x;};
 assert(u32()===1);const name=str(),money=i32(),n=i32();assert(n>=0&&n<=99);const names=[];for(let i=0;i<n;i++)names.push(str());const count=u32();assert(count<=256);const seeds={};for(let i=0;i<count;i++){const k=cleanSeed(str()),v=i32();assert(!['__proto__','constructor','prototype'].includes(k));seeds[k]=v;}const oldHunger=i32(),rp=i32(),kindness=i32(),illMonths=i32(),land=i32(),quality=i32(),oldStatus=str(),body=i32(),farm=i32(),growth=i32(),rawCrop=str(),crop=rawCrop?cleanSeed(rawCrop):'';const month=i32(),ap=i32(),eff=i32(),water=i32(),eaten=i32(),ready=u32(),rng=String(u64()),active=u32(),difficulty=i32(),code=str(),historyCount=u32();assert(historyCount<=30);const history=[];for(let i=0;i<historyCount;i++){const value=str();history.push({value,count:[...value].reduce((n,x,j)=>n+(x===code[j]),0)});}assert(pos===data.length&&ready===1&&oldHunger>=0);
 const s={version:2,name,money,rp,kindness,land,quality:[0,0,1,2,4,5][quality],body:Math.min(15,body),farm:Math.min(15,farm),month,year:1,turn:month,ap,eff,water:!!water,eaten:!!eaten,hunger:0,ill:oldStatus==='生病',illMonths,crop,growth,seeds,weather:'sunny',baseWeather:'sunny',phase:'actions',event:null,guess:active?{difficulty:difficulty-1,code,history}:null,dead:null,achievements:name==='__HYC__'?['host']:[],bribed:false,taxSeen:0,lastMessage:'',rng};return validateState(s);
}
