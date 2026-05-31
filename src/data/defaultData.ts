import { Trip, QuickTip, Message } from '../types';

export const EX_WAVE_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuCQs7t16uWzkBYewBtx678HSMz2Dr5HnegDZ5y4OUbUyTHNE3u9YzN6tGzHLw23byjO_9Bzf2sU5vPuPRuci9jWhVCxnpaTDgDKHtJRr85TUfvyhKxyZ4SlMfIn3a7FKxsXRwHkVc5LZ47rt4UY4_qAPKKWfIqdWZU2tQcguQHMw2WlL357LpUnAxrMtSqZqht06E860Ww3XZMsrTYrtHDPJJcuqEuzPb1lN_WqA1lBMuwLdo95AKklZgjPbFrKqSa_gCaLrn12X6I";
export const EX_POSITANO_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuCG9F7dTV9tyGNjLUQWAUwfWPdJ2llLGI1CZE3d6Sro6vDUznFSvyoe1GvbRXvMw7q9lu9n4CErOLgBweX_oGKT-NVPVHcDQn2KJJ0Vh-SwBmibf00530aM-LPxwa87oy5yQ8NPJ5JHy5zIwEOJc4JOFiLQy7cVSvZsAZM99FvBXD4m8sHy2F6UN0PGwxfT_eruwmh1gUaO2K1r1Yt9JR7ZxfcUitEsAz2PdbE2d6izt1X_iBcLFINlOoBB1_UVl-bVJu-CWyHSCrk";
export const EX_MAP_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuC1dOBMWDxHr2bik_ZwVf6U7laJXaagSv4kfwrNTz8XBiVx93psuk-E5bzgcgbxkVeXjkb8o7CIDceNMTJw4BEfKdTMfxzbn3WOehrHHm2PkcaWqYQDLI2ZvIjQrYmFOYKzzf7B0_B_dyZtJYzMYN1Yf8QNG4tRiVuUxKPtQd-cmgpy69xaGA2jQPtaX3mBSI1FPuZWFlGjqbvDsntP1uSjFEmsktqFb8AbVl0rllHeWUj3tmlP1_bGAtRZpG2FPnzDdl3x9gDyb9M";

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'amalfi-5day',
    name: "大理双廊惬意 5 日慢漫游",
    dateRange: "10月12日 - 10月16日",
    destination: "云南大理与丽江",
    description: "慢节奏游历苍山洱海与沙溪古镇，在静谧海景、双廊泛舟与午后留白中，找回内心最纯粹的松弛姿态。",
    daysCount: 5,
    imageUrl: EX_WAVE_IMAGE,
    activities: [
      // Day 1
      {
        id: 'a1-1',
        dayId: 1,
        time: "10:00 AM",
        title: "抵达丽江三义机场",
        description: "已为您安排私人专车接机。沿途可以一边啜饮香甜的古树红茶，一边欣赏远山云雾缭绕、壮丽温柔的丽江坝子风光。",
        type: 'transit',
        tags: ['专车接机', '沿途风景'],
        locationName: "丽江三义国际机场",
        coordinates: { x: 34, y: 18 }
      },
      {
        id: 'a1-2',
        dayId: 1,
        time: "01:30 PM",
        title: "洱海畔海景客栈慢咖啡",
        description: "入住双廊临海的设计感民宿并寄存行李后，漫步前往露台，品尝一杯云南本地水洗玫瑰咖啡，配上温热香酥的烤鲜花饼。",
        type: 'food',
        tags: ['本地甄选', '休整时光'],
        locationName: "双廊古镇海景大露台",
        coordinates: { x: 58, y: 44 }
      },
      {
        id: 'a1-3',
        dayId: 1,
        time: "05:30 PM",
        title: "双廊古镇黄金时刻湖畔漫步",
        description: "在波光粼粼的落日余晖中缓步徐行，看远处的苍山群峰在晚霞中化为墨色。微风拂面极度舒适，最适合坐在岸边随心拍照。",
        type: 'leisure',
        tags: ['落日余晖', '湖畔散步'],
        locationName: "双廊古镇洱海亲水台",
        coordinates: { x: 59, y: 46 }
      },
      // Day 2
      {
        id: 'a2-1',
        dayId: 2,
        time: "09:00 AM",
        title: "洱海私人木船汎舟小憩",
        description: "漫步登上一艘古雅的白族摇橹木船。从慢节奏的湖面视角观赏苍山叠翠，波光潋滟中看飞鸟拂过，宁静悠然。",
        type: 'activity',
        tags: ['摇橹泛舟', '放慢节奏'],
        locationName: "双廊生态廊道湖面",
        imageUrl: EX_POSITANO_IMAGE,
        coordinates: { x: 38, y: 48 }
      },
      {
        id: 'a2-2',
        dayId: 2,
        time: "07:30 PM",
        title: "临海岩石落日私房晚宴",
        description: "在避开主街喧嚣的僻静听涛阁畔享用晚宴。尝一尝当地当天古法泡制的野生洱海酸木瓜鱼以及清炒鲜鸡枞，口感极其鲜美。",
        type: 'food',
        tags: ['风味晚餐', '苍山伴日'],
        locationName: "双廊海之角静谧包厢",
        coordinates: { x: 48, y: 52 }
      },
      // Day 3
      {
        id: 'a3-1',
        dayId: 3,
        time: "08:30 AM",
        title: "“喜洲古镇”绿麦田与马车漫游",
        description: "穿行于喜洲古老白族建筑的砖瓦之间。坐拥大片碧绿翻滚的田野，坐着古朴马车慢悠悠徜徉于田埂，闻着草木泥土的芬芳。",
        type: 'activity',
        tags: ['田园绿意', '人文探索'],
        locationName: "喜洲古城生态麦田里",
        coordinates: { x: 44, y: 36 }
      },
      {
        id: 'a3-2',
        dayId: 3,
        time: "01:00 PM",
        title: "蓝花楹染布手工扎染课堂",
        description: "在一片清凉古朴的老宅庭院里，跟随白族扎染老艺人，学习如何用板蓝根等天然植物染料制作专属的手工草木扎染手帕。茶汤无限续杯。",
        type: 'food',
        tags: ['手作扎染', '非遗文化'],
        locationName: "喜洲匠人非遗工坊",
        coordinates: { x: 62, y: 34 }
      },
      {
        id: 'a3-3',
        dayId: 3,
        time: "05:00 PM",
        title: "双廊隐秘客栈露台观海听风",
        description: "在岩壁客栈特意留出的悬空躺椅上小憩。看洱海微风吹起白色纱幔，看湖水泛着珍珠般的光泽，听古镇偶尔传来的风铃。完全放空自我。",
        type: 'leisure',
        tags: ['无所事事', '听风发呆'],
        locationName: "双廊岩壁客栈露台",
        coordinates: { x: 50, y: 46 }
      },
      // Day 4
      {
        id: 'a4-1',
        dayId: 4,
        time: "10:30 AM",
        title: "寂照庵多肉禅意静心之约",
        description: "沿着松针厚铺的山路拾阶而上，步入“中国最美尼姑庵”。这里不烧纸香，唯有满院繁茂、灵动可爱的多肉植物与幽香山茶，洗尽心头烦杂。",
        type: 'activity',
        tags: ['禅意多肉', '静心清肺'],
        locationName: "苍山寂照庵",
        coordinates: { x: 64, y: 38 }
      },
      {
        id: 'a4-2',
        dayId: 4,
        time: "04:00 PM",
        title: "沙溪古镇四方街古树斜阳",
        description: "漫步在千年前的老戏台和百年古槐树下。抚摸古朴粗糙的黄土墙与厚重石板路，在路旁慢品一杯手冲咖啡，淘一淘精细非遗木雕。",
        type: 'leisure',
        tags: ['沙溪时光', '悠闲漫步'],
        locationName: "沙溪古镇四方街",
        coordinates: { x: 63, y: 36 }
      },
      {
        id: 'a4-3',
        dayId: 4,
        time: "08:00 PM",
        title: "民谣火塘手鼓庄园炙肉晚宴",
        description: "伴着客栈里几声悠长、悠闲的吉他弹唱与非洲手鼓。围坐在温暖的火塘边，慢品本土炙烤菌菇和特制大麦酒，听微风捎过的歌声。",
        type: 'food',
        tags: ['火塘晚餐', '民谣相伴'],
        locationName: "沙溪老宅民谣客舍",
        coordinates: { x: 62, y: 37 }
      },
      // Day 5
      {
        id: 'a5-1',
        dayId: 5,
        time: "09:30 AM",
        title: "苍山清晨松林山泉舒缓",
        description: "在酒店被古木掩映的一角享用山泉温热舒阳汤。温热水波浸润身心，洗净过去几天徒步的肌肉疲劳，大口吸收高氧松树清香。",
        type: 'leisure',
        tags: ['森林暖泉', '冥想清心'],
        locationName: "苍山麓伴山泉养疗池",
        coordinates: { x: 57, y: 45 }
      },
      {
        id: 'a5-2',
        dayId: 5,
        time: "01:00 PM",
        title: "大理古城打包回忆与归程",
        description: "带几盒包装精美的鲜花饼、大理雕梅和手工红糖。乘坐舒适轿车平稳前往大理高铁站/机场，为此次惬意的慢生活之旅画上圆满句号。",
        type: 'transit',
        tags: ['归家交接', '收拾行囊'],
        locationName: "大理机场/高铁站",
        coordinates: { x: 56, y: 47 }
      }
    ]
  },
  {
    id: 'capri-weekend',
    name: "亚龙湾太阳湾山海周末逃离",
    dateRange: "11月24日 - 11月26日",
    destination: "海南三亚",
    description: "三天极为慵懒和私密的椰林山海慢度。体验私人木舟出海、无边暖池的长假漫步，以及悠长落日椰椰下午茶。",
    daysCount: 3,
    imageUrl: EX_WAVE_IMAGE,
    activities: [
      {
        id: 'cap-1-1',
        dayId: 1,
        time: "10:30 AM",
        title: "自驾穿越太阳湾山海绝美公路",
        description: "车窗全部摇下，听着轻柔的海浪乐拍，看左侧是翡翠般深邃的大海、右侧是浓绿奇秀的绝壁山崖，缓缓驶入度假湾区。",
        type: 'transit',
        tags: ['最美公路', '极目远眺'],
        locationName: "太阳湾滨海公路",
        coordinates: { x: 18, y: 55 }
      },
      {
        id: 'cap-1-2',
        dayId: 1,
        time: "01:30 PM",
        title: "椰林树荫清补凉午后私享",
        description: "坐在高耸直入云霄的椰子树树阴躺椅下，品尝一碗铺满红豆、芒果与椰奶的冰镇清补凉，感受海滩细沙磨过脚板的微微粗糙感。",
        type: 'food',
        tags: ['热带庭院', '椰林甜品'],
        locationName: "太阳湾沙滩树荫餐座",
        coordinates: { x: 12, y: 68 }
      },
      {
        id: 'cap-2-1',
        dayId: 2,
        time: "09:30 AM",
        title: "蔚蓝海岸游艇与桨板余晖巡礼",
        description: "乘坐一艘精美白色私人游艇悠悠出行，躺在甲板上听海浪轻歌。在风平浪静的避风湾，尝试桨板轻轻滑行，静享宁谧。",
        type: 'activity',
        tags: ['私人游艇', '一见倾心'],
        locationName: "太阳湾私享蔚蓝海域",
        coordinates: { x: 22, y: 78 }
      },
      {
        id: 'cap-3-1',
        dayId: 3,
        time: "12:00 PM",
        title: "临海森林阶梯眺望与鲜打椰汁",
        description: "在依山面海的岩壁木栈道上散步，手里端着一颗刚削好的清甜椰子。静静看海面斑驳渔光，舒展身心并画上句号。",
        type: 'leisure',
        tags: ['山海栈道', '清甜椰汁'],
        locationName: "太阳湾崖顶观海阶梯",
        coordinates: { x: 18, y: 72 }
      }
    ]
  },
  {
    id: 'swiss-alpine',
    name: "川西九寨秘境星空与水疗之旅",
    dateRange: "10月2日 - 10月7日",
    destination: "四川九寨沟",
    description: "高吸氧度的翠绿海子与藏寨慢活解压之旅。体验毫无压力的全景观光列车，抬头就能看到浩瀚星海的露天矿泉疗养池。",
    daysCount: 6,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoHNtyVitavM15l2ChFOmfvqp5gHH1jJNguF6rtRBsOGPTADL-gi624uJSSD1MK94AjNHlgWybC7nxOOqDZQ6sT17qgmYQouQ3vo8NnCa_HNSiHikpDLeTL03FbUGWSSBB5tAxG6_Cfhi7-Mj82rx-adJre81SIxxGlKdnu3JFgeURQ2NnjFcGKtZQxl8jpC8D1lw8j4IWaXHNRmyXIqcTVB4YGY3_3jSAx9dOfShsYycuBuH514AcXs9q8LSGi3vkoagBrFwnKS8",
    activities: [
      {
        id: 'swiss-1-1',
        dayId: 1,
        time: "11:00 AM",
        title: "九黄全景生态铁道行车",
        description: "登上明亮宽敞的景观列车，穿过云遮雾绕、金黄与翠绿交叠的松林。远处静穆、巍峨的雪山轮廓在云层中若隐若现。",
        type: 'transit',
        tags: ['景观铁道', '极目远眺'],
        locationName: "松潘全景铁道沿线",
        coordinates: { x: 25, y: 20 }
      },
      {
        id: 'swiss-1-2',
        dayId: 1,
        time: "02:00 PM",
        title: "藏式原木疗养别苑慢入驻",
        description: "入住全实木香气的原野精舍。换上蓬松干爽、温暖舒适的亚麻家居服，围坐在全景壁炉火塘旁静静读书，听水沸茶香。",
        type: 'hotel',
        tags: ['原木小木屋', '炉火慢茗'],
        locationName: "中查沟藏家奢美别墅",
        coordinates: { x: 45, y: 35 }
      },
      {
        id: 'swiss-2-1',
        dayId: 2,
        time: "10:00 AM",
        title: "五花海原始森林晨雾深呼吸",
        description: "沿着平缓幽绿的林中木栈道漫步。看轻薄的水雾在五彩斑斓、如琉璃般清亮的湖水中悠悠打转，大口吸吮森林的甘冽高氧。",
        type: 'activity',
        tags: ['原始绿野', '彩色海子'],
        locationName: "九寨沟五花海景区",
        coordinates: { x: 50, y: 40 }
      },
      {
        id: 'swiss-2-2',
        dayId: 2,
        time: "03:00 PM",
        title: "雪山露天温热矿物汤池静心",
        description: "身体漂浮在温热舒适的高山弱碱矿泉水里，静静看着远处的皑皑雪山。冷暖交融间，洗掉城市生活的酸痛与浮躁。",
        type: 'leisure',
        tags: ['雪山汤泡', '疗愈舒解'],
        locationName: "悦榕温泉水疗馆",
        coordinates: { x: 52, y: 42 }
      },
      {
        id: 'swiss-3-1',
        dayId: 3,
        time: "11:30 AM",
        title: "藏家大院手工打制酥油茶体验",
        description: "步入百年古藏寨大院，在热心阿妈的示范下亲自动手打一壶香滑解渴的有机酥油茶，佐以金黄酥脆的手烤青稞锅盔。",
        type: 'activity',
        tags: ['民俗手作', '青稞麦香'],
        locationName: "中查沟原生态藏家大院",
        coordinates: { x: 42, y: 32 }
      },
      {
        id: 'swiss-3-2',
        dayId: 3,
        time: "06:30 PM",
        title: "野菌菌菇火塘牦牛暖胃小火锅",
        description: "精选高原鲜美牛肝菌与新鲜牦牛肉。在高水准的木筑餐馆里，佐以微甜的高山青稞酒，伴着炉火翻滚的热气抚平心神。",
        type: 'food',
        tags: ['牦牛火锅', '高山野山菌'],
        locationName: "藏家野味古居餐厅",
        coordinates: { x: 41, y: 30 }
      },
      {
        id: 'swiss-4-1',
        dayId: 4,
        time: "09:00 AM",
        title: "牟尼沟高氧瀑布古林漫步",
        description: "滑过森林雪雾的山间索道，静听远处的瀑布在虚空山谷里轰鸣落入玉石般的石潭。吐故纳新，将思绪融于自然。",
        type: 'transit',
        tags: ['高空索道', '天然洗肺'],
        locationName: "牟尼沟景区石潭",
        coordinates: { x: 60, y: 65 }
      },
      {
        id: 'swiss-4-2',
        dayId: 4,
        time: "04:30 PM",
        title: "山野草甸帐篷落日观星下午茶",
        description: "抵达静谧幽深的藏语牧场。在拉起白色布幔的天幕小草棚下小憩，尝一尝新鲜的青稞酸奶，静待落日红霞染透山尖。",
        type: 'hotel',
        tags: ['山野营落', '惬意慢谈'],
        locationName: "草原静空草垫精致营地",
        coordinates: { x: 75, y: 80 }
      },
      {
        id: 'swiss-5-1',
        dayId: 5,
        time: "10:30 AM",
        title: "神仙池彩林钙华露台全景眺望",
        description: "穿过挂满厚厚翠竹般松落的黄金松林带。沿着古老质朴的廊台，观赏大自然巧夺天工、澄澈如镜的五彩钙华池台，犹如仙境。",
        type: 'activity',
        tags: ['仙凡神境', '彩色钙华'],
        locationName: "神仙池彩台森林区",
        coordinates: { x: 80, y: 85 }
      },
      {
        id: 'swiss-5-2',
        dayId: 5,
        time: "02:00 PM",
        title: "镜海无暇池水：完美的山色倒影",
        description: "静立于九华名海——镜海。在风水平稳、水明镜朗的无风时刻，以快门捕捉水中的蓝天白云，仿佛池底蕴藏着另一个静寂的平行时空。",
        type: 'leisure',
        tags: ['镜湖幽蓝', '倒影流霞'],
        locationName: "九寨沟镜海晨光台",
        coordinates: { x: 78, y: 82 }
      },
      {
        id: 'swiss-6-1',
        dayId: 6,
        time: "10:00 AM",
        title: "火山清溪热石活络舒筋精油SPA",
        description: "启程作别前，用火山冷溪中打磨修圆的黑色天然玄武热石，配合森林冷杉迷迭草本精油，进行舒缓经络温络按摩，为假期温柔收卷。",
        type: 'leisure',
        tags: ['深林芳疗', '身心复原'],
        locationName: "九寨沟山居水疗精油阁",
        coordinates: { x: 74, y: 78 }
      }
    ]
  }
];

