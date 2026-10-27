# -*- coding: utf-8 -*-
"""
Script to update the camera controls encyclopedia section in camera-controls.astro
with all 40 full cinematographic movement analyses.
"""

encyclopedia_data = [
    {
        "category_title": "一、基礎三軸物理位移運鏡（完整 12 款）",
        "category_desc": "以攝影機自身的物理坐標（三腳架、滑軌、雲台）為參考基準，不涉及鏡頭焦距改變的真實物理空間運動。",
        "badge": "Physical 3-Axis",
        "items": [
            {
                "num": 1,
                "name": "Pan Left（左水平搖鏡）",
                "icon": "⟵",
                "physics": "攝影機固定於原地不動，鏡頭光軸繞垂直軸（Yaw 軸偏航）由右向左平滑旋轉。",
                "drama": "宏大世界觀環境鋪展、跟隨左向移動人物，或在雙人交鋒對話中平滑過渡至另一位演員。",
                "prompt": "pan left, smooth panning shot across the neon street, cinematic lighting"
            },
            {
                "num": 2,
                "name": "Pan Right（右水平搖鏡）",
                "icon": "⟶",
                "physics": "攝影機機身底座固定，鏡頭光軸繞 Yaw 軸向右旋轉，視野向右側未知區域連續延展。",
                "drama": "順應觀眾閱讀慣性揭示新角色登場、帶出突發危險事件，或引領主角逃亡路線方向。",
                "prompt": "pan right, camera panning right revealing luxurious banquet, 35mm lens"
            },
            {
                "num": 3,
                "name": "Tilt Up（垂直仰拍）",
                "icon": "↑",
                "physics": "攝影機機身高度不變，鏡頭向上昂起（Pitch 軸俯仰抬高），由低處掃向高處。",
                "drama": "短劇「戰神歸來/霸道總裁亮相」必備，自名牌皮鞋一路向上掃描至威嚴冷酷面容，極度放大權力與壓迫感。",
                "prompt": "tilt up from luxury dress shoes to charismatic face, dramatic volumetric lighting"
            },
            {
                "num": 4,
                "name": "Tilt Down（垂直俯拍）",
                "icon": "↓",
                "physics": "攝影機機身位置固定，鏡頭向下低垂（Pitch 軸下俯），視野從上方沉降至地面。",
                "drama": "從角色絕望哭泣面孔下搖至地上散落的親子鑑定報告或沾血信物，引導觀眾目光鎖定核心關鍵道具。",
                "prompt": "tilt down from crying expression to broken contract on marble floor, moody light"
            },
            {
                "num": 5,
                "name": "Roll CW（順時針滾轉）",
                "icon": "↻",
                "physics": "攝影機繞鏡頭光軸（Roll 軸）順時針物理旋轉 15° 至 90°，導致地平線劇烈傾斜。",
                "drama": "主角中毒、遭人暗算後的意識模糊、宿醉眩暈、或超自然異空間倒錯感。",
                "prompt": "roll clockwise along lens axis, dizzy disorientation effect, neon city lights"
            },
            {
                "num": 6,
                "name": "Roll CCW（逆時針滾轉）",
                "icon": "↺",
                "physics": "攝影機繞鏡頭光軸逆時針方向偏轉旋轉，破壞傳統畫面的水平重力對稱平衡。",
                "drama": "世界秩序崩塌顛倒、角色遭遇至親背叛時內心天翻地覆的心理恐慌震撼。",
                "prompt": "roll counter-clockwise, Dutch roll rotation, intense thriller atmosphere"
            },
            {
                "num": 7,
                "name": "Dolly In（前後推軌-靠近）",
                "icon": "⤓",
                "physics": "攝影機架設於物理滑軌上沿光軸向主體直線逼近，前景與後景產生光學透視縮放。",
                "drama": "角色突然意識到驚天真相（「原來你才是幕後黑手！」）、內心恐慌急速凝聚或準備發動反擊的焦點時刻。",
                "prompt": "dolly in towards face, 35mm lens, smooth track push forward, intense gaze"
            },
            {
                "num": 8,
                "name": "Dolly Out（前後推軌-遠離）",
                "icon": "⤒",
                "physics": "滑軌推車沿光軸向後平滑後撤，遠離拍攝主體，周遭冷酷環境隨之漸次敞開。",
                "drama": "表現主角被孤立遺棄於空曠豪宅大廳、戰場廝殺後的孤寂心境與難以對抗的命運無奈感。",
                "prompt": "dolly out, camera pulling backward smoothly, lonely protagonist in massive hall"
            },
            {
                "num": 9,
                "name": "Truck Left（左側橫移推軌）",
                "icon": "⇦",
                "physics": "攝影機沿與光軸垂直的橫向水平軌道向左平移，前景物體與後景產生顯著立體視差（Parallax）。",
                "drama": "伴隨角色在公司走廊、宮廷長廊疾步密談穿梭，呈現緊湊明快的劇情推進節奏與深度層次。",
                "prompt": "truck left, lateral moving shot, parallax foreground pillars, walking shot"
            },
            {
                "num": 10,
                "name": "Truck Right（右側橫移推軌）",
                "icon": "⇨",
                "physics": "攝影機沿右向水平滑軌位移，保持與主體間距恆定，背景在畫面中橫向飛掠。",
                "drama": "橫向掃描拍賣會場或宴會廳中各懷鬼胎的反派賓客，層層鋪陳即將引爆的打臉衝突前奏。",
                "prompt": "truck right, lateral dolly tracking shot, cinematic luxury ballroom background"
            },
            {
                "num": 11,
                "name": "Pedestal Up（垂直升降-升）",
                "icon": "⇪",
                "physics": "保持鏡頭光軸水平角度不變，透過油壓升降中柱或垂直滑軌整機垂直升高高度（Z 軸抬升）。",
                "drama": "從主角微小視角筆直升起，豁然揭示城牆外千軍萬馬或窗外繁華商業帝國全景，格調瞬間拔高。",
                "prompt": "pedestal up, camera elevates vertically straight up revealing horizon, epic scale"
            },
            {
                "num": 12,
                "name": "Pedestal Down（垂直升降-降）",
                "icon": "⇩",
                "physics": "攝影機保持水平角度整機垂直下沉，從宏觀天花板高度降至與角色雙眼平視甚至胸口視角。",
                "drama": "自宏觀神級視角拉回至凡人微觀情感，將衝突由群體氛圍壓縮至雙人殊死對決的凝視瞬間。",
                "prompt": "pedestal down, smooth vertical drop from high ceiling to intense eye level"
            }
        ]
    },
    {
        "category_title": "二、鏡頭光學焦段與景深變化（完整 6 款）",
        "category_desc": "攝影機機位維持物理靜止，純粹透過調節光學鏡片焦距（Focal Length）或光圈（Aperture）實現視角與情緒導引。",
        "badge": "Optical & Focus",
        "items": [
            {
                "num": 13,
                "name": "Zoom In（光學拉近變焦）",
                "icon": "🔍+",
                "physics": "機身位置固定，旋轉變焦環增大焦距（如 24mm 漸變至 105mm），視角收窄並壓縮景深與透視。",
                "drama": "不干擾角色的第三者客觀窺探感，在對話進行中突然鎖定桌角暗藏的密錄筆或暗號手勢。",
                "prompt": "optical zoom in, lens zooming tightly into hidden evidence on desk, sharp focus"
            },
            {
                "num": 14,
                "name": "Zoom Out（光學推遠變焦）",
                "icon": "🔍-",
                "physics": "機身固定，鏡頭焦距由望遠端平滑切換回廣角端，畫面容納範圍迅速擴大。",
                "drama": "由極度緊繃的人物微表情特寫拉遠，驚覺主角身陷重重包圍或被狙擊紅點鎖定，製造反轉絕境。",
                "prompt": "optical zoom out, lens zooming backwards revealing wide trap ambush scene"
            },
            {
                "num": 15,
                "name": "Crash Zoom（極速衝擊變焦）",
                "icon": "⚡",
                "physics": "攝影師在幾毫秒內手動暴力猛推變焦環，伴隨劇烈光學拉扯畸變，具有昆汀經典 B 級片風格。",
                "drama": "短劇抓眼球神技！驚人身分被公之於眾、被扇耳光前夕或驚覺親生骨肉時的強烈視覺重擊。",
                "prompt": "crash zoom, fast dynamic snap zoom on eyes, cinematic sudden revelation"
            },
            {
                "num": 16,
                "name": "Rack Focus（前後景焦點切換）",
                "icon": "🎯",
                "physics": "機位與焦距固定，跟焦員平滑旋轉跟焦輪，使合焦平面在前景與後景之間平滑過渡轉移。",
                "drama": "前景手中的假合約逐漸模糊，後景陰險冷笑的管家面孔逐漸清晰，無言傳遞因果與諷刺反差。",
                "prompt": "rack focus from foreground document to background smiling character, shallow dof"
            },
            {
                "num": 17,
                "name": "Deep Focus（極致全景深）",
                "icon": "⬛",
                "physics": "採用小光圈（F/8 至 F/16）搭配廣角電影鏡頭，使得從近處半米至無限遠背景全員皆清晰銳利。",
                "drama": "承襲奧森威爾斯《大國民》美學，同框內前、中、後景多人各自心懷鬼胎各施手段，戲劇資訊量拉滿。",
                "prompt": "deep focus cinematography, sharp detail throughout foreground and background, F11"
            },
            {
                "num": 18,
                "name": "Shallow Depth of Field（淺景深唯美散景）",
                "icon": "✨",
                "physics": "使用大光圈（F/1.2 至 F/1.8）與長焦人像鏡頭（85mm+），焦外背景徹底融化為圓形散景光斑（Bokeh）。",
                "drama": "戀愛甜寵短劇對視告白、主角彌留之際，消除所有世俗喧囂雜物，全世界只剩下眼前摯愛一人。",
                "prompt": "ultra shallow depth of field, creamy circular bokeh, 85mm f1.4 portrait lighting"
            }
        ]
    },
    {
        "category_title": "三、複合軌道與動態載具運鏡（完整 14 款）",
        "category_desc": "結合多軸旋轉、三維弧形軌道與特殊動態載具（吊臂、穿越機、斯坦尼康），營造高動態視聽衝擊。",
        "badge": "Compound Dynamics",
        "items": [
            {
                "num": 19,
                "name": "Orbit 360（360° 全景環繞）",
                "icon": "🔄",
                "physics": "攝影機架設於環形推軌或電控雲台，以主角為圓心保持固定半徑進行 360° 空間全景公轉環繞。",
                "drama": "短劇王炸時刻！戰神金身顯露、真假少爺當場揭穿、逆天修為突破時的絕對主角光環定格震撼。",
                "prompt": "orbit 360 around character, continuous circular tracking shot, cinematic heroic aura"
            },
            {
                "num": 20,
                "name": "Arc Left（左側 90° 弧形軌道）",
                "icon": "↩",
                "physics": "相機沿 1/4 圓弧軌道向左滑行推進，旋轉中心鎖定主體，動態改變背景光源方向與陰影交界。",
                "drama": "主角下定決心轉身黑化、從光明走入陰險算計的性格關鍵轉折點。",
                "prompt": "arc left around character, 90 degree curved track movement, dramatic lighting shift"
            },
            {
                "num": 21,
                "name": "Arc Right（右側 90° 弧形軌道）",
                "icon": "↪",
                "physics": "相機沿右側 90° 弧線滑軌推進，逐步越過前景障礙物露出主角身側站立的關鍵人物。",
                "drama": "雙雄對峙談判時打破僵局，以弧形軌跡揭露隱藏在幕後操控大局的真正大佬。",
                "prompt": "arc right around subject, smooth curved orbital camera move, high tension"
            },
            {
                "num": 22,
                "name": "Lead Tracking（前方領路後退跟拍）",
                "icon": "⏮",
                "physics": "攝影車或斯坦尼康員在主角正前方等速後退滑行，鏡頭正面鎖定主角昂首挺胸向前的身姿。",
                "drama": "主角步入豪門盛宴、法庭或比武擂台，觀眾化為前導視角，營造勢不可擋的王者歸來氣場。",
                "prompt": "lead tracking shot, camera moving backward facing the walking protagonist, dynamic pace"
            },
            {
                "num": 23,
                "name": "Trail Tracking（後方追逐跟拍）",
                "icon": "⏭",
                "physics": "攝影機緊隨主角身後等速追逐，視角牢牢固定在其背影與前方奔逃方向。",
                "drama": "暗夜小巷逃亡、深入廢棄凶宅時的沉浸式追擊感，讓觀眾緊繃體驗隨時會被後方黑手突襲的恐懼。",
                "prompt": "trail tracking shot following directly behind character walking into darkness, thriller vibe"
            },
            {
                "num": 24,
                "name": "Side Tracking（側面同速平移跟拍）",
                "icon": "⇄",
                "physics": "跟拍載具與高速奔跑或駕車馳騁的主角保持同速平行前進，鏡頭平視側面面孔輪廓。",
                "drama": "短劇爭分奪秒救人、奔向機場挽回愛人的高燃競速時刻，側面飛掠的動態模糊強烈傳遞急迫感。",
                "prompt": "side tracking profile shot matching sprinting speed, dynamic lateral motion blur"
            },
            {
                "num": 25,
                "name": "Dolly Zoom / Vertigo（希區柯克眩暈推拉）",
                "icon": "🌀",
                "physics": "物理推軌向前的同時光學鏡頭以相同比率廣角化拉遠，主體畫面大小鎖定恆定，背景透視劇烈崩解拉長。",
                "drama": "驚覺自己深愛數年的人竟是殺父仇人、世界觀徹底崩毀時電影級的心理眩暈重創感。",
                "prompt": "vertigo effect, dolly zoom, background warping while subject size remains constant, shock"
            },
            {
                "num": 26,
                "name": "Whip Pan（極速甩鏡轉場）",
                "icon": "💨",
                "physics": "攝影師以極高角速度迅速橫向甩動機身，在毫秒級時間內形成強烈橫向流光動態模糊。",
                "drama": "快節奏短影音無縫轉場神器！在兩次眨眼間連接不同時空、跨城對峙或雙方暗中謀劃的場景。",
                "prompt": "whip pan transition with heavy motion blur, swish pan connecting two intense scenes"
            },
            {
                "num": 27,
                "name": "Handheld Shaky（手持真實微晃）",
                "icon": "📳",
                "physics": "攝影師手持肩扛拍攝，忠實記錄人體自然呼吸起伏、奔跑腳步震顫與微小肌肉微動。",
                "drama": "偽紀錄片真實質感、綁架囚禁現場、地震廢墟求生與激烈搏鬥打鬥的第一人稱臨場窒息感。",
                "prompt": "handheld camera, subtle natural shake, raw documentary realism, chaotic battlefield"
            },
            {
                "num": 28,
                "name": "Steadicam（斯坦尼康平穩穿梭）",
                "icon": "🌊",
                "physics": "機械配重雙彈簧臂吸收走動跳躍的垂直高頻顛簸，宛如懸浮於半空中行雲流水滑行。",
                "drama": "頂級短劇炫技必備！一鏡到底（One-Take）流暢穿過豪宅前庭、客廳至內室私人談判現場。",
                "prompt": "ultra smooth Steadicam shot weaving through the complex hallway, continuous take"
            },
            {
                "num": 29,
                "name": "Crane / Jib Shot（大型搖臂俯衝橫掃）",
                "icon": "🏗️",
                "physics": "十數公尺長電子吊臂自主空大俯視姿態高速俯衝劃過弧線，精準降至主角面部大特寫。",
                "drama": "古裝巨製短劇大結局、江山易主、大軍凱旋時由宏大歷史宿命切換至英雄個人悲喜瞬間。",
                "prompt": "grand crane shot sweeping down from high altitude to character close-up, epic drama"
            },
            {
                "num": 30,
                "name": "Spiral Corkscrew（螺旋旋轉升降）",
                "icon": "🌪️",
                "physics": "機械臂環繞主體旋轉的同時，垂直昇降立柱以等比角速度向上拔升，軌跡呈現三維螺旋線。",
                "drama": "修真玄幻短劇飛升渡劫、靈魂出竅昇華、命運輪迴超自然體驗的視覺奇觀標配。",
                "prompt": "corkscrew spiral ascending shot, camera rotating around character while rising vertically"
            },
            {
                "num": 31,
                "name": "FPV Drone Dive（第一人稱穿越機俯衝）",
                "icon": "🚀",
                "physics": "競速穿越機以超百公里時速自百米高空摩天大樓外牆 90° 垂直極速俯衝，貼地前最後一刻改平拉起。",
                "drama": "短影音搶奪流量核心！前 3 秒極限腎上腺素爆發，牢牢鎖住手指阻止用戶滑走。",
                "prompt": "FPV drone dive shot plunging down building facade at high speed, extreme motion blur"
            },
            {
                "num": 32,
                "name": "Fly-Through（穿梭貫穿鏡頭）",
                "icon": "🕳️",
                "physics": "相機沿計算機精算路徑穿過極度狹窄的門縫、鑰匙孔、碎裂擋風玻璃或戒指微孔直逼主角。",
                "drama": "超現實奇幻窺探感、子彈穿越槍膛命中目標的超能打擊爽快感。",
                "prompt": "camera fly-through entering through shattered glass window into dramatic room interior"
            }
        ]
    },
    {
        "category_title": "四、特殊機位視角與戲劇構圖（完整 8 款）",
        "category_desc": "突破常規人眼水平視角，透過極限高度、傾斜幾何與光學分光透鏡打破心理防線。",
        "badge": "Special & Angles",
        "items": [
            {
                "num": 33,
                "name": "Birds-Eye / Top-Down（上帝 90° 垂直俯瞰視角）",
                "icon": "🦅",
                "physics": "攝影機固定於天花板天軌或垂直向下旋翼，光軸與地面呈絕對 90° 垂直（Pitch -90°）。",
                "drama": "命運棋盤視角、命案現場線索幾何陳列，揭示主角深陷命運羅網無處遁逃的渺小無助。",
                "prompt": "straight down 90-degree birds-eye view, symmetrical composition, aerial top-down"
            },
            {
                "num": 34,
                "name": "Worm-Eye View（蟲眼極低貼地仰拍）",
                "icon": "🐛",
                "physics": "攝影機機身直接貼緊泥濘地面或大理石地表，鏡頭以 60° 以上大仰角向上極端凝望。",
                "drama": "反派皮鞋無情踐踏、主角受辱匍匐時由下仰望的極限壓迫感，蓄積即將爆發的復仇怒火。",
                "prompt": "extreme low-angle worm-eye view from wet ground looking up, menacing giant stature"
            },
            {
                "num": 35,
                "name": "Dutch / Canted Angle（荷蘭傾斜角）",
                "icon": "📐",
                "physics": "故意使相機光軸滾轉偏斜 20° 至 30°，破壞水平與垂直線的重力幾何秩序。",
                "drama": "希區柯克式心理懸疑，表現角色精神分裂、瀕臨崩潰、邪惡陰謀正在暗中運轉的極端不安。",
                "prompt": "Dutch canted angle with a 25-degree tilted horizon, psychological tension, neo-noir"
            },
            {
                "num": 36,
                "name": "POV / Point of View（第一人稱主觀視角）",
                "icon": "👁️",
                "physics": "相機裝載於演員眼部頭戴裝置，視角完全同步眼部凝視，前景自然入鏡主角雙手互動動作。",
                "drama": "短劇第一人稱極限沉浸代入，觀眾直接化身主角拆開背叛信件、揮拳反擊或深情擁抱摯愛。",
                "prompt": "first-person POV perspective, hands visible reaching forward, immersive interactive feel"
            },
            {
                "num": 37,
                "name": "Over-the-Shoulder / OTS（經典過肩對話鏡頭）",
                "icon": "👥",
                "physics": "鏡頭越過前景角色的肩膀與頸部輪廓，焦點清晰鎖定對面演員面部，前景虛化充當戲劇畫框。",
                "drama": "商務博弈、契約簽署、夫妻反目的標誌性對話景別，精確傳遞對峙雙方的心理距離與權力平衡。",
                "prompt": "over-the-shoulder conversation shot, foreground shoulder in soft blur, intense dialogue"
            },
            {
                "num": 38,
                "name": "Low-Angle Hero Shot（低角度英雄霸氣鏡頭）",
                "icon": "👑",
                "physics": "相機置於腰部以下低機位向上仰拍，主體胸膛挺拔仰首，背景襯托蒼穹或高樓天際線。",
                "drama": "爽文短劇「三年之期已到」歸來打臉全場的標誌性鏡頭，展現主角唯我獨尊的無上威嚴。",
                "prompt": "low-angle hero shot, majestic confident posture, dramatic rim lighting, powerful authority"
            },
            {
                "num": 39,
                "name": "Bullet Time（子彈時間時空凝結）",
                "icon": "⏳",
                "physics": "環形相機陣列微秒級同步觸發或高幀率神經渲染，世界時間幾乎凝固，相機視角高速繞行穿梭。",
                "drama": "暗器破空、紅酒杯墜地碎裂瞬間，將千鈞一髮的生死危機拆解為毫米級震撼的超現實視覺奇觀。",
                "prompt": "bullet time effect, frozen time with camera orbiting around suspended mid-air action"
            },
            {
                "num": 40,
                "name": "Split Diopter（雙焦透鏡分屏前後雙清晰）",
                "icon": "🌗",
                "physics": "在鏡頭前裝配半切近攝鏡片（Split Diopter），使畫面近端半邊與遠端半邊同時處於刀鋒般清晰焦點。",
                "drama": "德帕瑪經典懸疑美學，同一畫幅中同時展現前景主角微表情與後景不知情受害者的關鍵動作，張力爆棚。",
                "prompt": "split diopter cinematography, extreme foreground face and deep background door both razor sharp"
            }
        ]
    }
]

