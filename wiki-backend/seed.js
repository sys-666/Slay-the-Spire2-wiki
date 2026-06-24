require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Post = require('./src/models/Post');

// ============================================================
// 杀戮尖塔2 示例数据
// ============================================================

// --- 角色 (5个) ---
const characters = [
  {
    title: '铁甲战士',
    postType: 'character',
    category: '铁甲战士',
    summary: '前作经典角色回归，以力量叠加、消耗过牌和格挡反击为核心。通过消耗卡牌精简牌库，初始遗物「燃烧之血」每场战斗结束回复 6 HP，容错率极高。',
    content: `<h2>铁甲战士 · The Ironclad</h2>
<p>铁甲战士是《杀戮尖塔》系列最具代表性的角色之一，《杀戮尖塔2》中他带着全新的卡牌池和机制回归。</p>

<h3>基础属性</h3>
<ul><li>初始血量：80</li><li>初始遗物：燃烧之血（每场战斗结束回复 6 HP）</li><li>上手难度：⭐ 低</li></ul>

<h3>核心机制</h3>
<p>铁甲战士围绕四大体系展开：</p>
<ul>
<li><strong>力量爆发</strong>：通过「恶魔形态」「原始力量」等卡牌叠加力量，配合「重击」「无情猛攻」打出高额伤害。</li>
<li><strong>消耗过牌</strong>：「黑暗之拥」+「腐化」+「无惧疼痛」组成经典无限循环，技能牌费用变 0 的同时叠加护甲。</li>
<li><strong>格挡反击</strong>：「挑衅」「绯红披风」提供优质防御，配合「邪眼」等卡牌实现高额格挡。</li>
<li><strong>烧血体系</strong>：「突破」「痛殴」为核心，利用自伤换取高额输出。</li>
</ul>

<h3>关键卡牌评级</h3>
<table>
<tr><th>卡牌</th><th>类型</th><th>评级</th><th>说明</th></tr>
<tr><td>薪火之源</td><td>能力牌</td><td>⭐⭐⭐ S</td><td>敲完等于两个无副作用加费遗物</td></tr>
<tr><td>黑暗之拥</td><td>能力牌</td><td>⭐⭐⭐ S</td><td>消耗流核心引擎</td></tr>
<tr><td>腐化</td><td>能力牌</td><td>⭐⭐⭐ S</td><td>技能牌费用变 0</td></tr>
<tr><td>恶魔形态</td><td>能力牌</td><td>⭐⭐ S</td><td>每回合 +2 力量</td></tr>
<tr><td>突破</td><td>攻击牌</td><td>⭐⭐ S</td><td>烧血 AOE，二代翻身成神</td></tr>
</table>`,
    cover: '',
    tags: ['力量流', '消耗流', '高容错', '新手推荐'],
    hp: 80,
    initialRelic: '燃烧之血',
    coreMechanic: '力量叠加 / 消耗过牌 / 格挡反击',
  },
  {
    title: '静默猎手',
    postType: 'character',
    category: '静默猎手',
    summary: '以中毒、小刀连击和 Sly 弃牌体系为核心的敏捷型角色。初始遗物「蛇之戒」每场战斗多抽 2 张牌，过牌能力极强，当前版本 T0 级别强度。',
    content: `<h2>静默猎手 · The Silent</h2>
<p>静默猎手是游戏中最为灵活的角色之一，《杀戮尖塔2》中新增的 <strong>Sly</strong> 机制让她获得了全新的弃牌协同玩法。</p>

<h3>基础属性</h3>
<ul><li>初始血量：70</li><li>初始遗物：蛇之戒（每场战斗开始多抽 2 张）</li><li>上手难度：⭐⭐ 中</li></ul>

<h3>核心机制</h3>
<ul>
<li><strong>中毒流（Poison）</strong>：「致命毒药」「弹跳药瓶」快速叠毒，「催化剂」翻倍中毒层数，「毒雾」每回合自动叠毒。</li>
<li><strong>小刀流（Shiv）</strong>：「飞刀舞」「无尽刀刃」生成大量 0 费小刀，「精准」翻倍小刀伤害，配合「尸体爆炸」实现群体清场。</li>
<li><strong>Sly 弃牌流</strong>：核心卡「大师计划」让所有技能牌获得 Sly（被弃掉时自动免费打出），配合「战术大师」「反射」形成过牌引擎。</li>
</ul>

<h3>关键卡牌评级</h3>
<table>
<tr><th>卡牌</th><th>类型</th><th>评级</th><th>说明</th></tr>
<tr><td>尸体爆炸</td><td>能力牌</td><td>⭐⭐⭐ S</td><td>群体清场神卡</td></tr>
<tr><td>催化剂</td><td>技能牌</td><td>⭐⭐ S</td><td>毒层翻倍，毒流核心</td></tr>
<tr><td>大师计划</td><td>能力牌</td><td>⭐⭐⭐ S</td><td>Sly 体系核心</td></tr>
<tr><td>飞刀舞</td><td>攻击牌</td><td>⭐⭐ S</td><td>1 费 3 小刀</td></tr>
<tr><td>精准</td><td>能力牌</td><td>⭐⭐ S</td><td>小刀伤害翻倍</td></tr>
</table>`,
    cover: '',
    tags: ['毒流', '小刀流', 'Sly', '版本T0'],
    hp: 70,
    initialRelic: '蛇之戒',
    coreMechanic: '中毒 / 小刀连击 / Sly 弃牌',
  },
  {
    title: '故障机器人',
    postType: 'character',
    category: '故障机器人',
    summary: '通过充能球体系生成格挡、能量和伤害的机制型角色。初始遗物「裂变核心」开局自动充能 1 个闪电球，当前版本更侧重利爪连发流和状态牌协同。',
    content: `<h2>故障机器人 · The Defect</h2>
<p>故障机器人是围绕充能球（Orbs）体系展开的独特角色，在《杀戮尖塔2》中获得了全新的状态牌协同机制。</p>

<h3>基础属性</h3>
<ul><li>初始血量：75</li><li>初始遗物：裂变核心（战斗开始充能 1 个闪电球）</li><li>上手难度：⭐⭐⭐ 中-高</li></ul>

<h3>核心机制</h3>
<ul>
<li><strong>充能球体系</strong>：「认知碎片」快速叠集中值，「循环」每回合触发最右侧球，「电动力」让闪电球变为 AOE。</li>
<li><strong>利爪连发流</strong>：「利爪」0 费，每次使用永久提升伤害，「万物流」回收弃牌堆所有 0 费卡形成无限循环。</li>
<li><strong>状态牌协同</strong>：「压缩」「迭代」消耗状态牌获取收益，「超频」「强撑」将状态牌转化为资源。</li>
</ul>

<h3>关键卡牌评级</h3>
<table>
<tr><th>卡牌</th><th>类型</th><th>评级</th><th>说明</th></tr>
<tr><td>认知碎片</td><td>能力牌</td><td>⭐⭐ S</td><td>集中值快速叠加</td></tr>
<tr><td>利爪</td><td>攻击牌</td><td>⭐⭐ S</td><td>0 费永久成长</td></tr>
<tr><td>万物流</td><td>攻击牌</td><td>⭐⭐ S</td><td>利爪流核心回收</td></tr>
<tr><td>搜寻</td><td>技能牌</td><td>⭐⭐ S</td><td>牌库检索</td></tr>
</table>`,
    cover: '',
    tags: ['充能球', '利爪流', '状态协同', '高上限'],
    hp: 75,
    initialRelic: '裂变核心',
    coreMechanic: '充能球 / 利爪连发 / 状态牌协同',
  },
  {
    title: '储君',
    postType: 'character',
    category: '储君',
    summary: '全新角色，通过「隐秘宝库」积累辉星资源，在关键时刻释放「君王之剑」打出爆发伤害。独特的资源管理型玩法，考验玩家的时机把控能力。',
    content: `<h2>储君 · The Regent</h2>
<p>储君是《杀戮尖塔2》全新加入的可玩角色，她锻造了一把名为「君王之剑」的武器，通过积累<strong>辉星（Stars）</strong>资源来释放强力攻击。</p>

<h3>基础属性</h3>
<ul><li>初始血量：75</li><li>初始遗物：隐秘宝库（每场战斗额外获得辉星）</li><li>上手难度：⭐⭐⭐ 中-高</li></ul>

<h3>核心机制</h3>
<ul>
<li><strong>辉星系统</strong>：辉星是一种独特的资源，通过卡牌和遗物积累，消耗辉星打出「君王之剑」等强力卡牌。</li>
<li><strong>锻造机制</strong>：部分卡牌可以在战斗中临时锻造升级，提供更高的灵活性。</li>
<li><strong>资源管理</strong>：需要在积蓄辉星和释放爆发之间找到平衡，类似一个"储蓄然后爆发"的玩法循环。</li>
</ul>`,
    cover: '',
    tags: ['辉星系统', '资源管理', '爆发', '新角色'],
    hp: 75,
    initialRelic: '隐秘宝库',
    coreMechanic: '辉星积累 / 君王之剑爆发',
  },
  {
    title: '亡灵契约师',
    postType: 'character',
    category: '亡灵契约师',
    summary: '全新角色，一位与巨大骷髅手臂「奥斯提」并肩作战的死灵法师。通过灾厄（Doom）机制和仆从体系，在生死之间游走，兼具高爆发与高风险。',
    content: `<h2>亡灵契约师 · The Necrobinder</h2>
<p>亡灵契约师是一位桀骜不驯的巫妖，她与名为 <strong>奥斯提（Osty）</strong> 的巨大骷髅手臂并肩作战。</p>

<h3>基础属性</h3>
<ul><li>初始血量：70</li><li>初始遗物：奥斯提的契约（战斗开始时召唤奥斯提）</li><li>上手难度：⭐⭐⭐ 高</li></ul>

<h3>核心机制</h3>
<ul>
<li><strong>奥斯提仆从</strong>：奥斯提可独立攻击、帮本体格挡伤害（只要 HP>0），被击杀后可重新召唤。</li>
<li><strong>灾厄（Doom）</strong>：全新 debuff 机制——当灾厄层数 ≥ 当前 HP 时，目标在回合结束时死亡（与中毒不同，灾厄在回合末结算）。</li>
<li><strong>灵魂 / 献祭</strong>：使用「灵魂」资源抽牌，可以通过献祭仆从来换取爆发输出。部分卡牌可以<strong>转化 / 变异</strong>其他卡牌赋予不同关键词。</li>
<li><strong>牺牲与回报</strong>：核心博弈在于平衡生与死——何时让奥斯提承担伤害，何时献祭它换取胜利。</li>
</ul>`,
    cover: '',
    tags: ['仆从', '灾厄', '高风险', '新角色'],
    hp: 70,
    initialRelic: '奥斯提的契约',
    coreMechanic: '奥斯提仆从 / 灾厄机制 / 灵魂献祭',
  },
];

