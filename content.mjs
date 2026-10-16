export const WORLD_RULES=[
 '这里所有的作物都是一年两熟，即6个月为一个周期。',
 '正常状态下每个月你有5个行动点，但如果生病就不一定了^-^',
 '一般来说每个月你需要花费1个行动点进行打水，否则最终收益减少20%',
 '每个周期作物的初始成长进度为0，你需要在六个月后使成长进度达到100',
 '耕地可以花费一个行动点增加成长进度',
 '同时，你可以在农闲时节强身健体、学习技能',
 '有空的话你也可以去镇上的商店逛一逛，或许会发现一些好东西',
 '对了，每个月都有概率遇到一些特殊事件，敬请期待吧',
 '农闲时可以和电脑玩四位数猜码，每局消耗1个行动点，猜中就能赚钱。',
 '人品越高越容易遇到好事，但好运和坏运都不会完全消失。',
 'Last but not least 人是铁饭是钢，记得每天吃饭呀！'
];
export const GUESS_RULES=[
 '电脑随机生成0000~9999中的一个密码，数字可以重复。',
 '每次只告诉你有几位数字和位置同时正确。',
 '每局消耗1个行动点，猜中获得奖金，失败不扣钱。'
];
export function initializationLines(s){
 const lines=[];
 if(s.name==='__HYC__')lines.push('获得成就：房主有神器','被分配到了 Phi 级土地 —— 沃土','据说这种土地年产量会增加50%哦！');
 else{
  lines.push('正在检测你上辈子的人品');
  if(s.rp>90)lines.push('你上辈子一定拯救了银河系吧！','系统提示：检测到你的人品爆棚，你被分配到了 Phi 级土地 —— 沃土','据说这种土地年产量会增加50%哦！');
  else if(s.rp>=61)lines.push('你上辈子小时候扶老奶奶过马路，长大了扶很多老奶奶过马路，真是个大好人啊！','系统提示：检测到你的人品优异，你被分配到了 V 级土地 —— 冲积平原','据说这种土地年产量会增加20%哦！');
  else if(s.rp>=31)lines.push('你上辈子无功无过，普普通通地度过了一生','系统提示：检测到你的人品平平，你被分配到了 A 级土地 —— 褐土地');
  else if(s.rp>=11)lines.push('你上辈子干过几件坏事，但也不至于十恶不赦','系统提示：检测到你的人品较差，你被分配到了 B 级土地 —— 杂草地','你花费了大半积蓄去开垦了这块荒地，现在你是个只有100金的穷光蛋了 ^-^','由于土地贫瘠，你的土地每年减产20%！');
  else lines.push('你tm上辈子是把自己祖坟刨了吗','系统提示：检测到你的人品爆炸，你被分配到了 C 级土地 —— 盐碱地','你的土地每年减产50%！');
 }
 lines.push('突然，天上掉下一包种子。你定睛一看，这居然是：','正在初始化数据','初始化完成！');
 return lines;
}

export function initializationPages(s){const lines=initializationLines(s),seedStart=lines.findIndex(x=>x.startsWith('突然，天上掉下'));
 const story=lines.slice(0,seedStart),detect=story[0]==='正在检测你上辈子的人品';
 return [{kind:'alive',lines:['你活了']},{kind:'detect',lines:[detect?story.shift():'正在检测你上辈子的人品']},{kind:'story',lines:story},{kind:'seed',lines:[lines[seedStart]]},{kind:'summary',lines:['正在初始化数据','初始化完成！']}];
}