def render_html():
    out = []
    for cat in encyclopedia_data:
        out.append(f'      <!-- {cat["category_title"]} -->')
        out.append('      <div class="space-y-6 pt-8 border-t border-slate-200">')
        out.append('        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">')
        out.append(f'          <h3 class="text-2xl font-bold text-[#155EEF] flex items-center gap-2">')
        out.append(f'            <span>{cat["category_title"]}</span>')
        out.append(f'          </h3>')
        out.append(f'          <span class="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-blue-100 text-[#155EEF] self-start sm:self-auto">{cat["badge"]}</span>')
        out.append('        </div>')
        out.append(f'        <p class="text-sm text-slate-600 leading-relaxed max-w-3xl">')
        out.append(f'          {cat["category_desc"]}')
        out.append('        </p>')
        out.append('        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 not-prose">')
        
        for item in cat["items"]:
            out.append('          <div class="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all flex flex-col justify-between">')
            out.append('            <div>')
            out.append('              <div class="flex items-center justify-between gap-2 mb-2">')
            out.append(f'                <h4 class="font-bold text-base text-[#07172D] flex items-center gap-1.5">')
            out.append(f'                  <span class="text-blue-600 font-mono text-sm">{item["num"]}.</span>')
            out.append(f'                  <span>{item["name"]}</span>')
            out.append(f'                </h4>')
            out.append(f'                <span class="text-base text-slate-500 font-mono select-none">{item["icon"]}</span>')
            out.append('              </div>')
            out.append('              <div class="text-xs text-slate-600 space-y-1.5 leading-relaxed">')
            out.append(f'                <p><strong>物理機制：</strong> {item["physics"]}</p>')
            out.append(f'                <p><strong>短劇心理：</strong> {item["drama"]}</p>')
            out.append('              </div>')
            out.append('            </div>')
            out.append('            <div class="mt-3 pt-3 border-t border-slate-200/60">')
            out.append(f'              <div class="text-[11px] font-mono text-slate-500 mb-1">提示詞寫法：</div>')
            out.append(f'              <code class="block text-[11px] font-mono text-blue-700 bg-blue-50/70 p-2 rounded border border-blue-200/50 break-words select-all">{item["prompt"]}</code>')
            out.append('            </div>')
            out.append('          </div>')
            
        out.append('        </div>')
        out.append('      </div>\n')
        
    return '\n'.join(out)

if __name__ == '__main__':
    html_content = render_html()
    with open('camera_encyclopedia_block.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    print(f"Generated {len(html_content)} bytes of HTML content.")