// --- 卡牌 (约24张) ---
const cards = [
  // 铁甲战士 — 攻击牌
  {
    title: '突破',
    postType: 'card', cardSubtype: 'attack', cost: 2, rarity: '稀有',
    category: '铁甲战士',
    summary: '消耗自身一定生命值，对所有敌人造成高额 AOE 伤害。二代中翻身成神，是烧血体系的核心牌。',
    content: '<p>消耗生命值造成范围伤害，烧血体系的核心输出卡。</p>',
    coreMechanic: '烧血 AOE / 消耗',
    tags: ['铁甲战士', '攻击牌', 'AOE', 'S级'],
  },
  {
    title: '重击',
    postType: 'card', cardSubtype: 'attack', cost: 2, rarity: '罕见',
    category: '铁甲战士',
    summary: '对单体敌人造成 13 点伤害，同时施加 1 层虚弱和 1 层易伤。最干净的节奏卡之一。',
    content: '<p>高伤害单体攻击，附带虚弱+易伤双重 debuff。</p>',
    coreMechanic: '打 13 + 1 虚弱 + 1 易伤',
    tags: ['铁甲战士', '攻击牌', 'A级'],
  },
  {
    title: '痛殴',
    postType: 'card', cardSubtype: 'attack', cost: 1, rarity: '普通',
    category: '铁甲战士',
    summary: '消耗流/烧血流的核心启动牌，消耗牌库中的一张牌并造成伤害。',
    content: '<p>消耗手牌或牌库中的卡牌，配合「黑暗之拥」等能力牌实现高效运转。</p>',
    coreMechanic: '消耗 + 伤害 / 启动牌',
    tags: ['铁甲战士', '攻击牌', '消耗流', 'S级'],
  },
  // 铁甲战士 — 技能牌
  {
    title: '挑衅',
    postType: 'card', cardSubtype: 'skill', cost: 1, rarity: '普通',
    category: '铁甲战士',
    summary: '获得高额格挡值，联机模式下极其强大，单人模式也是优质防御卡。',
    content: '<p>提供大量格挡，是战士防御体系的核心技能牌。</p>',
    coreMechanic: '高额格挡 / 联机 S 级',
    tags: ['铁甲战士', '技能牌', '防御', 'S级'],
  },
  {
    title: '绯红披风',
    postType: 'card', cardSubtype: 'skill', cost: 1, rarity: '罕见',
    category: '铁甲战士',
    summary: '获得不掉落的镀层护甲，大幅提升防御稳定性。防御暴跌版本的救急神器。',
    content: '<p>提供不会随回合衰减的镀层护甲，可持续叠加，是长期战的防御核心。</p>',
    coreMechanic: '不掉落镀层 / 必抓',
    tags: ['铁甲战士', '技能牌', '防御', 'S级'],
  },
  // 铁甲战士 — 能力牌
  {
    title: '薪火之源',
    postType: 'card', cardSubtype: 'power', cost: 3, rarity: '金卡',
    category: '铁甲战士',
    summary: '敲完后等于获得两个无副作用的加费遗物，是解决 3 费卡手问题的终极方案。无脑拿无脑敲。',
    content: '<p>每回合额外获得能量，是战士全流派通用的顶级能力牌。</p>',
    coreMechanic: '额外能量 / 无脑 S 级',
    tags: ['铁甲战士', '能力牌', '加费', 'SSS级'],
  },
  {
    title: '黑暗之拥',
    postType: 'card', cardSubtype: 'power', cost: 2, rarity: '罕见',
    category: '铁甲战士',
    summary: '每次打出消耗类卡牌时抽一张牌，是消耗流的核心引擎。改版后使用率战士第一。',
    content: '<p>消耗流核心——每当一张牌被消耗，抽一张牌。与「腐化」「无惧疼痛」组成无限循环。「腐化」让技能费用变 0，「黑拥」提供过牌，「无惧」叠加护甲。</p>',
    coreMechanic: '消耗抽牌 / SSS 级',
    tags: ['铁甲战士', '能力牌', '过牌', 'SSS级'],
  },
  {
    title: '恶魔形态',
    postType: 'card', cardSubtype: 'power', cost: 3, rarity: '稀有',
    category: '铁甲战士',
    summary: '力量流永远的神——每回合结束时获得 2 点力量。只要活过启动期，伤害会爆炸增长。',
    content: '<p>力量流派的核心能力，每回合永久叠加力量，适合长期战和 Boss 战。</p>',
    coreMechanic: '每回合 +2 力量',
    tags: ['铁甲战士', '能力牌', '力量流', 'S级'],
  },
  // 静默猎手 — 攻击牌
  {
    title: '飞刀舞',
    postType: 'card', cardSubtype: 'attack', cost: 1, rarity: '稀有',
    category: '静默猎手',
    summary: '消耗，1 费生成 3 张小刀。小刀流的核心输出卡，配合「精准」伤害翻倍。',
    content: '<p>1 费生成 3 张 0 费小刀，小刀流核心启爆卡。</p>',
    coreMechanic: '1 费 3 小刀 / 消耗',
    tags: ['静默猎手', '攻击牌', '小刀流', 'S级'],
  },
  {
    title: '毒刺',
    postType: 'card', cardSubtype: 'attack', cost: 1, rarity: '普通',
    category: '静默猎手',
    summary: '造成伤害的同时叠加中毒层数，毒流基础起手卡。',
    content: '<p>伤害 + 叠毒，毒流的前期核心过渡卡。</p>',
    coreMechanic: '伤害 + 叠毒',
    tags: ['静默猎手', '攻击牌', '毒流'],
  },
  // 静默猎手 — 技能牌
  {
    title: '催化剂',
    postType: 'card', cardSubtype: 'skill', cost: 1, rarity: '稀有',
    category: '静默猎手',
    summary: '将敌人身上的中毒层数翻倍。毒流核心爆发技——毒层从 10 变 20，从 50 变 100。',
    content: '<p>翻倍中毒层数，毒流爆发的关键技能。配合「毒雾」和「致命毒药」可快速叠上致命毒层。</p>',
    coreMechanic: '毒层翻倍 / 毒流核心',
    tags: ['静默猎手', '技能牌', '毒流', 'S级'],
  },
  {
    title: '战术大师',
    postType: 'card', cardSubtype: 'skill', cost: 0, rarity: '罕见',
    category: '静默猎手',
    summary: 'Sly：当此牌被弃掉时，获得 1 点能量。弃牌流能量引擎。',
    content: '<p>弃牌流的关键能量来源，配合「大师计划」和其他 Sly 卡牌形成无限能量循环。</p>',
    coreMechanic: 'Sly / 弃牌回能 / 引擎',
    tags: ['静默猎手', '技能牌', '弃牌流', 'S级'],
  },
  // 静默猎手 — 能力牌
  {
    title: '尸体爆炸',
    postType: 'card', cardSubtype: 'power', cost: 2, rarity: '稀有',
    category: '静默猎手',
    summary: '当敌人死亡时，对其所有同伴造成其最大生命值等额的伤害。群体清场神卡，面对多敌人的绝对王牌。',
    content: '<p>敌人死亡时对其余敌人造成连锁伤害。面对多敌人战斗时的 SS 级能力。</p>',
    coreMechanic: '连锁爆炸 / 群清 SSS 级',
    tags: ['静默猎手', '能力牌', 'AOE', 'SSS级'],
  },
  {
    title: '大师计划',
    postType: 'card', cardSubtype: 'power', cost: 2, rarity: '金卡',
    category: '静默猎手',
    summary: '所有技能牌获得 Sly——被弃掉时自动免费打出。Sly 弃牌流的绝对核心。',
    content: '<p>让所有技能牌获得 Sly 属性，被丢弃时自动免费打出，配合「战术大师」和「反射」可形成无限过牌循环。</p>',
    coreMechanic: '全体 Sly / SSS 级核心',
    tags: ['静默猎手', '能力牌', 'Sly', 'SSS级'],
  },
  {
    title: '精准',
    postType: 'card', cardSubtype: 'power', cost: 1, rarity: '罕见',
    category: '静默猎手',
    summary: '小刀伤害翻倍（4→8），两张叠满后小刀伤可达 12。小刀流必备卡。',
    content: '<p>提升所有小刀的伤害，小刀流从刮痧变收割的关键能力牌。</p>',
    coreMechanic: '小刀伤害翻倍',
    tags: ['静默猎手', '能力牌', '小刀流', 'S级'],
  },
  // 故障机器人 — 攻击牌
  {
    title: '利爪',
    postType: 'card', cardSubtype: 'attack', cost: 0, rarity: '普通',
    category: '故障机器人',
    summary: '0 费，每次使用永久提升自身和所有利爪的伤害。利爪连发流的核心，无限成长。',
    content: '<p>每次打出利爪，所有利爪的伤害永久 +2。配合「万物流」可从弃牌堆回收所有 0 费牌实现无限连打。</p>',
    coreMechanic: '0 费 / 永久成长 / S级',
    tags: ['故障机器人', '攻击牌', '利爪流', 'S级'],
  },
  {
    title: '玻璃球',
    postType: 'card', cardSubtype: 'attack', cost: 1, rarity: '罕见',
    category: '故障机器人',
    summary: '新版 AOE 攻击牌，对所有敌人造成伤害。弥补了机器人 AOE 不足的短板。',
    content: '<p>范围伤害攻击，是故障机器人应对多敌人场景的优质选择。</p>',
    coreMechanic: 'AOE 伤害',
    tags: ['故障机器人', '攻击牌', 'AOE'],
  },
  // 故障机器人 — 技能牌
  {
    title: '热修复',
    postType: 'card', cardSubtype: 'skill', cost: 0, rarity: '罕见',
    category: '故障机器人',
    summary: '0 费，当回合获得集中值。新增的爆发核心技能，大幅提升充能球的当回合输出。',
    content: '<p>零费获得当回合集中值，是爆发回合的关键技能牌。</p>',
    coreMechanic: '0 费临时集中 / 爆发核心',
    tags: ['故障机器人', '技能牌', '集中', 'S级'],
  },
  {
    title: '搜寻',
    postType: 'card', cardSubtype: 'skill', cost: 0, rarity: '稀有',
    category: '故障机器人',
    summary: '从牌库中检索任意一张卡牌。万能调度神卡，任何卡组都能用。',
    content: '<p>从牌库中选择任意一张牌加入手牌。相当于一次精确调度，适用于所有流派。</p>',
    coreMechanic: '牌库检索 / 万能',
    tags: ['故障机器人', '技能牌', '检索', 'S级'],
  },
  // 故障机器人 — 能力牌
  {
    title: '认知碎片',
    postType: 'card', cardSubtype: 'power', cost: 2, rarity: '金卡',
    category: '故障机器人',
    summary: '集中值快速叠加，稀有金卡。攻防一体——同时提升闪电球伤害和冰球格挡值。',
    content: '<p>每回合结束时获得集中值，是充能球体系的 S 级核心能力。</p>',
    coreMechanic: '集中值快速叠加 / SS 级',
    tags: ['故障机器人', '能力牌', '集中流', 'SS级'],
  },
  {
    title: '万物流',
    postType: 'card', cardSubtype: 'attack', cost: 2, rarity: '稀有',
    category: '故障机器人',
    summary: '从弃牌堆回收所有 0 费卡牌。利爪流的核心回收技——将所有利爪一次性回收并连打。',
    content: '<p>将弃牌堆中所有 0 费卡牌加入手牌。与利爪组合可形成无限循环。</p>',
    coreMechanic: '回收 0 费牌 / 利爪流核心',
    tags: ['故障机器人', '攻击牌', '利爪流', 'S级'],
  },
  // 储君
  {
    title: '君王之剑',
    postType: 'card', cardSubtype: 'attack', cost: 3, rarity: '金卡',
    category: '储君',
    summary: '消耗所有辉星，每点辉星造成大量伤害。储君的终极爆发技能。',
    content: '<p>储君的核心输出技能，消耗积累的辉星资源打出致命一击。</p>',
    coreMechanic: '消耗辉星 / 爆发',
    tags: ['储君', '攻击牌', '辉星', '金卡'],
  },
  // 亡灵契约师
  {
    title: '亡灵献祭',
    postType: 'card', cardSubtype: 'skill', cost: 1, rarity: '稀有',
    category: '亡灵契约师',
    summary: '献祭奥斯提，造成其剩余生命值等额的伤害并施加灾厄层数。高风险高回报。',
    content: '<p>牺牲仆从换取高额输出。奥斯提剩余 HP 越高，伤害越大。</p>',
    coreMechanic: '献祭 / 灾厄 / 爆发',
    tags: ['亡灵契约师', '技能牌', '献祭', 'S级'],
  },
  {
    title: '灾厄降临',
    postType: 'card', cardSubtype: 'power', cost: 2, rarity: '稀有',
    category: '亡灵契约师',
    summary: '每当回合结束时，对所有敌人施加灾厄层数。灾厄体系的引擎卡。',
    content: '<p>每回合自动给所有敌人叠灾厄。一旦灾厄层数超过敌人当前 HP，敌人将在回合结束时死亡。</p>',
    coreMechanic: '每回合叠灾厄 / 引擎',
    tags: ['亡灵契约师', '能力牌', '灾厄', 'S级'],
  },
];