export const QUICK_TIPS: QuickTip[] = [
  {
    id: 'tip-1',
    title: "如何避开大理环洱海路的商业喧嚣",
    category: "Transport",
    content: "环洱海廊道在上午 10:00 后常常会吸引一波观光大客流。如果您想享受完全独处的空灵海景，建议选择 8:00 AM 前租一辆安静小巧的共享单车，轻快骑行，或者联系客栈预订清晨的白族摇橹木船，避开人潮，静看水鸟晨舞，悠悠而行。",
    icon: "bus"
  },
  {
    id: 'tip-2',
    title: "沙溪古镇幽深狭巷中的隐世茶社",
    category: "Local secrets",
    content: "别只在吵闹的主戏台空地打转。请往玉津桥反方向、那些爬满土黄色三角梅与青苔的狭窄石板死巷里寻找，您会发现只有两三张返朴木桌的柴烧茶歇和小酒坊。价格便宜，且常能遇上逗猫喝茶的本地木雕匠人闲谈。",
    icon: "anchor"
  },
  {
    id: 'tip-3',
    title: "寻找真正柴火慢烤喜洲粑粑的奥秘",
    category: "Food &",
    content: "真正地道的白族喜洲粑粑，绝非电烤箱里量产出来的。认准白族阿妈守着的陈旧木炭泥炉，粑粑上下两面均被厚重的铁板压住，表面撒着厚厚的手撕红糖或手切肉丁，慢火重压慢烤，直到外皮轻咬一下即发出“咔嚓”脆响而内芯层层香软，方是正宗。",
    icon: "chef-hat"
  },
  {
    id: 'tip-4',
    title: "大理古城窄铺石板路的挑箱帮手",
    category: "Budget",
    content: "双廊和沙溪古镇的部分临海客栈藏于狭长深邃的水泥或碎石老巷中，手拉大号沉重行李箱在凹凸不平的石板街拉行是膝盖与拉杆箱的灾难。进古街前，让前台为您呼叫带有黄色特质推车的手工搬箱帮手，15-20元一件，能免去您抬箱行走的疲惫。",
    icon: "coins"
  },
  {
    id: 'tip-5',
    title: "高原与海滨大温差的打包衣橱穿搭",
    category: "Packing",
    content: "不论是在大理还是川西，高原的日照极其充沛，但下午太阳落山或阴雨天时，气温会陡然下降 10-15 度。强力建议您的拉链衣箱中放入好脱好穿的棉麻遮阳衬衫，搭配一件防风轻便的复古毛呢斗篷或者是舒适软壳外罩，舒适又出片。",
    icon: "shirt"
  }
];

export const INITIAL_CHAT: Message[] = [
  {
    id: 'm1',
    sender: 'assistant',
    text: "Ciao！我是您的慢慢游伙伴——龟小旅 🐢。在这里我们提倡褪去旅途的忙碌与焦虑，只留下大理苍山洱海、非遗手工艺与悠幽漫步的惬意时光。我已为您贴心客制了一条包含充足放空与微醺下午茶的选择路线。有什么我可以协助您的吗？",
    timestamp: "10:30 AM",
    suggestions: ["可以让行程更加松弛！", "推荐不踩坑的本地私房菜", "高原行程应该带些什么？"]
  }
];