// --- Boss (约13个) ---
const bosses = [
  // 第一层·密林 (Overgrowth)
  {
    title: '墨影幻灵',
    postType: 'boss', bossFloor: 1,
    category: '第一层·密林',
    summary: '开局自带 9 层「滑溜」——前 9 次受击只掉 1 血。重击 + 塞伤口 + 持续叠力量，考验前期卡组的输出密度。',
    content: `<h2>墨影幻灵 · Vantom</h2>
<h3>基本属性</h3>
<ul><li>生命值：173</li><li>所属层数：第一层·密林</li></ul>
<h3>核心机制</h3>
<ul>
<li><strong>滑溜（Slippery）×9</strong>：开局自带 9 层，每次受击只掉 1 血，消耗 1 层。相当于前 9 次攻击无效。</li>
<li><strong>重击</strong>：高伤害单体攻击，附带塞入伤口状态牌。</li>
<li><strong>持续叠力量</strong>：随着战斗进行不断提升力量值，拖得越久越危险。</li>
</ul>
<h3>应对策略</h3>
<ul><li>用多段攻击（如小刀流、利爪连打）快速消耗滑溜层数。</li><li>优先处理被塞入的伤口状态牌，避免牌库污染。</li><li>不可拖回合——力量成长会逐渐压倒一切防御。</li></ul>`,
    tags: ['第一层', '密林', '滑溜', '叠力量'],
    hp: 173,
    coreMechanic: '滑溜 ×9 / 重击 + 塞伤口 / 持续叠力量',
  },
  {
    title: '仪式兽',
    postType: 'boss', bossFloor: 1,
    category: '第一层·密林',
    summary: '一阶段叠力量攻击；血量低于 150（共 252 HP）进入二阶段，施加「鸣响」限制每回合只能出 1 张牌。',
    content: `<h2>仪式兽 · Ritual Beast</h2>
<h3>基本属性</h3>
<ul><li>生命值：252</li><li>所属层数：第一层·密林</li></ul>
<h3>核心机制</h3>
<ul><li><strong>一阶段（HP ≥ 150）</strong>：持续叠力量并攻击。</li><li><strong>二阶段（HP < 150）</strong>：施加「鸣响」（Chime）debuff——每回合只能打出 1 张牌。</li></ul>
<h3>应对策略</h3>
<ul><li>一阶段尽量快速压低血量到二阶段门槛。</li><li>二阶段需要高费高价值卡牌（单卡爆发），而非多卡连打。</li><li>能力牌和遗物效果不受鸣响限制，可提前部署。</li></ul>`,
    tags: ['第一层', '密林', '双阶段', '鸣响'],
    hp: 252,
    coreMechanic: '双阶段 / 鸣响（限出 1 张牌）',
  },
  {
    title: '同族祭司',
    postType: 'boss', bossFloor: 1,
    category: '第一层·密林',
    summary: '祭司（HP 190）+ 2 个信徒（HP 58×2）。信徒叠力攻击，祭司施加虚弱 / 脆弱。击杀祭司后信徒逃跑。',
    content: `<h2>同族祭司 · Kin Priest</h2>
<h3>基本属性</h3>
<ul><li>祭司 HP：190 | 信徒 HP：58 × 2</li><li>所属层数：第一层·密林</li></ul>
<h3>核心机制</h3>
<ul><li>信徒每回合叠力量并攻击。</li><li>祭司施加虚弱（减攻击）和脆弱（增伤）。</li><li>击杀祭司后，剩余信徒会逃跑，直接获胜。</li></ul>
<h3>应对策略</h3>
<ul><li>优先集火祭司——击杀即可结束战斗。</li><li>AOE 卡牌可以同时消耗信徒血量。</li><li>及时清理虚弱 debuff 以维持输出。</li></ul>`,
    tags: ['第一层', '密林', '多目标', '优先击杀'],
    hp: 190,
    coreMechanic: '多目标（祭司 + 2 信徒）/ 集火祭司获胜',
  },
  // 第一层·暗港 (Underdock)
  {
    title: '乐嘉维林女族长',
    postType: 'boss', bossFloor: 1,
    category: '第一层·暗港',
    summary: '开局沉睡带 12 镀层；醒来后循环攻击 + 汲取（减玩家力敏，加自己力量）。快速破镀层是胜利关键。',
    content: `<h2>乐嘉维林女族长 · Lagavulin Matriarch</h2>
<h3>基本属性</h3>
<ul><li>生命值：222</li><li>所属层数：第一层·暗港</li></ul>
<h3>核心机制</h3>
<ul><li>开局沉睡，带 12 层镀层护甲。</li><li>醒来后交替攻击和汲取——每次汲取减少玩家 1 力量 + 1 敏捷，同时提升自身力量。</li></ul>
<h3>应对策略</h3>
<ul><li>开局利用沉睡期快速布置能力牌和叠 buff。</li><li>用多段攻击快速消耗镀层。</li><li>毒流 / 灾厄流不依赖力量敏捷，是克制此 Boss 的最佳选择。</li></ul>`,
    tags: ['第一层', '暗港', '镀层', '汲取'],
    hp: 222,
    coreMechanic: '沉眠 +12 镀层 / 汲取减力敏',
  },
  {
    title: '灵魂飞鱼',
    postType: 'boss', bossFloor: 1,
    category: '第一层·暗港',
    summary: '塞入「呼唤」状态牌（回合末在手扣 6 HP），获得无实体，施加易伤。考验手牌管理能力。',
    content: `<h2>灵魂飞鱼 · Spirit Manta</h2>
<h3>基本属性</h3>
<ul><li>生命值：211</li><li>所属层数：第一层·暗港</li></ul>
<h3>核心机制</h3>
<ul><li>向玩家牌库塞入「呼唤」状态牌——回合结束时若仍在手牌中则扣 6 HP。</li><li>周期性获得无实体（Intangible），减伤至 1。</li><li>施加易伤 debuff，增加玩家受到的伤害。</li></ul>
<h3>应对策略</h3>
<ul><li>多段攻击克制无实体。</li><li>优先打出「呼唤」状态牌（需要消耗能量）或使用消耗手段移除。</li><li>需要一定的过牌能力以处理手牌中的状态污染。</li></ul>`,
    tags: ['第一层', '暗港', '状态牌', '无实体'],
    hp: 211,
    coreMechanic: '塞呼唤状态牌 / 无实体 / 易伤',
  },
  // 第二层·巢穴 (Hive)
  {
    title: '无厌沙虫',
    postType: 'boss', bossFloor: 2,
    category: '第二层·巢穴',
    summary: '4 回合「沙坑」倒计时（归零即死）；打出「狂乱逃离」可延长 1 回合但费用 +1。极限压榨输出！',
    content: `<h2>无厌沙虫 · Insatiable Sandworm</h2>
<h3>基本属性</h3>
<ul><li>生命值：321</li><li>所属层数：第二层·巢穴</li></ul>
<h3>核心机制</h3>
<ul><li>开局 4 回合沙坑倒计时——倒计时归零玩家直接死亡。</li><li>可以打出特殊卡牌「狂乱逃离」延长 1 回合，但每次使用费用 +1。</li><li>需要在极其有限的时间内打出足够输出。</li></ul>
<h3>应对策略</h3>
<ul><li>全力输出，最小化防御投入。</li><li>合理规划「狂乱逃离」的使用时机——不要过早用掉。</li><li>高爆发卡组（力量流、辉星爆发）在此战有优势。</li></ul>`,
    tags: ['第二层', '巢穴', '倒计时', '爆发检验'],
    hp: 321,
    coreMechanic: '4 回合死亡倒计时 / 狂乱逃离延命',
  },
  {
    title: '知识恶魔',
    postType: 'boss', bossFloor: 2,
    category: '第二层·巢穴',
    summary: '每回合让玩家从两种负面效果中二选一（限出牌/扣血/少抽牌/少资源），极大考验卡组适应性。',
    content: `<h2>知识恶魔 · Knowledge Demon</h2>
<h3>基本属性</h3>
<ul><li>生命值：379</li><li>所属层数：第二层·巢穴</li></ul>
<h3>核心机制</h3>
<ul><li>每回合给玩家两难选择：限制出牌数 / 扣除 HP / 减少抽牌 / 减少资源等。</li><li>玩家必须在两个负面效果中选择一个接受。</li></ul>
<h3>应对策略</h3>
<ul><li>灵活性强的卡组更占优势——不要过度依赖单一战术。</li><li>一般优先选择限制出牌（如果卡组中有高费卡）或扣血（如果有回复能力）。</li><li>提前铺好能力牌可以减轻负面效果的影响。</li></ul>`,
    tags: ['第二层', '巢穴', '两难选择', '考验适应性'],
    hp: 379,
    coreMechanic: '每回合二选一负面效果',
  },
  {
    title: '帝王蟹',
    postType: 'boss', bossFloor: 2,
    category: '第二层·巢穴',
    summary: '双钳战斗（HP 199/189）——左钳碾碎 + 右钳火箭。击杀一只后另一只获得 5 力量和 99 格挡（仅 1 回合）。',
    content: `<h2>帝王蟹 · Emperor Crab</h2>
<h3>基本属性</h3>
<ul><li>左钳 HP：199 | 右钳 HP：189</li><li>所属层数：第二层·巢穴</li></ul>
<h3>核心机制</h3>
<ul><li>双钳独立行动：左钳使用碾碎爪（高伤害），右钳使用火箭（多段攻击）。</li><li>击杀任一只：另一只获得 5 力量和 99 格挡（仅持续 1 回合）。</li></ul>
<h3>应对策略</h3>
<ul><li>平衡削减两只钳的血量，尽量在同一回合内斩杀两只。</li><li>如果无法同时击杀，预留高格挡手段应对另一只的爆发回合。</li><li>AOE 卡牌在本场战斗中非常高效。</li></ul>`,
    tags: ['第二层', '巢穴', '双目标', '同时击杀'],
    hp: 199,
    coreMechanic: '双钳独立行动 / 击杀一只另一只狂暴',
  },
  // 第三层·荣耀 (Glory)
  {
    title: '女王与火炬头聚合体',
    postType: 'boss', bossFloor: 3,
    category: '第三层·荣耀',
    summary: '女王 HP 400 + 火炬头 HP 199。每回合抽牌堆顶 3 张只能选 1 张打出（侵蚀锁牌）。优先击杀火炬头！',
    content: `<h2>女王 · The Queen & 火炬头聚合体</h2>
<h3>基本属性</h3>
<ul><li>女王 HP：400 | 火炬头聚合体 HP：199</li><li>所属层数：第三层·荣耀</li></ul>
<h3>核心机制</h3>
<ul><li><strong>侵蚀锁牌</strong>：每回合从抽牌堆顶翻 3 张，只能选择其中 1 张打出，其余回牌库底。</li><li>火炬头聚合体会持续造成伤害和施加 debuff。</li></ul>
<h3>应对策略</h3>
<ul><li>优先击杀火炬头聚合体，解除双线作战压力。</li><li>精简卡组——卡牌质量 > 数量，减少被锁牌机制限制的概率。</li><li>能力牌不受锁牌影响，提前部署能力是本场核心战术。</li></ul>`,
    tags: ['第三层', '荣耀', '侵蚀锁牌', '双目标'],
    hp: 400,
    coreMechanic: '侵蚀锁牌（3 选 1）/ 优先击杀火炬头',
  },
  {
    title: '实验体 #C10',
    postType: 'boss', bossFloor: 3,
    category: '第三层·荣耀',
    summary: '三阶段变身 Boss：HP 100→200→300，每杀一次变强。三阶段每 2 回合获得无实体 + 高攻，极度考验续航。',
    content: `<h2>实验体 #C10 · Subject #C10</h2>
<h3>基本属性</h3>
<ul><li>一阶段 HP：100 | 二阶段 HP：200 | 三阶段 HP：300</li><li>所属层数：第三层·荣耀</li></ul>
<h3>核心机制</h3>
<ul><li><strong>三阶段变身</strong>：每次击杀后以更强形态复活。</li><li>三阶段每 2 回合获得无实体（减伤至 1）+ 高攻击力。</li></ul>
<h3>应对策略</h3>
<ul><li>需要极强的续航能力——回复和持久防御是必需品。</li><li>三阶段的多段攻击可以消耗无实体层数。</li><li>毒流和灾厄流无视无实体减伤，在此战有极大优势。</li></ul>`,
    tags: ['第三层', '荣耀', '三阶段', '复活'],
    hp: 100,
    coreMechanic: '三阶段变身复活 / 三阶段无实体 + 高攻',
  },
  {
    title: '门扉缔造者',
    postType: 'boss', bossFloor: 3,
    category: '第三层·荣耀',
    summary: '缔造者本尊 HP 512 + 门 HP 155+。双形态循环——门高攻低血，缔造者血极厚攻低。数回合后逃跑重新召门。',
    content: `<h2>门扉缔造者 · Gateforger</h2>
<h3>基本属性</h3>
<ul><li>缔造者本尊 HP：512 | 门 HP：155+</li><li>所属层数：第三层·荣耀</li></ul>
<h3>核心机制</h3>
<ul><li><strong>双形态循环</strong>：门形态高攻击低血量；缔造者本尊血极厚但攻击力低。</li><li>缔造者数回合后逃跑并重新召唤门，如此循环。</li></ul>
<h3>应对策略</h3>
<ul><li>在门形态时爆发输出速杀门，在缔造者形态时补充状态 / 回复。</li><li>需要同时具备爆发和续航能力的均衡卡组。</li><li>壁垒 + 巩固的护甲流在此战中可以将护甲叠到极高应对门的高攻。</li></ul>`,
    tags: ['第三层', '荣耀', '双形态', '循环'],
    hp: 512,
    coreMechanic: '门与缔造者循环 / 门高攻缔造者血厚',
  },
  {
    title: '永世沙漏',
    postType: 'boss', bossFloor: 3,
    category: '第三层·荣耀',
    summary: 'v0.105 测试服新 Boss，替代门扉缔造者。三阶段循环——重击+弱化 → 连击爆发 → 格挡+强化。每打 4 张非状态牌塞入 1 张凋萎。',
    content: `<h2>永世沙漏 · Eternal Hourglass</h2>
<h3>基本属性</h3>
<ul><li>所属层数：第三层·荣耀（测试服 v0.105 新增）</li></ul>
<h3>核心机制</h3>
<ul><li><strong>三阶段循环</strong>：①重击 + 弱化 → ②连击爆发 → ③格挡 + 强化，然后循环。</li><li>每打出 4 张非状态牌，向牌库塞入 1 张「凋萎」状态牌。</li></ul>
<h3>应对策略</h3>
<ul><li>在 Boss 格挡阶段集中输出，在其爆发阶段全力防御。</li><li>控制出牌节奏——过多出牌会加速状态牌污染。</li><li>消耗 / 烧牌体系可以高效处理凋萎状态牌。</li></ul>`,
    tags: ['第三层', '荣耀', '新Boss', '三阶段循环'],
    hp: 450,
    coreMechanic: '三阶段循环 / 塞凋萎状态牌',
  },
];

// ============================================================
// Seed execution
// ============================================================
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // 1. Create admin user if not exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists, skipping...');
    } else {
      await User.create({
        username: 'admin',
        password: 'admin123',
        role: 'admin',
      });
      console.log('Admin user created: admin / admin123');
    }

    // 2. Remove old seeded data (posts with postType set)
    const deleteResult = await Post.deleteMany({ postType: { $ne: null } });
    console.log(`Cleared ${deleteResult.deletedCount} old seeded posts`);

    // 3. Insert all seed data
    const allData = [...characters, ...cards, ...bosses];
    const created = await Post.insertMany(allData);
    console.log(`Inserted ${created.length} posts:`);
    console.log(`  - Characters: ${characters.length}`);
    console.log(`  - Cards: ${cards.length}`);
    console.log(`  - Bosses: ${bosses.length}`);

    await mongoose.disconnect();
    console.log('\nSeed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
