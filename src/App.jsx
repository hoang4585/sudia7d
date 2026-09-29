import { useState, useEffect } from "react";

// Mật khẩu để mở khóa xem lời giải bài nâng cao.
const SOLUTION_PASSWORD = "vuihoc";

// Chuẩn hóa để so sánh: bỏ dấu tiếng Việt, khoảng trắng, đổi , thành .
function norm(s) {
  return (s || "")
    .toString()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/,/g, ".")
    .replace(/\s+/g, "")
    .replace(/\.+$/, "");
}

// answerSpec: các đáp án chấp nhận, ngăn cách bằng "|"
function checkAnswer(given, answerSpec) {
  const g = norm(given);
  if (!g) return null;
  const alts = answerSpec.split("|").map(norm).filter(Boolean);
  for (const a of alts) {
    if (g === a) return true;
    if (/^-?\d+(\.\d+)?%?$/.test(a)) {
      const an = parseFloat(a);
      const m = g.match(/^-?\d+(\.\d+)?/);
      if (m && parseFloat(m[0]) === an) {
        const rest = g.slice(m[0].length);
        if (rest === "" || /^[a-z%\/°][a-z0-9%\/°]*$/.test(rest)) return true;
      }
    } else if (a.length >= 6 && g.includes(a)) {
      return true;
    }
  }
  return false;
}

const inkColor = "#2B2620";
const marginRed = "#B5433D";
const correctGreen = "#4E7A51";

const CATEGORIES = [
  { id: "lich-su", label: "Lịch sử", color: "#9C6B2E", icon: "🏛️" },
  { id: "dia-li", label: "Địa lí", color: "#2A7F7F", icon: "🌍" },
];

const font = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap');
    .lt-serif { font-family: 'Newsreader', Georgia, serif; }
    body, .lt-root { font-family: 'Inter', -apple-system, sans-serif; color: #2B2620; }
    .lt-page { background: #FBF8F2; border: 1px solid #E4DCC8; box-shadow: 0 1px 3px rgba(0,0,0,0.06); position: relative; }
    .lt-margin { position: absolute; left: 32px; top: 0; bottom: 0; width: 1px; background: #E8B4B0; opacity: 0.5; }
    .lt-tab { transition: all 0.15s ease; }
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .gap-3 { gap: 12px; }
    textarea, input { font-family: inherit; }
    .lt-summary { line-height: 1.8; font-size: 15px; }
    .lt-summary h2 { font-family: 'Newsreader', Georgia, serif; font-size: 22px; font-weight: 700; margin: 0 0 16px; color: #2B2620; }
    .lt-summary strong { color: #2B2620; }
    .lt-summary ul { padding-left: 20px; margin: 8px 0 16px; }
    .lt-summary li { margin-bottom: 6px; }
    .lt-summary p { margin: 0 0 12px; }
    .lt-summary table { border-collapse: collapse; width: 100%; margin: 12px 0 18px; font-size: 14px; }
    .lt-summary th, .lt-summary td { border: 1px solid #D9CFC0; padding: 7px 10px; text-align: left; }
    .lt-summary th { background: #F3EEE3; }
  `}</style>
);

const CHUYEN_DE = [
 {
  "id": "ls1-tay-au",
  "category": "lich-su",
  "title": "Tây Âu từ thế kỉ V đến nửa đầu thế kỉ XVI",
  "summary": "## Tây Âu từ thế kỉ V đến nửa đầu thế kỉ XVI\n\n**Sự hình thành xã hội phong kiến:** Năm **476**, đế quốc Tây Rô-ma sụp đổ dưới các cuộc tấn công của người Giéc-man. Trên đất Tây Âu hình thành nhiều vương quốc mới, xã hội phong kiến dần ra đời với hai giai cấp chính: **lãnh chúa** (chủ đất) và **nông nô** (lệ thuộc, canh tác cho lãnh chúa).\n\n**Lãnh địa phong kiến:** là đơn vị kinh tế – chính trị khép kín, **tự cấp tự túc**, do một lãnh chúa cai quản.\n\n**Thành thị trung đại:** từ khoảng **thế kỉ XI**, thủ công nghiệp tách khỏi nông nghiệp, thợ thủ công và thương nhân tập trung ở các nơi thuận lợi buôn bán, hình thành thành thị — thúc đẩy kinh tế hàng hoá phát triển.\n\n**Phong trào văn hoá Phục hưng** (thế kỉ XIV–XVI): khởi nguồn ở **Ý**, đề cao giá trị con người và khoa học, phê phán tư tưởng thần quyền hà khắc của Giáo hội. Tiêu biểu: Lê-ô-na đờ Vanh-xi (bức \"Nàng Mô-na Li-sa\"), Mi-ken-lăng-giơ, Sếch-xpia.\n\n**Phong trào Cải cách tôn giáo:** do **Mác-tin Lu-thơ** khởi xướng ở **Đức** (1517), phản đối Giáo hội Công giáo lạm quyền, bán \"thẻ miễn tội\". Kết quả: đạo **Tin Lành** ra đời, Giáo hội Ki-tô giáo bị phân hoá.\n\n### Bối cảnh & vì sao\n- **Vì sao thành thị ra đời?** Vì kinh tế lãnh địa khép kín không đáp ứng đủ nhu cầu trao đổi khi thủ công nghiệp phát triển tách khỏi nông nghiệp.\n- **Vì sao Phục hưng bùng nổ ở Ý trước tiên?** Vì Ý có nhiều thành thị giàu có (Phlo-ren-xơ, Vơ-ni-dơ), gần các di sản văn hoá La Mã cổ đại, có tầng lớp thương nhân giàu có tài trợ cho nghệ thuật.\n- **Vì sao Cải cách tôn giáo nổ ra?** Vì Giáo hội Công giáo lạm quyền, bán \"thẻ miễn tội\" để thu lợi khiến nhiều người bất mãn; Lu-thơ công khai phản đối bằng \"95 luận đề\" năm 1517.",
  "quiz": [
   {
    "prompt": "Đế quốc Tây Rô-ma sụp đổ vào năm nào?",
    "explain": "Đây là mốc mở đầu thời trung đại ở Tây Âu.",
    "options": [
     "Năm 800",
     "Năm 1517",
     "Năm 1453",
     "Năm 476"
    ],
    "correct": 3
   },
   {
    "prompt": "Xã hội phong kiến Tây Âu gồm hai giai cấp chính là:",
    "explain": "Đặc trưng xã hội phong kiến Tây Âu.",
    "options": [
     "Lãnh chúa và nông nô",
     "Tư sản và vô sản",
     "Vua và quan lại",
     "Quý tộc và nông dân tự do"
    ],
    "correct": 0
   },
   {
    "prompt": "Lãnh địa phong kiến có đặc điểm kinh tế là:",
    "explain": "Lãnh địa hầu như không trao đổi với bên ngoài.",
    "options": [
     "Công nghiệp hoá cao độ",
     "Buôn bán sầm uất với nước ngoài",
     "Tự cấp, tự túc, khép kín",
     "Phụ thuộc hoàn toàn vào nhập khẩu"
    ],
    "correct": 2
   },
   {
    "prompt": "Thành thị trung đại ở Tây Âu ra đời chủ yếu từ khoảng:",
    "explain": "Gắn với sự tách rời thủ công nghiệp khỏi nông nghiệp.",
    "options": [
     "Thế kỉ XV",
     "Thế kỉ V",
     "Thế kỉ XX",
     "Thế kỉ XI"
    ],
    "correct": 3
   },
   {
    "prompt": "Phong trào văn hoá Phục hưng khởi nguồn từ nước nào?",
    "explain": "Ý là quê hương của phong trào Phục hưng.",
    "options": [
     "Anh",
     "Đức",
     "Ý",
     "Tây Ban Nha"
    ],
    "correct": 2
   },
   {
    "prompt": "Phong trào Văn hoá Phục hưng chủ trương đề cao:",
    "explain": "Phục hưng đối lập với tư tưởng thần quyền khắc nghiệt.",
    "options": [
     "Chiến tranh xâm lược",
     "Thần quyền tuyệt đối",
     "Chế độ nông nô",
     "Giá trị con người và khoa học"
    ],
    "correct": 3
   },
   {
    "prompt": "Ai là người khởi xướng phong trào Cải cách tôn giáo?",
    "explain": "Lu-thơ đưa ra 95 luận đề năm 1517.",
    "options": [
     "Mi-ken-lăng-giơ",
     "Sếch-xpia",
     "Mác-tin Lu-thơ",
     "Lê-ô-na đờ Vanh-xi"
    ],
    "correct": 2
   },
   {
    "prompt": "Phong trào Cải cách tôn giáo nổ ra đầu tiên ở nước nào?",
    "explain": "Đức là nơi khởi phát phong trào.",
    "options": [
     "Bồ Đào Nha",
     "Pháp",
     "Ý",
     "Đức"
    ],
    "correct": 3
   },
   {
    "prompt": "Giáo hội Công giáo bị phản đối trong phong trào Cải cách vì:",
    "explain": "Đây là nguyên nhân trực tiếp gây bất mãn.",
    "options": [
     "Cấm xây nhà thờ mới",
     "Bán \"thẻ miễn tội\" để thu lợi",
     "Ủng hộ khoa học tự nhiên",
     "Từ chối thu thuế"
    ],
    "correct": 1
   },
   {
    "prompt": "Tôn giáo mới ra đời từ phong trào Cải cách tôn giáo là:",
    "explain": "Kết quả của phong trào Cải cách.",
    "options": [
     "Ấn Độ giáo",
     "Hồi giáo",
     "Phật giáo",
     "Đạo Tin Lành"
    ],
    "correct": 3
   }
  ],
  "advanced": [
   {
    "prompt": "Bức tranh nổi tiếng 'Nàng Mô-na Li-sa' là tác phẩm của họa sĩ nào?",
    "answer": "Leonardo da Vinci|Lê-ô-na đờ Vanh-xi|Lê ô na đờ Vanh xi",
    "solution": "Tác giả là Lê-ô-na đờ Vanh-xi, danh họa thời Phục hưng."
   },
   {
    "prompt": "Văn bản khởi đầu phong trào Cải cách tôn giáo gồm bao nhiêu luận đề? (chỉ ghi số)",
    "answer": "95",
    "solution": "Mác-tin Lu-thơ công bố '95 luận đề' năm 1517."
   },
   {
    "prompt": "Giai cấp nào bị lệ thuộc, phải làm việc cho lãnh chúa trong lãnh địa phong kiến?",
    "answer": "nông nô",
    "solution": "Nông nô là giai cấp bị bóc lột trong xã hội phong kiến Tây Âu."
   },
   {
    "prompt": "Đế quốc Tây Rô-ma sụp đổ dưới các cuộc tấn công của tộc người nào?",
    "answer": "người Giéc-man|giéc man|german",
    "solution": "Người Giéc-man đã lật đổ Tây Rô-ma năm 476."
   }
  ]
 },
 {
  "id": "ls2-trung-quoc-an-do",
  "category": "lich-su",
  "title": "Trung Quốc và Ấn Độ thời trung đại",
  "summary": "## Trung Quốc và Ấn Độ thời trung đại\n\n**Trung Quốc:** trải qua các triều đại Tuỳ, **Đường** (618–907), Tống, **Nguyên** (do người Mông Cổ lập), **Minh**, **Thanh**.\n- Thời Đường: chế độ **quân điền** (chia ruộng công cho nông dân), khoa cử tuyển chọn quan lại, kinh tế thịnh trị, mở rộng giao thương qua **Con đường tơ lụa**.\n- Thời Minh – Thanh: kinh tế hàng hoá phát triển, xuất hiện mầm mống kinh tế tư bản chủ nghĩa nhưng bị kìm hãm bởi chính sách **\"bế quan toả cảng\"**.\n- Thành tựu văn hoá nổi bật: **Tứ đại phát minh** (giấy, kĩ thuật in, la bàn, thuốc súng); văn học (Đường thi; tiểu thuyết Minh – Thanh như *Tam quốc diễn nghĩa*, *Tây du kí*); Nho giáo.\n\n**Ấn Độ:**\n- Vương triều **Gúp-ta** (thế kỉ IV–VI): thời kì hoàng kim của văn hoá Ấn Độ cổ – trung đại.\n- Vương triều Hồi giáo **Đê-li** (thế kỉ XIII–XVI): do người Hồi giáo gốc Thổ Nhĩ Kỳ lập nên ở miền Bắc Ấn Độ.\n- Vương triều **Mô-gôn** (từ thế kỉ XVI): do Ba-bua lập, phát triển rực rỡ dưới thời vua A-cơ-ba.\n- Văn hoá Ấn Độ: Hin-đu giáo và Phật giáo, chữ Phạn, kiến trúc đền tháp đặc sắc.\n\n### Bối cảnh & vì sao\n- **Vì sao nhà Đường trở nên cường thịnh?** Nhờ chế độ quân điền ổn định nông nghiệp, khoa cử tuyển người tài, mở rộng giao thương qua Con đường tơ lụa.\n- **Vì sao Trung Quốc thời Minh – Thanh thực hiện \"bế quan toả cảng\"?** Vì lo ngại ảnh hưởng từ thương nhân và nhà truyền giáo phương Tây đe doạ sự ổn định của chế độ phong kiến.\n- **Vì sao vương triều Hồi giáo Đê-li ra đời ở Ấn Độ?** Do người Hồi giáo Thổ Nhĩ Kỳ xâm chiếm miền Bắc Ấn Độ, lập nên vương triều mới, đưa văn hoá Hồi giáo vào một vùng đất vốn theo Hin-đu giáo.",
  "quiz": [
   {
    "prompt": "Triều đại nào ở Trung Quốc gắn liền với 'Con đường tơ lụa' phát triển rực rỡ?",
    "explain": "Thời Đường (618-907) là giai đoạn hưng thịnh, giao thương mạnh.",
    "options": [
     "Nhà Đường",
     "Nhà Thanh",
     "Nhà Nguyên",
     "Nhà Minh"
    ],
    "correct": 0
   },
   {
    "prompt": "Chế độ chia ruộng đất công cho nông dân thời Đường gọi là:",
    "explain": "Chính sách ruộng đất quan trọng thời Đường.",
    "options": [
     "Chế độ tỉnh điền",
     "Chế độ công điền",
     "Chế độ tô, dung, điệu",
     "Chế độ quân điền"
    ],
    "correct": 3
   },
   {
    "prompt": "Triều đại nào ở Trung Quốc do người Mông Cổ lập nên?",
    "explain": "Nhà Nguyên (1271-1368) do Hốt Tất Liệt lập.",
    "options": [
     "Nhà Tống",
     "Nhà Thanh",
     "Nhà Nguyên",
     "Nhà Đường"
    ],
    "correct": 2
   },
   {
    "prompt": "Chính sách hạn chế giao thương với nước ngoài thời Minh - Thanh gọi là:",
    "explain": "Chính sách đóng cửa với bên ngoài.",
    "options": [
     "Quân điền",
     "Bế quan toả cảng",
     "Khoa cử",
     "Trọng nông ức thương"
    ],
    "correct": 1
   },
   {
    "prompt": "Tứ đại phát minh của Trung Quốc thời trung đại gồm giấy, la bàn, thuốc súng và:",
    "explain": "Bốn phát minh lớn ảnh hưởng thế giới.",
    "options": [
     "Kĩ thuật in",
     "Đồng hồ nước",
     "Bánh xe",
     "Kính viễn vọng"
    ],
    "correct": 0
   },
   {
    "prompt": "Vương triều nào được coi là thời kì hoàng kim văn hoá Ấn Độ cổ - trung đại?",
    "explain": "Gúp-ta (thế kỉ IV-VI) là đỉnh cao văn hoá Ấn Độ.",
    "options": [
     "Vương triều Gúp-ta",
     "Vương triều Ma-ga-đa",
     "Vương triều Mô-gôn",
     "Vương triều Đê-li"
    ],
    "correct": 0
   },
   {
    "prompt": "Vương triều Hồi giáo Đê-li do nhóm người nào lập nên?",
    "explain": "Họ xâm chiếm và lập vương triều ở Bắc Ấn Độ.",
    "options": [
     "Người Mông Cổ",
     "Người bản địa Ấn Độ",
     "Người Ba Tư",
     "Người Hồi giáo gốc Thổ Nhĩ Kỳ"
    ],
    "correct": 3
   },
   {
    "prompt": "Vương triều Mô-gôn ở Ấn Độ phát triển rực rỡ nhất dưới thời vua nào?",
    "explain": "A-cơ-ba đưa Mô-gôn lên đỉnh cao.",
    "options": [
     "Ha-sa",
     "Ba-bua",
     "A-cơ-ba",
     "A-sô-ca"
    ],
    "correct": 2
   },
   {
    "prompt": "Tôn giáo có ảnh hưởng sâu rộng, gắn liền với văn hoá truyền thống Ấn Độ là:",
    "explain": "Hin-đu giáo là tôn giáo lớn, lâu đời ở Ấn Độ.",
    "options": [
     "Hin-đu giáo",
     "Thần đạo",
     "Nho giáo",
     "Đạo giáo"
    ],
    "correct": 0
   },
   {
    "prompt": "Tiểu thuyết 'Tây du kí' ra đời trong giai đoạn nào của lịch sử Trung Quốc?",
    "explain": "Tiểu thuyết cổ điển nổi tiếng thời Minh.",
    "options": [
     "Thời Minh - Thanh",
     "Thời Tần",
     "Thời Đường",
     "Thời Tống"
    ],
    "correct": 0
   }
  ],
  "advanced": [
   {
    "prompt": "Chế độ tuyển chọn quan lại thông qua các kì thi ở Trung Quốc thời phong kiến gọi là gì?",
    "answer": "khoa cử|chế độ khoa cử",
    "solution": "Khoa cử là hình thức tuyển người tài ra làm quan."
   },
   {
    "prompt": "Vị vua nào lập nên vương triều Mô-gôn ở Ấn Độ?",
    "answer": "Ba-bua|Babur",
    "solution": "Ba-bua sáng lập vương triều Mô-gôn đầu thế kỉ XVI."
   },
   {
    "prompt": "Con đường thương mại nổi tiếng nối Trung Quốc với phương Tây thời trung đại tên là gì?",
    "answer": "con đường tơ lụa",
    "solution": "Con đường tơ lụa là tuyến giao thương Đông-Tây quan trọng."
   },
   {
    "prompt": "Trung Quốc thời Minh-Thanh thực hiện chính sách gì khiến kinh tế tư bản chủ nghĩa bị kìm hãm?",
    "answer": "bế quan toả cảng",
    "solution": "Chính sách đóng cửa hạn chế giao thương với bên ngoài."
   }
  ]
 },
 {
  "id": "ls3-dong-nam-a",
  "category": "lich-su",
  "title": "Đông Nam Á từ nửa sau thế kỉ X đến nửa đầu thế kỉ XVI",
  "summary": "## Đông Nam Á từ nửa sau thế kỉ X đến nửa đầu thế kỉ XVI\n\nTừ thế kỉ X–XVI, các quốc gia phong kiến Đông Nam Á bước vào giai đoạn phát triển **thịnh vượng**: Đại Việt, Chăm-pa, **Ăng-co** (Cam-pu-chia), Pa-gan (Mi-an-ma), Xu-khô-thay rồi A-út-thay-a (Thái Lan), **Lan Xang** (Lào), Gia-va (In-đô-nê-xi-a)...\n\n**Vương quốc Lào (Lan Xang):** thành lập năm **1353** khi **Pha Ngừm** thống nhất các mường Lào; thịnh vượng nhất vào thế kỉ XV–XVII.\n\n**Vương quốc Cam-pu-chia (thời kì Ăng-co, thế kỉ IX–XV):** xây dựng đế chế hùng mạnh nhờ kiểm soát nguồn nước để phát triển nông nghiệp lúa nước; nổi tiếng với quần thể kiến trúc **Ăng-co Vát**.\n\n**Kinh tế:** nông nghiệp lúa nước là chủ đạo; giao thương đường biển phát triển mạnh nhờ vị trí nằm trên tuyến đường biển Đông – Tây (nối Ấn Độ Dương với Thái Bình Dương).\n\n**Văn hoá:** chịu ảnh hưởng sâu sắc của văn hoá Ấn Độ và Trung Hoa (tôn giáo, chữ viết, kiến trúc) nhưng có sự sáng tạo, bản sắc riêng của từng dân tộc.\n\n### Bối cảnh & vì sao\n- **Vì sao Đông Nam Á giai đoạn này phát triển thịnh vượng?** Nhờ ổn định chính trị (các vương quốc thống nhất lãnh thổ), phát triển nông nghiệp lúa nước, và tận dụng lợi thế vị trí trên tuyến đường thương mại biển Đông – Tây.\n- **Vì sao Ăng-co xây dựng được đế chế hùng mạnh?** Nhờ hệ thống thuỷ lợi phức tạp kiểm soát nguồn nước, tạo ra nguồn lương thực dồi dào nuôi sống một đế chế rộng lớn.",
  "quiz": [
   {
    "prompt": "Vương quốc Lan Xang (Lào) được thành lập vào năm nào?",
    "explain": "Pha Ngừm thống nhất các mường Lào lập nên Lan Xang.",
    "options": [
     "Năm 939",
     "Năm 1353",
     "Năm 1010",
     "Năm 1428"
    ],
    "correct": 1
   },
   {
    "prompt": "Ai là người thống nhất các mường Lào, lập nên Lan Xang?",
    "explain": "Pha Ngừm là người sáng lập vương quốc Lan Xang.",
    "options": [
     "Xu-ri-a-vác-man II",
     "Ăng-co",
     "Giay-a-vác-man VII",
     "Pha Ngừm"
    ],
    "correct": 3
   },
   {
    "prompt": "Kiến trúc Ăng-co Vát nổi tiếng gắn liền với vương quốc nào?",
    "explain": "Ăng-co Vát là biểu tượng của thời kì Ăng-co ở Cam-pu-chia.",
    "options": [
     "Lào",
     "Thái Lan",
     "Mi-an-ma",
     "Cam-pu-chia"
    ],
    "correct": 3
   },
   {
    "prompt": "Đế chế Ăng-co xây dựng sức mạnh chủ yếu dựa trên việc kiểm soát:",
    "explain": "Hệ thống thuỷ lợi là nền tảng sức mạnh Ăng-co.",
    "options": [
     "Nguồn nước cho nông nghiệp lúa nước",
     "Ngành đóng tàu viễn dương",
     "Mỏ vàng",
     "Đường tơ lụa trên bộ"
    ],
    "correct": 0
   },
   {
    "prompt": "Đông Nam Á thời kì X-XVI có nền kinh tế chủ đạo là:",
    "explain": "Nông nghiệp lúa nước là nền tảng kinh tế khu vực.",
    "options": [
     "Công nghiệp nặng",
     "Khai thác dầu mỏ",
     "Nông nghiệp lúa nước",
     "Chăn nuôi du mục"
    ],
    "correct": 2
   },
   {
    "prompt": "Đông Nam Á có lợi thế về vị trí địa lí là nằm trên tuyến đường:",
    "explain": "Vị trí cầu nối Ấn Độ Dương và Thái Bình Dương.",
    "options": [
     "Thương mại biển Đông - Tây",
     "Tơ lụa trên bộ duy nhất",
     "Đường sắt xuyên lục địa",
     "Hàng không quốc tế"
    ],
    "correct": 0
   },
   {
    "prompt": "Văn hoá các quốc gia Đông Nam Á thời kì này chịu ảnh hưởng sâu sắc từ:",
    "explain": "Hai nền văn minh lớn ảnh hưởng tới khu vực.",
    "options": [
     "Ấn Độ và Trung Hoa",
     "Châu Phi",
     "Bắc Mỹ",
     "Tây Âu"
    ],
    "correct": 0
   },
   {
    "prompt": "Kinh đô Xu-khô-thay rồi A-út-thay-a là các vương triều phong kiến của nước nào ngày nay?",
    "explain": "Xu-khô-thay và A-út-thay-a thuộc lịch sử Thái Lan.",
    "options": [
     "Cam-pu-chia",
     "Thái Lan",
     "In-đô-nê-xi-a",
     "Mi-an-ma"
    ],
    "correct": 1
   },
   {
    "prompt": "Thời kì Ăng-co của Cam-pu-chia kéo dài khoảng thời gian nào?",
    "explain": "Đây là giai đoạn phát triển đỉnh cao của Ăng-co.",
    "options": [
     "Thế kỉ XVI - XVIII",
     "Thế kỉ XIX - XX",
     "Thế kỉ I - V",
     "Thế kỉ IX - XV"
    ],
    "correct": 3
   },
   {
    "prompt": "Vương quốc nào ở Đông Nam Á hải đảo phát triển mạnh dựa vào thương mại biển?",
    "explain": "Các quốc gia hải đảo phát triển nhờ thương mại đường biển.",
    "options": [
     "Lan Xang",
     "Pa-gan",
     "Gia-va (In-đô-nê-xi-a)",
     "Đại Việt"
    ],
    "correct": 2
   }
  ],
  "advanced": [
   {
    "prompt": "Vương quốc Lan Xang là tên gọi cổ của nước nào ngày nay?",
    "answer": "Lào",
    "solution": "Lan Xang là tên gọi trước đây của Lào."
   },
   {
    "prompt": "Ai đã thống nhất các mường Lào, lập nên vương quốc Lan Xang năm 1353?",
    "answer": "Pha Ngừm",
    "solution": "Pha Ngừm là người sáng lập Lan Xang."
   },
   {
    "prompt": "Công trình kiến trúc nổi tiếng nhất của thời kì Ăng-co (Cam-pu-chia) tên là gì?",
    "answer": "Ăng-co Vát|Angkor Wat",
    "solution": "Ăng-co Vát là quần thể đền đài nổi tiếng."
   },
   {
    "prompt": "Nền kinh tế chủ đạo của các quốc gia Đông Nam Á thời kì X-XVI là gì?",
    "answer": "nông nghiệp lúa nước",
    "solution": "Nông nghiệp lúa nước là nền tảng kinh tế của khu vực."
   }
  ]
 },
 {
  "id": "ls4-ngo-dinh-tien-le",
  "category": "lich-su",
  "title": "Đất nước dưới thời Ngô - Đinh - Tiền Lê (939-1009)",
  "summary": "## Đất nước dưới thời các vương triều Ngô – Đinh – Tiền Lê (939–1009)\n\n**Nhà Ngô (939–965):** Năm **938**, **Ngô Quyền** đánh tan quân Nam Hán trên **sông Bạch Đằng**, chấm dứt hơn 1000 năm Bắc thuộc. Năm **939**, ông xưng vương, đóng đô ở **Cổ Loa**, mở đầu thời kì độc lập, tự chủ lâu dài của dân tộc.\n\nSau khi Ngô Quyền mất (944), đất nước rơi vào tình trạng cát cứ — sử gọi là **\"Loạn 12 sứ quân\"**.\n\n**Nhà Đinh (968–980):** Năm **968**, **Đinh Bộ Lĩnh** dẹp loạn 12 sứ quân, thống nhất đất nước, lên ngôi hoàng đế (Đinh Tiên Hoàng), đặt quốc hiệu **Đại Cồ Việt**, đóng đô ở **Hoa Lư**.\n\n**Nhà Tiền Lê (980–1009):** Trước nguy cơ quân Tống xâm lược, **Lê Hoàn** được suy tôn lên ngôi, lãnh đạo kháng chiến chống Tống thắng lợi (**981**).\n\nCả ba triều đại bước đầu xây dựng chính quyền quân chủ, chia đất nước thành các đơn vị hành chính, chú trọng phát triển nông nghiệp và thủ công nghiệp.\n\n### Bối cảnh & vì sao\n- **Vì sao Ngô Quyền chọn sông Bạch Đằng để đánh quân Nam Hán?** Vì lợi dụng thuỷ triều lên xuống, ông cho đóng cọc gỗ nhọn ngầm dưới lòng sông; khi triều rút, thuyền địch mắc cạn và bị tiêu diệt.\n- **Vì sao xảy ra \"Loạn 12 sứ quân\"?** Vì sau khi Ngô Quyền mất, triều đình suy yếu, các hào trưởng địa phương nổi lên cát cứ, tranh giành quyền lực.\n- **Vì sao Đinh Bộ Lĩnh dẹp được loạn 12 sứ quân?** Nhờ tài thao lược, biết kết hợp cả hoà hoãn (liên kết, kết thân) lẫn biện pháp quân sự để thu phục các sứ quân khác.",
  "quiz": [
   {
    "prompt": "Ngô Quyền đánh tan quân Nam Hán trên sông Bạch Đằng vào năm nào?",
    "explain": "Chiến thắng Bạch Đằng chấm dứt Bắc thuộc.",
    "options": [
     "Năm 938",
     "Năm 968",
     "Năm 981",
     "Năm 939"
    ],
    "correct": 0
   },
   {
    "prompt": "Ngô Quyền xưng vương, đóng đô ở đâu?",
    "explain": "Ngô Quyền chọn Cổ Loa làm kinh đô.",
    "options": [
     "Hoa Lư",
     "Thăng Long",
     "Phú Xuân",
     "Cổ Loa"
    ],
    "correct": 3
   },
   {
    "prompt": "Tình trạng đất nước bị chia cắt sau khi Ngô Quyền mất gọi là:",
    "explain": "Đây là giai đoạn cát cứ trước thời Đinh.",
    "options": [
     "Loạn kiêu binh",
     "Khởi nghĩa Lam Sơn",
     "Loạn 12 sứ quân",
     "Chiến tranh Trịnh - Nguyễn"
    ],
    "correct": 2
   },
   {
    "prompt": "Ai là người dẹp loạn 12 sứ quân, thống nhất đất nước năm 968?",
    "explain": "Đinh Bộ Lĩnh lập nên nhà Đinh.",
    "options": [
     "Ngô Quyền",
     "Lý Công Uẩn",
     "Đinh Bộ Lĩnh",
     "Lê Hoàn"
    ],
    "correct": 2
   },
   {
    "prompt": "Quốc hiệu nước ta dưới thời Đinh Bộ Lĩnh là:",
    "explain": "Đinh Tiên Hoàng đặt quốc hiệu Đại Cồ Việt.",
    "options": [
     "Văn Lang",
     "Âu Lạc",
     "Đại Việt",
     "Đại Cồ Việt"
    ],
    "correct": 3
   },
   {
    "prompt": "Kinh đô nước ta thời Đinh - Tiền Lê đặt ở đâu?",
    "explain": "Hoa Lư (Ninh Bình) là kinh đô thời Đinh - Tiền Lê.",
    "options": [
     "Cổ Loa",
     "Đông Đô",
     "Hoa Lư",
     "Thăng Long"
    ],
    "correct": 2
   },
   {
    "prompt": "Ai lãnh đạo cuộc kháng chiến chống Tống thắng lợi năm 981?",
    "explain": "Lê Hoàn lập nhà Tiền Lê, đánh bại quân Tống.",
    "options": [
     "Ngô Quyền",
     "Lê Hoàn",
     "Lý Thường Kiệt",
     "Đinh Bộ Lĩnh"
    ],
    "correct": 1
   },
   {
    "prompt": "Lê Hoàn được suy tôn lên ngôi trong hoàn cảnh nào?",
    "explain": "Tình thế cấp bách đòi hỏi người lãnh đạo tài giỏi.",
    "options": [
     "Sau khi thi đỗ trạng nguyên",
     "Khi vua Đinh Tiên Hoàng nhường ngôi hoà bình",
     "Sau khi đánh bại quân Nguyên",
     "Trước nguy cơ quân Tống xâm lược"
    ],
    "correct": 3
   },
   {
    "prompt": "Ngô Quyền xưng vương vào năm nào?",
    "explain": "Sau chiến thắng Bạch Đằng một năm.",
    "options": [
     "Năm 980",
     "Năm 938",
     "Năm 968",
     "Năm 939"
    ],
    "correct": 3
   },
   {
    "prompt": "Chiến thắng Bạch Đằng năm 938 có ý nghĩa lịch sử là:",
    "explain": "Đây là mốc mở ra thời kì độc lập tự chủ.",
    "options": [
     "Đánh bại quân Nguyên - Mông",
     "Thống nhất 12 sứ quân",
     "Mở đầu thời kì Bắc thuộc",
     "Chấm dứt hơn 1000 năm Bắc thuộc"
    ],
    "correct": 3
   }
  ],
  "advanced": [
   {
    "prompt": "Ngô Quyền đã lợi dụng hiện tượng tự nhiên nào để đánh bại quân Nam Hán trên sông Bạch Đằng?",
    "answer": "thuỷ triều|thủy triều",
    "solution": "Ông lợi dụng thủy triều lên xuống để bố trí trận địa cọc ngầm."
   },
   {
    "prompt": "Quốc hiệu nước ta thời Đinh Tiên Hoàng là gì?",
    "answer": "Đại Cồ Việt",
    "solution": "Đinh Tiên Hoàng đặt quốc hiệu Đại Cồ Việt."
   },
   {
    "prompt": "Ai lãnh đạo kháng chiến chống Tống thắng lợi năm 981?",
    "answer": "Lê Hoàn",
    "solution": "Lê Hoàn lập nhà Tiền Lê và đánh bại quân Tống."
   },
   {
    "prompt": "Kinh đô của nước ta dưới thời Đinh và Tiền Lê đặt ở đâu?",
    "answer": "Hoa Lư",
    "solution": "Hoa Lư (Ninh Bình ngày nay) là kinh đô hai triều đại này."
   }
  ]
 },
 {
  "id": "ls5-ly-tran-ho",
  "category": "lich-su",
  "title": "Đại Việt thời Lý - Trần - Hồ (1009-1407)",
  "summary": "## Đại Việt thời Lý – Trần – Hồ (1009–1407)\n\n**Nhà Lý (1009–1225):** **Lý Công Uẩn** dời đô từ Hoa Lư về Đại La, đổi tên **Thăng Long** (**1010**). Xây dựng nhà nước quân chủ trung ương tập quyền; ban hành bộ luật thành văn đầu tiên (Hình thư); lập **Văn Miếu** (1070) và **Quốc Tử Giám** (1076) — trường đại học đầu tiên của nước ta. Kháng chiến chống Tống thắng lợi (1075–1077) gắn với tên tuổi **Lý Thường Kiệt** và phòng tuyến sông Như Nguyệt.\n\n**Nhà Trần (1226–1400):** thay thế nhà Lý. Ba lần kháng chiến chống quân **Mông – Nguyên** thắng lợi (1258, 1285, 1288), nổi bật là **Trần Hưng Đạo** với chiến thắng **Bạch Đằng** năm 1288. Kinh tế, văn hoá – giáo dục tiếp tục phát triển.\n\n**Nhà Hồ (1400–1407):** **Hồ Quý Ly** lập ra sau khi thay thế nhà Trần, thực hiện nhiều cải cách (tiền giấy, quân sự, giáo dục) nhưng chỉ tồn tại ngắn ngủi, bị nhà **Minh** xâm lược và đô hộ năm 1407.\n\n### Bối cảnh & vì sao\n- **Vì sao Lý Công Uẩn dời đô về Thăng Long?** Vì Hoa Lư địa thế hiểm trở nhưng chật hẹp; Đại La (Thăng Long) ở vị trí trung tâm đất nước, thuận lợi giao thông và phát triển kinh tế lâu dài.\n- **Vì sao Đại Việt ba lần đánh thắng được quân Mông – Nguyên?** Nhờ tinh thần đoàn kết toàn dân (Hội nghị Diên Hồng), chiến lược \"vườn không nhà trống\", tài thao lược của các tướng lĩnh nhà Trần.\n- **Vì sao nhà Hồ nhanh chóng sụp đổ dù có nhiều cải cách tiến bộ?** Vì các cải cách thực hiện gấp gáp, chưa được lòng dân, trong khi quân Minh xâm lược với lực lượng mạnh, nhà Hồ chưa kịp củng cố sức mạnh quân sự – chính trị.",
  "quiz": [
   {
    "prompt": "Ai là người dời đô từ Hoa Lư về Thăng Long năm 1010?",
    "explain": "Lý Công Uẩn là vị vua sáng lập nhà Lý.",
    "options": [
     "Lý Thường Kiệt",
     "Trần Hưng Đạo",
     "Lý Công Uẩn",
     "Hồ Quý Ly"
    ],
    "correct": 2
   },
   {
    "prompt": "Kinh đô Thăng Long trước đây có tên là gì?",
    "explain": "Lý Công Uẩn đổi tên Đại La thành Thăng Long.",
    "options": [
     "Hoa Lư",
     "Phú Xuân",
     "Đại La",
     "Cổ Loa"
    ],
    "correct": 2
   },
   {
    "prompt": "Trường đại học đầu tiên của nước ta là:",
    "explain": "Quốc Tử Giám lập năm 1076 thời Lý.",
    "options": [
     "Văn Miếu",
     "Sùng Chính viện",
     "Quốc Tử Giám",
     "Hàn lâm viện"
    ],
    "correct": 2
   },
   {
    "prompt": "Ai lãnh đạo cuộc kháng chiến chống Tống (1075-1077) với phòng tuyến sông Như Nguyệt?",
    "explain": "Lý Thường Kiệt là danh tướng thời Lý.",
    "options": [
     "Trần Quốc Toản",
     "Lý Công Uẩn",
     "Trần Hưng Đạo",
     "Lý Thường Kiệt"
    ],
    "correct": 3
   },
   {
    "prompt": "Nhà Trần đã lãnh đạo nhân dân đánh thắng quân xâm lược nào ba lần?",
    "explain": "Ba lần kháng chiến 1258, 1285, 1288.",
    "options": [
     "Nhà Tống",
     "Nhà Minh",
     "Mông - Nguyên",
     "Nhà Thanh"
    ],
    "correct": 2
   },
   {
    "prompt": "Ai là vị tướng lãnh đạo chiến thắng Bạch Đằng năm 1288?",
    "explain": "Trần Hưng Đạo là danh tướng kiệt xuất thời Trần.",
    "options": [
     "Lý Thường Kiệt",
     "Nguyễn Trãi",
     "Lê Hoàn",
     "Trần Hưng Đạo"
    ],
    "correct": 3
   },
   {
    "prompt": "Hội nghị nào thể hiện tinh thần đoàn kết chống Mông - Nguyên của nhà Trần?",
    "explain": "Hội nghị Diên Hồng hỏi ý dân về việc đánh giặc.",
    "options": [
     "Hội nghị Diên Hồng",
     "Hội nghị Tân Trào",
     "Hội thề Lũng Nhai",
     "Hội nghị Bình Than"
    ],
    "correct": 0
   },
   {
    "prompt": "Ai lập ra nhà Hồ, thay thế nhà Trần năm 1400?",
    "explain": "Hồ Quý Ly lập nhà Hồ năm 1400.",
    "options": [
     "Hồ Nguyên Trừng",
     "Hồ Hán Thương",
     "Trần Thủ Độ",
     "Hồ Quý Ly"
    ],
    "correct": 3
   },
   {
    "prompt": "Nhà Hồ thực hiện cải cách nào về tiền tệ?",
    "explain": "Đây là cải cách táo bạo của Hồ Quý Ly.",
    "options": [
     "Đúc tiền vàng",
     "Bỏ hẳn tiền tệ",
     "Dùng vỏ sò làm tiền",
     "Phát hành tiền giấy"
    ],
    "correct": 3
   },
   {
    "prompt": "Nhà Hồ sụp đổ do bị triều đại nào xâm lược, đô hộ?",
    "explain": "Quân Minh xâm lược năm 1407.",
    "options": [
     "Nhà Tống",
     "Nhà Thanh",
     "Nhà Minh",
     "Nhà Nguyên"
    ],
    "correct": 2
   }
  ],
  "advanced": [
   {
    "prompt": "Lý Công Uẩn dời đô về đâu và đổi tên thành gì vào năm 1010?",
    "answer": "Thăng Long",
    "solution": "Ông dời đô về Đại La và đổi tên thành Thăng Long."
   },
   {
    "prompt": "Ai lãnh đạo chiến thắng Bạch Đằng năm 1288 chống quân Nguyên?",
    "answer": "Trần Hưng Đạo",
    "solution": "Trần Hưng Đạo là vị tướng chỉ huy chiến thắng này."
   },
   {
    "prompt": "Nhà Trần đã ba lần kháng chiến chống quân xâm lược nào?",
    "answer": "Mông - Nguyên|quân Mông Nguyên",
    "solution": "Ba lần kháng chiến chống Mông - Nguyên các năm 1258, 1285, 1288."
   },
   {
    "prompt": "Ai lập ra nhà Hồ vào năm 1400?",
    "answer": "Hồ Quý Ly",
    "solution": "Hồ Quý Ly phế truất nhà Trần, lập nhà Hồ."
   }
  ]
 },
 {
  "id": "ls6-lam-son-le-so",
  "category": "lich-su",
  "title": "Khởi nghĩa Lam Sơn và Đại Việt thời Lê sơ (1428-1527)",
  "summary": "## Khởi nghĩa Lam Sơn và Đại Việt thời Lê sơ (1428–1527)\n\nSau khi nhà Hồ thất bại, nhà **Minh** đô hộ nước ta (1407–1427), thi hành chính sách cai trị hà khắc, đồng hoá văn hoá.\n\n**Khởi nghĩa Lam Sơn:** Năm **1418**, **Lê Lợi** dựng cờ khởi nghĩa ở **Lam Sơn** (Thanh Hoá), cùng **Nguyễn Trãi** lãnh đạo cuộc kháng chiến kéo dài **10 năm**. Năm **1427**, chiến thắng **Chi Lăng – Xương Giang** đè bẹp viện binh nhà Minh, buộc quân Minh rút về nước.\n\n**Nhà Lê sơ (1428–1527):** Năm 1428, Lê Lợi lên ngôi, đặt lại quốc hiệu **Đại Việt**. Dưới thời vua **Lê Thánh Tông** (1460–1497): cải cách hành chính toàn diện, ban hành bộ luật **Hồng Đức** (Quốc triều hình luật), kinh tế – giáo dục – văn hoá phát triển rực rỡ — được coi là thời kì **cực thịnh** của chế độ phong kiến Việt Nam.\n\n### Bối cảnh & vì sao\n- **Vì sao Lê Lợi chọn Lam Sơn làm căn cứ khởi nghĩa?** Vì đây là vùng núi rừng hiểm trở (Thanh Hoá), thuận lợi xây dựng căn cứ, tránh sự truy quét của quân Minh, đồng thời gần dân để dễ huy động lực lượng.\n- **Vì sao khởi nghĩa Lam Sơn ban đầu khó khăn nhưng cuối cùng thắng lợi?** Nhờ chiến lược đúng đắn (tiến vào Nghệ An làm bàn đạp mở rộng), sự ủng hộ của nhân dân, tài năng Lê Lợi – Nguyễn Trãi (kết hợp quân sự với \"tâm công\" — đánh vào lòng người), và nghệ thuật quân sự linh hoạt.\n- **Vì sao thời Lê Thánh Tông được coi là giai đoạn cực thịnh?** Nhờ cải cách bộ máy hành chính chặt chẽ, ban hành luật pháp hoàn chỉnh (Hồng Đức), coi trọng giáo dục – khoa cử, khuyến khích nông nghiệp.",
  "quiz": [
   {
    "prompt": "Lê Lợi dựng cờ khởi nghĩa ở Lam Sơn vào năm nào?",
    "explain": "Mốc mở đầu khởi nghĩa Lam Sơn.",
    "options": [
     "Năm 1428",
     "Năm 1418",
     "Năm 1427",
     "Năm 1407"
    ],
    "correct": 1
   },
   {
    "prompt": "Ai là quân sư, cùng Lê Lợi lãnh đạo khởi nghĩa Lam Sơn?",
    "explain": "Nguyễn Trãi là nhà chính trị, quân sự kiệt xuất.",
    "options": [
     "Trần Nguyên Hãn",
     "Lê Lai",
     "Nguyễn Trãi",
     "Nguyễn Chích"
    ],
    "correct": 2
   },
   {
    "prompt": "Khởi nghĩa Lam Sơn kéo dài bao nhiêu năm?",
    "explain": "Từ 1418 đến 1427/1428.",
    "options": [
     "10 năm",
     "30 năm",
     "20 năm",
     "5 năm"
    ],
    "correct": 0
   },
   {
    "prompt": "Chiến thắng nào đè bẹp viện binh nhà Minh năm 1427?",
    "explain": "Chiến thắng quyết định kết thúc chiến tranh.",
    "options": [
     "Rạch Gầm - Xoài Mút",
     "Bạch Đằng",
     "Chi Lăng - Xương Giang",
     "Như Nguyệt"
    ],
    "correct": 2
   },
   {
    "prompt": "Lê Lợi lên ngôi vua, lập ra triều đại nào vào năm 1428?",
    "explain": "Mở đầu thời kì Lê sơ.",
    "options": [
     "Nhà Mạc",
     "Nhà Lê trung hưng",
     "Nhà Hồ",
     "Nhà Lê sơ"
    ],
    "correct": 3
   },
   {
    "prompt": "Vị vua nào đưa nhà Lê sơ lên đỉnh cao cực thịnh?",
    "explain": "Lê Thánh Tông trị vì 1460-1497.",
    "options": [
     "Lê Nhân Tông",
     "Lê Lợi",
     "Lê Thái Tổ",
     "Lê Thánh Tông"
    ],
    "correct": 3
   },
   {
    "prompt": "Bộ luật nổi tiếng thời Lê sơ có tên gọi là:",
    "explain": "Còn gọi là Quốc triều hình luật.",
    "options": [
     "Hoàng Việt luật lệ",
     "Luật Gia Long",
     "Luật Hồng Đức",
     "Hình thư"
    ],
    "correct": 2
   },
   {
    "prompt": "Nhà Minh đô hộ nước ta trong khoảng thời gian nào?",
    "explain": "20 năm đô hộ trước khởi nghĩa Lam Sơn thắng lợi.",
    "options": [
     "1428 - 1460",
     "1400 - 1407",
     "1407 - 1427",
     "1418 - 1428"
    ],
    "correct": 2
   },
   {
    "prompt": "Quốc hiệu nước ta được đặt lại là gì sau khi Lê Lợi lên ngôi?",
    "explain": "Quốc hiệu Đại Việt được khôi phục.",
    "options": [
     "Đại Nam",
     "Đại Việt",
     "Việt Nam",
     "Đại Cồ Việt"
    ],
    "correct": 1
   },
   {
    "prompt": "Chiến lược 'tâm công' trong khởi nghĩa Lam Sơn nghĩa là:",
    "explain": "Kết hợp quân sự với vận động chính trị.",
    "options": [
     "Dùng hoả công",
     "Đánh vào lòng người, thu phục nhân tâm",
     "Tấn công ban đêm",
     "Bao vây thành trì dài ngày"
    ],
    "correct": 1
   }
  ],
  "advanced": [
   {
    "prompt": "Lê Lợi dựng cờ khởi nghĩa ở đâu vào năm 1418?",
    "answer": "Lam Sơn",
    "solution": "Lam Sơn (Thanh Hóa) là nơi phát khởi cuộc khởi nghĩa."
   },
   {
    "prompt": "Ai là quân sư kiệt xuất, tác giả 'Bình Ngô đại cáo', cùng Lê Lợi lãnh đạo khởi nghĩa Lam Sơn?",
    "answer": "Nguyễn Trãi",
    "solution": "Nguyễn Trãi là nhà chính trị, quân sự, văn hóa lớn."
   },
   {
    "prompt": "Bộ luật nổi tiếng ban hành dưới thời vua Lê Thánh Tông tên là gì?",
    "answer": "luật Hồng Đức|Hồng Đức",
    "solution": "Bộ luật Hồng Đức (Quốc triều hình luật)."
   },
   {
    "prompt": "Chiến thắng nào năm 1427 đè bẹp viện binh nhà Minh, kết thúc khởi nghĩa Lam Sơn?",
    "answer": "Chi Lăng - Xương Giang|Chi Lăng Xương Giang",
    "solution": "Đây là chiến thắng quyết định của khởi nghĩa Lam Sơn."
   }
  ]
 },
 {
  "id": "ls7-vung-dat-phia-nam",
  "category": "lich-su",
  "title": "Vùng đất phía Nam Việt Nam từ đầu thế kỉ X đến đầu thế kỉ XVI",
  "summary": "## Vùng đất phía Nam Việt Nam từ đầu thế kỉ X đến đầu thế kỉ XVI\n\n**Vương quốc Chăm-pa:** hình thành từ thế kỉ **II**, phát triển qua nhiều giai đoạn, có nền văn hoá đặc sắc (đền tháp Chăm, chữ viết riêng, tôn giáo Hin-đu giáo và về sau có cả Hồi giáo). Từ thế kỉ X–XVI, Chăm-pa trải qua nhiều biến động, suy yếu dần và sáp nhập từng phần vào Đại Việt qua quá trình mở cõi về phương Nam.\n\n**Vùng đất Nam Bộ:** từ thế kỉ I–VII từng thuộc **Vương quốc Phù Nam** với nền văn hoá **Óc Eo** phát triển rực rỡ (di chỉ khảo cổ nổi tiếng ở An Giang). Sau khi Phù Nam suy vong (thế kỉ VII), vùng đất này thuộc quyền kiểm soát của **Chân Lạp** (Cam-pu-chia) nhưng khá thưa dân cư, ít được khai thác.\n\n### Bối cảnh & vì sao\n- **Vì sao Chăm-pa suy yếu dần từ thế kỉ X–XVI?** Do các cuộc chiến tranh liên tiếp với Đại Việt và Chân Lạp, mất dần lãnh thổ qua từng đợt Đại Việt tiến về phương Nam.\n- **Vì sao vùng Nam Bộ (từng là Phù Nam phát triển rực rỡ) lại trở nên thưa dân sau thế kỉ VII?** Vì Phù Nam suy vong, Chân Lạp kiểm soát nhưng trọng tâm phát triển của họ dồn về khu vực Ăng-co, khiến Nam Bộ trở thành vùng biên viễn ít được khai thác — tạo tiền đề để sau này người Việt vào khai khẩn.",
  "quiz": [
   {
    "prompt": "Vương quốc Chăm-pa hình thành từ khoảng thế kỉ nào?",
    "explain": "Chăm-pa là một trong những vương quốc cổ ở Đông Nam Á.",
    "options": [
     "Thế kỉ XV",
     "Thế kỉ X",
     "Thế kỉ V",
     "Thế kỉ II"
    ],
    "correct": 3
   },
   {
    "prompt": "Nền văn hoá khảo cổ nổi tiếng gắn với Vương quốc Phù Nam là:",
    "explain": "Óc Eo là di chỉ khảo cổ tiêu biểu của Phù Nam.",
    "options": [
     "Văn hoá Đông Sơn",
     "Văn hoá Sa Huỳnh",
     "Văn hoá Óc Eo",
     "Văn hoá Hoà Bình"
    ],
    "correct": 2
   },
   {
    "prompt": "Vương quốc Phù Nam từng tồn tại ở khu vực nào của Việt Nam ngày nay?",
    "explain": "Phù Nam gắn liền với vùng đồng bằng Nam Bộ.",
    "options": [
     "Bắc Bộ",
     "Tây Nguyên",
     "Nam Bộ",
     "Trung Bộ"
    ],
    "correct": 2
   },
   {
    "prompt": "Vương quốc Phù Nam suy vong vào khoảng thế kỉ nào?",
    "explain": "Sau đó vùng đất này thuộc quyền kiểm soát của Chân Lạp.",
    "options": [
     "Thế kỉ XV",
     "Thế kỉ II",
     "Thế kỉ X",
     "Thế kỉ VII"
    ],
    "correct": 3
   },
   {
    "prompt": "Sau khi Phù Nam suy vong, vùng Nam Bộ thuộc quyền kiểm soát của:",
    "explain": "Chân Lạp kiểm soát nhưng ít khai thác vùng này.",
    "options": [
     "Chăm-pa",
     "Đại Việt",
     "Xiêm La",
     "Chân Lạp (Cam-pu-chia)"
    ],
    "correct": 3
   },
   {
    "prompt": "Tôn giáo có ảnh hưởng lớn đến văn hoá Chăm-pa là:",
    "explain": "Hin-đu giáo ảnh hưởng sâu sắc tới kiến trúc, tín ngưỡng Chăm.",
    "options": [
     "Nho giáo",
     "Hin-đu giáo",
     "Đạo giáo",
     "Thần đạo"
    ],
    "correct": 1
   },
   {
    "prompt": "Chăm-pa dần suy yếu và sáp nhập vào Đại Việt do:",
    "explain": "Đây là một quá trình lịch sử lâu dài, nhiều biến động.",
    "options": [
     "Các cuộc chiến tranh và quá trình Đại Việt tiến về phương Nam",
     "Bị Trung Quốc đô hộ trực tiếp",
     "Tự nguyện sáp nhập không xung đột",
     "Bị thiên tai xoá sổ hoàn toàn"
    ],
    "correct": 0
   },
   {
    "prompt": "Đặc trưng nổi bật của kiến trúc Chăm-pa là:",
    "explain": "Tháp Chăm là di sản kiến trúc đặc sắc còn tồn tại đến nay.",
    "options": [
     "Nhà sàn tre nứa",
     "Đền tháp bằng gạch nung",
     "Thành luỹ bằng đất nện",
     "Cung điện bằng gỗ lim"
    ],
    "correct": 1
   },
   {
    "prompt": "Vùng đất Nam Bộ trước thế kỉ VII từng là trung tâm của vương quốc nào?",
    "explain": "Phù Nam từng rất phát triển ở đây.",
    "options": [
     "Phù Nam",
     "Chân Lạp",
     "Xiêm",
     "Chăm-pa"
    ],
    "correct": 0
   },
   {
    "prompt": "Vì sao vùng Nam Bộ trở nên thưa dân sau khi Phù Nam suy vong?",
    "explain": "Trọng tâm phát triển của Chân Lạp không nằm ở Nam Bộ.",
    "options": [
     "Vì bị chiến tranh tàn phá liên miên với Chăm-pa",
     "Vì khí hậu khắc nghiệt không thể sinh sống",
     "Vì Chân Lạp dồn trọng tâm phát triển về khu vực Ăng-co",
     "Vì bị Đại Việt cấm dân cư sinh sống"
    ],
    "correct": 2
   }
  ],
  "advanced": [
   {
    "prompt": "Nền văn hoá khảo cổ nổi tiếng gắn với Vương quốc Phù Nam tên là gì?",
    "answer": "văn hoá Óc Eo|Óc Eo",
    "solution": "Óc Eo là di chỉ khảo cổ tiêu biểu ở An Giang."
   },
   {
    "prompt": "Vương quốc Chăm-pa hình thành từ khoảng thế kỉ mấy? (ghi số La Mã hoặc số)",
    "answer": "2|II",
    "solution": "Chăm-pa hình thành từ thế kỉ II."
   },
   {
    "prompt": "Sau khi Phù Nam suy vong (thế kỉ VII), vùng Nam Bộ thuộc quyền kiểm soát của vương quốc nào?",
    "answer": "Chân Lạp",
    "solution": "Chân Lạp (Cam-pu-chia) kiểm soát vùng đất này."
   },
   {
    "prompt": "Tôn giáo nào ảnh hưởng sâu sắc đến kiến trúc đền tháp của Chăm-pa?",
    "answer": "Hin-đu giáo|Ấn Độ giáo",
    "solution": "Hin-đu giáo ảnh hưởng lớn tới văn hóa, kiến trúc Chăm-pa."
   }
  ]
 },
 {
  "id": "ls8-do-thi",
  "category": "lich-su",
  "title": "Chủ đề chung: Đô thị - Lịch sử và hiện tại",
  "summary": "## Đô thị: Lịch sử và hiện tại\n\n**Đô thị** là khu vực tập trung dân cư sinh sống với mật độ cao, chủ yếu hoạt động trong lĩnh vực kinh tế phi nông nghiệp (thủ công nghiệp, thương nghiệp, dịch vụ).\n\n**Một số đô thị nổi tiếng trong lịch sử Việt Nam:**\n- **Thăng Long – Hà Nội:** kinh đô từ thời Lý (1010), trung tâm chính trị – văn hoá lâu đời của cả nước.\n- **Phố Hiến** (Hưng Yên): đô thị – thương cảng sầm uất thế kỉ XVII, dân gian có câu *\"Thứ nhất Kinh Kỳ, thứ nhì Phố Hiến\"*.\n- **Hội An** (Quảng Nam): thương cảng quốc tế sầm uất thế kỉ XVI–XVIII, nơi giao thương của thương nhân Nhật Bản, Trung Quốc, phương Tây.\n- **Sài Gòn – Gia Định:** trung tâm đô thị lớn ở Nam Bộ, hình thành và phát triển mạnh từ thế kỉ XVII–XVIII.\n\nĐô thị hình thành và phát triển gắn liền với sự phát triển của thủ công nghiệp, thương nghiệp và các tuyến giao thương.\n\n**Đô thị ngày nay:** quá trình đô thị hoá gắn liền với công nghiệp hoá, hiện đại hoá — vừa mang lại cơ hội phát triển kinh tế, vừa đặt ra thách thức (quá tải hạ tầng, ô nhiễm môi trường, chênh lệch giàu nghèo).\n\n### Bối cảnh & vì sao\n- **Vì sao Hội An trở thành thương cảng quốc tế sầm uất thế kỉ XVI–XVIII?** Nhờ vị trí thuận lợi (cửa sông, gần biển), chính sách mở cửa giao thương của chúa Nguyễn, thu hút thương nhân nước ngoài đến buôn bán.\n- **Vì sao Thăng Long trở thành trung tâm đô thị lớn qua nhiều triều đại?** Nhờ vị trí địa lí trung tâm, thuận lợi giao thông đường sông, được chọn làm kinh đô suốt gần 800 năm, tích luỹ phát triển liên tục về kinh tế – văn hoá – chính trị.",
  "quiz": [
   {
    "prompt": "Đô thị là khu vực tập trung dân cư chủ yếu hoạt động trong lĩnh vực:",
    "explain": "Đô thị gắn với thủ công nghiệp, thương nghiệp, dịch vụ.",
    "options": [
     "Khai thác rừng",
     "Kinh tế phi nông nghiệp",
     "Nông nghiệp thuần tuý",
     "Chăn nuôi du mục"
    ],
    "correct": 1
   },
   {
    "prompt": "Thăng Long trở thành kinh đô nước ta từ năm nào?",
    "explain": "Lý Công Uẩn dời đô về Thăng Long năm 1010.",
    "options": [
     "Năm 1802",
     "Năm 1010",
     "Năm 938",
     "Năm 1428"
    ],
    "correct": 1
   },
   {
    "prompt": "Câu ca dao 'Thứ nhất Kinh Kỳ, thứ nhì...' nói về đô thị nào?",
    "explain": "Phố Hiến (Hưng Yên) từng rất sầm uất.",
    "options": [
     "Đà Nẵng",
     "Phố Hiến",
     "Hội An",
     "Sài Gòn"
    ],
    "correct": 1
   },
   {
    "prompt": "Thương cảng quốc tế nổi tiếng thế kỉ XVI-XVIII ở Quảng Nam là:",
    "explain": "Hội An là nơi giao thương với thương nhân nước ngoài.",
    "options": [
     "Vân Đồn",
     "Hội An",
     "Thanh Hà",
     "Phố Hiến"
    ],
    "correct": 1
   },
   {
    "prompt": "Hội An thu hút thương nhân từ những nước nào đến buôn bán?",
    "explain": "Hội An là điểm giao thương quốc tế đa dạng.",
    "options": [
     "Nhật Bản, Trung Quốc, phương Tây",
     "Chỉ có Trung Quốc",
     "Chỉ có các nước châu Phi",
     "Chỉ có Ấn Độ"
    ],
    "correct": 0
   },
   {
    "prompt": "Trung tâm đô thị lớn ở Nam Bộ hình thành từ thế kỉ XVII-XVIII là:",
    "explain": "Sài Gòn - Gia Định phát triển mạnh ở Nam Bộ.",
    "options": [
     "Phố Hiến",
     "Hội An",
     "Thăng Long",
     "Sài Gòn - Gia Định"
    ],
    "correct": 3
   },
   {
    "prompt": "Yếu tố nào thúc đẩy đô thị hình thành và phát triển trong lịch sử?",
    "explain": "Đô thị gắn liền với hoạt động phi nông nghiệp.",
    "options": [
     "Dân số giảm mạnh",
     "Chiến tranh liên miên",
     "Thủ công nghiệp và thương nghiệp phát triển",
     "Chỉ có nông nghiệp phát triển"
    ],
    "correct": 2
   },
   {
    "prompt": "Quá trình đô thị hoá ngày nay gắn liền với:",
    "explain": "Đô thị hóa là xu thế tất yếu của phát triển kinh tế.",
    "options": [
     "Phi tập trung hoá dân cư",
     "Du mục hoá",
     "Công nghiệp hoá, hiện đại hoá",
     "Nông nghiệp hoá"
    ],
    "correct": 2
   },
   {
    "prompt": "Một thách thức của quá trình đô thị hoá hiện nay là:",
    "explain": "Đô thị hóa nhanh gây áp lực lên hạ tầng và môi trường.",
    "options": [
     "Quá tải hạ tầng, ô nhiễm môi trường",
     "Mất hoàn toàn bản sắc văn hoá",
     "Thiếu lao động nông nghiệp",
     "Dân số giảm quá nhanh"
    ],
    "correct": 0
   },
   {
    "prompt": "Đô thị Phố Hiến gắn liền với tỉnh nào ngày nay?",
    "explain": "Phố Hiến nằm ở Hưng Yên.",
    "options": [
     "Hưng Yên",
     "Thanh Hoá",
     "Quảng Nam",
     "Ninh Bình"
    ],
    "correct": 0
   }
  ],
  "advanced": [
   {
    "prompt": "Thương cảng quốc tế nổi tiếng thế kỉ XVI-XVIII ở Quảng Nam tên là gì?",
    "answer": "Hội An",
    "solution": "Hội An là thương cảng quốc tế sầm uất thời kỳ này."
   },
   {
    "prompt": "Câu ca dao 'Thứ nhất Kinh Kỳ, thứ nhì Phố Hiến' nhắc đến đô thị nào (ngoài Kinh Kỳ)?",
    "answer": "Phố Hiến",
    "solution": "Phố Hiến (Hưng Yên) từng là đô thị sầm uất thứ nhì cả nước."
   },
   {
    "prompt": "Thăng Long trở thành kinh đô nước ta từ năm nào? (chỉ ghi số)",
    "answer": "1010",
    "solution": "Lý Công Uẩn dời đô về Thăng Long năm 1010."
   },
   {
    "prompt": "Trung tâm đô thị lớn hình thành ở Nam Bộ thế kỉ XVII-XVIII có tên gì?",
    "answer": "Sài Gòn - Gia Định|Sài Gòn",
    "solution": "Sài Gòn - Gia Định là trung tâm đô thị lớn ở Nam Bộ."
   }
  ]
 },
 {
  "id": "dl1-chau-au",
  "category": "dia-li",
  "title": "Châu Âu",
  "summary": "## Châu Âu\n\n**Vị trí – hình dạng:** bộ phận phía tây của lục địa Á – Âu, ngăn cách với châu Á bởi dãy núi **U-ran**. Đường bờ biển bị cắt xẻ mạnh, tạo nhiều bán đảo, biển, vũng vịnh ăn sâu vào đất liền. Diện tích hơn **10 triệu km²** — chỉ lớn hơn châu Đại Dương.\n\n**Địa hình:** đồng bằng chiếm phần lớn diện tích (Đông Âu), núi già ở phía bắc và trung tâm, núi trẻ (dãy **An-pơ**) ở phía nam.\n\n**Khí hậu:** chủ yếu **ôn đới** — ôn đới hải dương ở Tây Âu (ấm, mưa nhiều quanh năm), ôn đới lục địa ở Đông Âu (mùa đông lạnh, mùa hè nóng); cận nhiệt Địa Trung Hải ở Nam Âu (hè khô nóng, đông ấm mưa); cực và cận cực ở Bắc Âu.\n\n**Dân cư – xã hội:** dân số **già**, tỉ lệ gia tăng tự nhiên **rất thấp**; mức độ **đô thị hoá cao**.\n\n**Liên minh châu Âu (EU):** tổ chức liên kết kinh tế – chính trị lớn nhất châu Âu, tiền thân là Cộng đồng Kinh tế châu Âu, thúc đẩy tự do lưu thông hàng hoá, con người giữa các nước thành viên.\n\n### Bối cảnh & vì sao\n- **Vì sao khí hậu Tây Âu mang tính hải dương sâu sắc?** Nhờ dòng biển nóng Bắc Đại Tây Dương và gió Tây ôn đới thổi từ biển vào mang theo hơi ấm, độ ẩm.\n- **Vì sao châu Âu có dân số già?** Do tỉ lệ sinh thấp, tuổi thọ trung bình cao (y tế phát triển), xu hướng kết hôn muộn, ít con ở các nước phát triển.\n- **Vì sao EU được thành lập?** Sau Chiến tranh thế giới thứ hai tàn phá châu Âu, các nước muốn hợp tác kinh tế để tái thiết, ngăn ngừa xung đột và tăng sức cạnh tranh toàn cầu.",
  "quiz": [
   {
    "prompt": "Châu Âu ngăn cách với châu Á bởi dãy núi nào?",
    "explain": "U-ran là ranh giới tự nhiên giữa châu Âu và châu Á.",
    "options": [
     "Dãy U-ran",
     "Dãy An-pơ",
     "Dãy Hi-ma-lay-a",
     "Dãy Át-lát"
    ],
    "correct": 0
   },
   {
    "prompt": "Địa hình chiếm phần lớn diện tích châu Âu là:",
    "explain": "Đồng bằng Đông Âu rất rộng lớn.",
    "options": [
     "Đồng bằng",
     "Núi cao",
     "Cao nguyên",
     "Hoang mạc"
    ],
    "correct": 0
   },
   {
    "prompt": "Kiểu khí hậu đặc trưng ở Tây Âu là:",
    "explain": "Tây Âu chịu ảnh hưởng lớn từ biển.",
    "options": [
     "Ôn đới hải dương",
     "Ôn đới lục địa",
     "Nhiệt đới gió mùa",
     "Hoang mạc"
    ],
    "correct": 0
   },
   {
    "prompt": "Dân số châu Âu hiện nay có đặc điểm là:",
    "explain": "Tỉ lệ người già cao, tỉ lệ sinh thấp.",
    "options": [
     "Dân số già",
     "Tăng rất nhanh",
     "Dân số rất trẻ",
     "Phân bố đều tuyệt đối"
    ],
    "correct": 0
   },
   {
    "prompt": "Mức độ đô thị hoá ở châu Âu nhìn chung là:",
    "explain": "Châu Âu có tỉ lệ dân đô thị cao hàng đầu thế giới.",
    "options": [
     "Rất cao",
     "Rất thấp",
     "Chưa xác định được",
     "Trung bình thấp"
    ],
    "correct": 0
   },
   {
    "prompt": "Tổ chức liên kết kinh tế - chính trị lớn nhất châu Âu là:",
    "explain": "EU là tổ chức liên kết khu vực tiêu biểu.",
    "options": [
     "WTO",
     "NATO",
     "Liên minh châu Âu (EU)",
     "ASEAN"
    ],
    "correct": 2
   },
   {
    "prompt": "Nguyên nhân chủ yếu khiến khí hậu Tây Âu ấm và ẩm là do:",
    "explain": "Yếu tố biển quyết định khí hậu Tây Âu.",
    "options": [
     "Dòng biển nóng và gió Tây ôn đới",
     "Không giáp biển",
     "Địa hình toàn núi cao",
     "Gần đường Xích đạo"
    ],
    "correct": 0
   },
   {
    "prompt": "Kiểu khí hậu có đặc điểm hè khô nóng, đông ấm và mưa nhiều là:",
    "explain": "Đặc trưng khí hậu Nam Âu.",
    "options": [
     "Ôn đới hải dương",
     "Cực và cận cực",
     "Cận nhiệt Địa Trung Hải",
     "Ôn đới lục địa"
    ],
    "correct": 2
   },
   {
    "prompt": "Dãy núi trẻ nổi tiếng ở phía nam châu Âu là:",
    "explain": "An-pơ là dãy núi trẻ, cao nhất châu Âu.",
    "options": [
     "Dãy Xcan-đi-na-vi",
     "Dãy Cac-pat",
     "Dãy U-ran",
     "Dãy An-pơ"
    ],
    "correct": 3
   },
   {
    "prompt": "Tiền thân của Liên minh châu Âu (EU) là:",
    "explain": "EU phát triển từ Cộng đồng Kinh tế châu Âu.",
    "options": [
     "Liên hợp quốc",
     "Cộng đồng Kinh tế châu Âu",
     "Hội Quốc liên",
     "Khối NATO"
    ],
    "correct": 1
   }
  ],
  "advanced": [
   {
    "prompt": "Dãy núi nào là ranh giới tự nhiên giữa châu Âu và châu Á?",
    "answer": "dãy U-ran|U-ran|Ural",
    "solution": "Dãy U-ran ngăn cách châu Âu với châu Á."
   },
   {
    "prompt": "Kiểu khí hậu đặc trưng của khu vực Tây Âu là gì?",
    "answer": "ôn đới hải dương",
    "solution": "Khí hậu ôn đới hải dương với đặc điểm ấm, ẩm quanh năm."
   },
   {
    "prompt": "Tổ chức liên kết kinh tế - chính trị lớn nhất châu Âu có tên viết tắt là gì?",
    "answer": "EU",
    "solution": "EU là Liên minh châu Âu."
   },
   {
    "prompt": "Dãy núi trẻ, cao nhất ở phía nam châu Âu tên là gì?",
    "answer": "dãy An-pơ|An-pơ|Alps",
    "solution": "Dãy An-pơ là dãy núi trẻ nổi tiếng ở Nam Âu."
   }
  ]
 },
 {
  "id": "dl2-chau-a",
  "category": "dia-li",
  "title": "Châu Á",
  "summary": "## Châu Á\n\n**Vị trí:** là châu lục **rộng lớn nhất** thế giới, trải dài từ vùng cực Bắc đến gần Xích đạo, tiếp giáp châu Âu, châu Phi và các đại dương lớn (Thái Bình Dương, Ấn Độ Dương, Bắc Băng Dương).\n\n**Địa hình:** đa dạng, nhiều hệ thống núi cao đồ sộ (dãy **Hi-ma-lay-a**, sơn nguyên **Tây Tạng** — sơn nguyên đồ sộ nhất thế giới), nhiều đồng bằng châu thổ rộng lớn (Lưỡng Hà, Hoa Bắc, Ấn – Hằng).\n\n**Khí hậu:** đa dạng bậc nhất thế giới do lãnh thổ trải rộng trên nhiều vĩ độ, địa hình phức tạp — gồm nhiều đới và kiểu khí hậu (gió mùa, lục địa, hoang mạc, cực...).\n\n**Dân cư:** châu lục **đông dân nhất** thế giới, nhiều chủng tộc, tôn giáo, ngôn ngữ; phân bố dân cư **không đều** — tập trung đông ở các đồng bằng châu thổ, ven biển.\n\n**Kinh tế:** có nhiều nền kinh tế lớn (Trung Quốc, Nhật Bản, Hàn Quốc, Ấn Độ...) và nhiều nền kinh tế mới nổi, phát triển năng động.\n\n### Bối cảnh & vì sao\n- **Vì sao châu Á có khí hậu đa dạng bậc nhất thế giới?** Do lãnh thổ trải dài trên nhiều vĩ độ (từ vùng cực đến Xích đạo), địa hình phức tạp (núi cao, cao nguyên, đồng bằng), chịu ảnh hưởng gió mùa mạnh.\n- **Vì sao dân cư châu Á phân bố không đều?** Dân cư tập trung đông ở các đồng bằng châu thổ, ven biển (thuận lợi nông nghiệp, giao thông); thưa thớt ở vùng núi cao, hoang mạc, khí hậu khắc nghiệt.",
  "quiz": [
   {
    "prompt": "Châu Á là châu lục có đặc điểm nổi bật là:",
    "explain": "Châu Á có diện tích lớn nhất trong các châu lục.",
    "options": [
     "Rộng lớn nhất thế giới",
     "Nhỏ nhất thế giới",
     "Ít dân nhất thế giới",
     "Không có núi cao"
    ],
    "correct": 0
   },
   {
    "prompt": "Sơn nguyên đồ sộ nhất thế giới nằm ở châu Á có tên là:",
    "explain": "Tây Tạng là sơn nguyên cao và rộng nhất thế giới.",
    "options": [
     "Sơn nguyên Iran",
     "Sơn nguyên Đê-can",
     "Sơn nguyên Tây Tạng",
     "Sơn nguyên Trung Xi-bia"
    ],
    "correct": 2
   },
   {
    "prompt": "Dãy núi cao nhất thế giới nằm ở châu Á là:",
    "explain": "Hi-ma-lay-a có đỉnh Ê-vơ-rét cao nhất thế giới.",
    "options": [
     "An-pơ",
     "Hi-ma-lay-a",
     "Át-lát",
     "U-ran"
    ],
    "correct": 1
   },
   {
    "prompt": "Châu Á là châu lục có dân số:",
    "explain": "Châu Á chiếm hơn một nửa dân số thế giới.",
    "options": [
     "Đang giảm dần đều",
     "Ít nhất thế giới",
     "Bằng châu Âu",
     "Đông nhất thế giới"
    ],
    "correct": 3
   },
   {
    "prompt": "Khí hậu châu Á có đặc điểm nổi bật là:",
    "explain": "Do lãnh thổ trải rộng trên nhiều vĩ độ.",
    "options": [
     "Toàn bộ là khí hậu nóng ẩm",
     "Rất đa dạng, nhiều đới khí hậu",
     "Toàn bộ là khí hậu lạnh giá",
     "Chỉ có một kiểu khí hậu duy nhất"
    ],
    "correct": 1
   },
   {
    "prompt": "Dân cư châu Á tập trung đông đúc chủ yếu ở:",
    "explain": "Đây là những khu vực thuận lợi sinh sống, sản xuất.",
    "options": [
     "Hoang mạc trung tâm",
     "Vùng cực Bắc",
     "Vùng núi cao hiểm trở",
     "Đồng bằng châu thổ và ven biển"
    ],
    "correct": 3
   },
   {
    "prompt": "Đồng bằng nào sau đây KHÔNG thuộc châu Á?",
    "explain": "Mi-xi-xi-pi thuộc Bắc Mỹ.",
    "options": [
     "Đồng bằng sông Mi-xi-xi-pi",
     "Đồng bằng Hoa Bắc",
     "Đồng bằng Ấn - Hằng",
     "Đồng bằng Lưỡng Hà"
    ],
    "correct": 0
   },
   {
    "prompt": "Nền kinh tế nào sau đây được coi là nền kinh tế lớn ở châu Á?",
    "explain": "Nhật Bản là một trong những nền kinh tế lớn nhất châu Á.",
    "options": [
     "Ca-na-đa",
     "Nhật Bản",
     "Bra-xin",
     "Ai Cập"
    ],
    "correct": 1
   },
   {
    "prompt": "Châu Á tiếp giáp với đại dương nào sau đây?",
    "explain": "Châu Á giáp Thái Bình Dương, Ấn Độ Dương, Bắc Băng Dương.",
    "options": [
     "Đại Tây Dương",
     "Thái Bình Dương",
     "Chỉ giáp Bắc Băng Dương",
     "Không giáp đại dương nào"
    ],
    "correct": 1
   },
   {
    "prompt": "Nguyên nhân chính khiến khí hậu châu Á đa dạng là do:",
    "explain": "Yếu tố vĩ độ và địa hình quyết định sự đa dạng khí hậu.",
    "options": [
     "Lãnh thổ trải dài trên nhiều vĩ độ, địa hình phức tạp",
     "Không có núi cao",
     "Toàn bộ nằm trong vùng Xích đạo",
     "Diện tích quá nhỏ"
    ],
    "correct": 0
   }
  ],
  "advanced": [
   {
    "prompt": "Sơn nguyên đồ sộ nhất thế giới, nằm ở châu Á, tên là gì?",
    "answer": "Tây Tạng|sơn nguyên Tây Tạng",
    "solution": "Sơn nguyên Tây Tạng là sơn nguyên cao và rộng nhất thế giới."
   },
   {
    "prompt": "Dãy núi cao nhất thế giới, nằm ở châu Á, tên là gì?",
    "answer": "Hi-ma-lay-a|Himalaya",
    "solution": "Dãy Hi-ma-lay-a có đỉnh Ê-vơ-rét cao nhất thế giới."
   },
   {
    "prompt": "Châu Á là châu lục đông dân nhất hay ít dân nhất thế giới?",
    "answer": "đông dân nhất",
    "solution": "Châu Á chiếm hơn một nửa dân số thế giới."
   },
   {
    "prompt": "Dân cư châu Á tập trung đông đúc nhất ở loại địa hình nào?",
    "answer": "đồng bằng",
    "solution": "Đồng bằng châu thổ và ven biển là nơi dân cư tập trung đông."
   }
  ]
 },
 {
  "id": "dl3-chau-phi",
  "category": "dia-li",
  "title": "Châu Phi",
  "summary": "## Châu Phi\n\n**Vị trí:** đại bộ phận lãnh thổ nằm giữa **hai chí tuyến**, gần như \"cân xứng\" hai bên đường Xích đạo — là châu lục **nóng nhất** thế giới.\n\n**Địa hình:** chủ yếu là **cao nguyên**, tương đối bằng phẳng; **hoang mạc Xa-ha-ra** (lớn nhất thế giới) chiếm diện tích rộng lớn ở Bắc Phi.\n\n**Khí hậu:** nóng bậc nhất thế giới do phần lớn lãnh thổ nằm trong vùng nội chí tuyến, nhận được lượng bức xạ mặt trời lớn quanh năm; khô hạn, hoang mạc chiếm diện tích lớn.\n\n**Dân cư – xã hội:** tỉ lệ gia tăng dân số tự nhiên **cao nhất thế giới**; nhiều vấn đề về nghèo đói, xung đột sắc tộc, dịch bệnh vẫn còn tồn tại ở một số khu vực.\n\n**Kinh tế:** chủ yếu dựa vào khai thác khoáng sản và nông nghiệp; nhiều quốc gia đang phát triển, còn gặp nhiều khó khăn.\n\n### Bối cảnh & vì sao\n- **Vì sao châu Phi được coi là châu lục nóng nhất thế giới?** Vì phần lớn lãnh thổ nằm trong vùng nội chí tuyến (giữa hai chí tuyến Bắc – Nam), nhận được lượng bức xạ mặt trời lớn quanh năm.\n- **Vì sao châu Phi có tỉ lệ gia tăng dân số tự nhiên cao nhất thế giới?** Do tỉ lệ sinh cao (quan niệm truyền thống, thiếu kế hoạch hoá gia đình), trong khi tỉ lệ tử vong đang giảm dần nhờ y tế cải thiện.",
  "quiz": [
   {
    "prompt": "Châu Phi được coi là châu lục có đặc điểm khí hậu nổi bật là:",
    "explain": "Phần lớn lãnh thổ nằm trong vùng nội chí tuyến.",
    "options": [
     "Nhiều tuyết nhất thế giới",
     "Nóng nhất thế giới",
     "Ẩm ướt nhất thế giới",
     "Lạnh nhất thế giới"
    ],
    "correct": 1
   },
   {
    "prompt": "Hoang mạc lớn nhất thế giới, nằm ở châu Phi, có tên là:",
    "explain": "Xa-ha-ra là hoang mạc lớn nhất thế giới, ở Bắc Phi.",
    "options": [
     "Na-mip",
     "Xa-ha-ra",
     "Ca-la-ha-ri",
     "Gô-bi"
    ],
    "correct": 1
   },
   {
    "prompt": "Địa hình chủ yếu của châu Phi là:",
    "explain": "Châu Phi được ví như một khối cao nguyên khổng lồ.",
    "options": [
     "Núi cao hiểm trở",
     "Cao nguyên",
     "Đồng bằng thấp",
     "Hệ thống đảo"
    ],
    "correct": 1
   },
   {
    "prompt": "Châu Phi có tỉ lệ gia tăng dân số tự nhiên như thế nào so với thế giới?",
    "explain": "Tỉ lệ sinh cao là đặc điểm nổi bật của châu Phi.",
    "options": [
     "Bằng châu Âu",
     "Thấp nhất thế giới",
     "Đang giảm về 0",
     "Cao nhất thế giới"
    ],
    "correct": 3
   },
   {
    "prompt": "Phần lớn lãnh thổ châu Phi nằm trong vùng:",
    "explain": "Đây là nguyên nhân khiến châu Phi rất nóng.",
    "options": [
     "Nội chí tuyến",
     "Cận cực",
     "Ôn đới",
     "Hàn đới"
    ],
    "correct": 0
   },
   {
    "prompt": "Nền kinh tế châu Phi chủ yếu dựa vào:",
    "explain": "Nhiều nước châu Phi vẫn đang phát triển.",
    "options": [
     "Công nghệ cao",
     "Du lịch vũ trụ",
     "Khai thác khoáng sản và nông nghiệp",
     "Dịch vụ tài chính"
    ],
    "correct": 2
   },
   {
    "prompt": "Một trong những vấn đề xã hội còn tồn tại ở nhiều nơi tại châu Phi là:",
    "explain": "Đây là những thách thức lớn của châu Phi hiện nay.",
    "options": [
     "Dân số già hoá nghiêm trọng",
     "Thiếu tài nguyên khoáng sản",
     "Quá lạnh để sinh sống",
     "Nghèo đói và xung đột sắc tộc"
    ],
    "correct": 3
   },
   {
    "prompt": "Đường Xích đạo đi qua châu Phi ở vị trí nào?",
    "explain": "Châu Phi nằm cân xứng hai bên Xích đạo.",
    "options": [
     "Không đi qua châu Phi",
     "Gần giữa lãnh thổ châu Phi",
     "Chỉ đi qua cực Nam châu Phi",
     "Chỉ đi qua cực Bắc châu Phi"
    ],
    "correct": 1
   },
   {
    "prompt": "Vì sao châu Phi nhận được lượng bức xạ mặt trời lớn quanh năm?",
    "explain": "Vị trí địa lí quyết định lượng bức xạ nhận được.",
    "options": [
     "Vì có diện tích nhỏ",
     "Vì có nhiều núi cao che chắn",
     "Vì giáp nhiều đại dương lớn",
     "Vì phần lớn lãnh thổ nằm giữa hai chí tuyến"
    ],
    "correct": 3
   },
   {
    "prompt": "Tỉ lệ tử vong ở châu Phi đang có xu hướng:",
    "explain": "Y tế phát triển giúp giảm tỉ lệ tử vong.",
    "options": [
     "Bằng 0 hoàn toàn",
     "Không thay đổi",
     "Tăng nhanh liên tục",
     "Giảm dần nhờ y tế cải thiện"
    ],
    "correct": 3
   }
  ],
  "advanced": [
   {
    "prompt": "Hoang mạc lớn nhất thế giới, nằm ở châu Phi, tên là gì?",
    "answer": "Xa-ha-ra|Sahara",
    "solution": "Xa-ha-ra là hoang mạc lớn nhất thế giới."
   },
   {
    "prompt": "Châu Phi có tỉ lệ gia tăng dân số tự nhiên cao hay thấp nhất thế giới?",
    "answer": "cao nhất",
    "solution": "Châu Phi có tỉ lệ gia tăng dân số tự nhiên cao nhất thế giới."
   },
   {
    "prompt": "Vì sao châu Phi được coi là châu lục nóng nhất thế giới? (điền ý chính: nằm giữa hai...)",
    "answer": "hai chí tuyến|chí tuyến",
    "solution": "Phần lớn lãnh thổ châu Phi nằm giữa hai chí tuyến Bắc - Nam."
   },
   {
    "prompt": "Địa hình chủ yếu của châu Phi là dạng địa hình gì?",
    "answer": "cao nguyên",
    "solution": "Châu Phi chủ yếu là các cao nguyên rộng lớn."
   }
  ]
 },
 {
  "id": "dl4-chau-my",
  "category": "dia-li",
  "title": "Châu Mỹ",
  "summary": "## Châu Mỹ\n\nChâu Mỹ được **Cri-xtô-phơ Cô-lôm-bô** phát kiến ra năm **1492** (dưới góc nhìn người châu Âu — trên thực tế, thổ dân **Anh-điêng** đã sinh sống từ rất lâu trước đó).\n\n**Vị trí:** trải dài từ vùng cực Bắc đến gần cực Nam, gồm ba khu vực: **Bắc Mỹ**, **Trung Mỹ** và **Nam Mỹ**.\n\n**Bắc Mỹ:** địa hình chia 3 khu vực rõ rệt (núi già phía đông, đồng bằng trung tâm, núi trẻ **Coóc-đi-e** phía tây); kinh tế phát triển hàng đầu thế giới (Hoa Kỳ, Ca-na-đa).\n\n**Trung và Nam Mỹ:** địa hình đa dạng (dãy núi trẻ **An-đét** phía tây, đồng bằng **A-ma-dôn** — nơi có rừng nhiệt đới lớn nhất thế giới); văn hoá **Mỹ La-tinh** đặc sắc, pha trộn văn hoá bản địa, châu Âu và châu Phi.\n\n### Bối cảnh & vì sao\n- **Vì sao gọi là \"phát kiến địa lí\" dù châu Mỹ đã có người sinh sống?** Vì đây là góc nhìn từ người châu Âu — lần đầu tiên họ biết đến và tiếp cận lục địa này, mở ra thời kì khám phá, giao lưu (và cả xâm chiếm thuộc địa) giữa Cựu thế giới và Tân thế giới.\n- **Vì sao Bắc Mỹ (Hoa Kỳ, Ca-na-đa) có nền kinh tế phát triển hàng đầu thế giới?** Nhờ tài nguyên thiên nhiên phong phú, trình độ khoa học – kĩ thuật cao, thể chế kinh tế – chính trị ổn định, thu hút đầu tư và nhân tài toàn cầu.",
  "quiz": [
   {
    "prompt": "Ai là người có công phát kiến ra châu Mỹ năm 1492?",
    "explain": "Cô-lôm-bô là nhà thám hiểm nổi tiếng.",
    "options": [
     "Va-xcô đơ Ga-ma",
     "Va-xcô Nu-nhết",
     "Cri-xtô-phơ Cô-lôm-bô",
     "Ph.Ma-gien-lăng"
    ],
    "correct": 2
   },
   {
    "prompt": "Trước khi người châu Âu đến, châu Mỹ đã có cư dân bản địa là:",
    "explain": "Người Anh-điêng là cư dân bản địa châu Mỹ.",
    "options": [
     "Người Hy Lạp",
     "Người Vi-king",
     "Người Anh-điêng",
     "Người Giéc-man"
    ],
    "correct": 2
   },
   {
    "prompt": "Châu Mỹ được chia thành mấy khu vực chính?",
    "explain": "Ba khu vực địa lí - văn hoá chính.",
    "options": [
     "5 khu vực",
     "2 khu vực",
     "4 khu vực",
     "3 khu vực (Bắc Mỹ, Trung Mỹ, Nam Mỹ)"
    ],
    "correct": 3
   },
   {
    "prompt": "Dãy núi trẻ ở phía tây Bắc Mỹ có tên là:",
    "explain": "Coóc-đi-e trải dài từ Ca-na-đa xuống Mê-hi-cô.",
    "options": [
     "Coóc-đi-e",
     "An-đét",
     "Át-lát",
     "Hi-ma-lay-a"
    ],
    "correct": 0
   },
   {
    "prompt": "Khu rừng nhiệt đới lớn nhất thế giới nằm ở khu vực nào của châu Mỹ?",
    "explain": "Rừng A-ma-dôn được ví là 'lá phổi xanh' của Trái Đất.",
    "options": [
     "Trung Mỹ",
     "Ca-ri-bê",
     "Bắc Mỹ",
     "Đồng bằng A-ma-dôn (Nam Mỹ)"
    ],
    "correct": 3
   },
   {
    "prompt": "Dãy núi trẻ nổi tiếng ở phía tây Nam Mỹ có tên là:",
    "explain": "An-đét là dãy núi dài nhất thế giới.",
    "options": [
     "An-pơ",
     "An-đét",
     "Coóc-đi-e",
     "U-ran"
    ],
    "correct": 1
   },
   {
    "prompt": "Hai quốc gia có nền kinh tế phát triển hàng đầu ở Bắc Mỹ là:",
    "explain": "Hoa Kỳ và Ca-na-đa có nền kinh tế rất phát triển.",
    "options": [
     "Hoa Kỳ và Ca-na-đa",
     "Bra-xin và Ác-hen-ti-na",
     "Mê-hi-cô và Cu-ba",
     "Chi-lê và Pê-ru"
    ],
    "correct": 0
   },
   {
    "prompt": "Văn hoá pha trộn giữa bản địa, châu Âu và châu Phi ở Trung, Nam Mỹ gọi là văn hoá:",
    "explain": "Văn hóa Mỹ La-tinh rất đặc sắc, đa dạng.",
    "options": [
     "Bắc Âu",
     "Đông Á",
     "Mỹ La-tinh",
     "Trung Đông"
    ],
    "correct": 2
   },
   {
    "prompt": "Vì sao gọi sự kiện năm 1492 là 'phát kiến địa lí' dù châu Mỹ đã có người ở?",
    "explain": "Góc nhìn 'phát kiến' xuất phát từ người châu Âu.",
    "options": [
     "Vì châu Mỹ khi đó hoàn toàn không có người",
     "Vì đó là sự kiện không có ý nghĩa lịch sử",
     "Vì đó là lần đầu người châu Âu biết đến lục địa này",
     "Vì người bản địa mời gọi người châu Âu đến"
    ],
    "correct": 2
   },
   {
    "prompt": "Địa hình Bắc Mỹ chia thành mấy khu vực địa hình rõ rệt theo hướng đông - tây?",
    "explain": "Núi già phía đông, đồng bằng giữa, núi trẻ phía tây.",
    "options": [
     "3 khu vực",
     "4 khu vực",
     "2 khu vực",
     "1 khu vực duy nhất"
    ],
    "correct": 0
   }
  ],
  "advanced": [
   {
    "prompt": "Ai là người có công phát kiến ra châu Mỹ vào năm 1492?",
    "answer": "Cri-xtô-phơ Cô-lôm-bô|Cô-lôm-bô|Columbus",
    "solution": "Cô-lôm-bô là nhà thám hiểm phát kiến ra châu Mỹ."
   },
   {
    "prompt": "Cư dân bản địa sinh sống ở châu Mỹ trước khi người châu Âu đến có tên gọi là gì?",
    "answer": "người Anh-điêng|Anh-điêng",
    "solution": "Người Anh-điêng là cư dân bản địa của châu Mỹ."
   },
   {
    "prompt": "Khu rừng nhiệt đới lớn nhất thế giới nằm ở đồng bằng nào của Nam Mỹ?",
    "answer": "A-ma-dôn|Amazon",
    "solution": "Đồng bằng A-ma-dôn có rừng nhiệt đới lớn nhất thế giới."
   },
   {
    "prompt": "Dãy núi trẻ dài nhất thế giới, nằm ở phía tây Nam Mỹ, tên là gì?",
    "answer": "An-đét|Andes",
    "solution": "Dãy An-đét là dãy núi dài nhất thế giới."
   }
  ]
 },
 {
  "id": "dl5-chau-dai-duong-nam-cuc",
  "category": "dia-li",
  "title": "Châu Đại Dương và Châu Nam Cực",
  "summary": "## Châu Đại Dương và Châu Nam Cực\n\n**Châu Đại Dương:** gồm lục địa **Ô-xtrây-li-a** và vô số đảo, quần đảo nhỏ nằm rải rác trên Thái Bình Dương. Khí hậu khô hạn ở khu vực trung tâm Ô-xtrây-li-a (hoang mạc), phần lớn dân cư tập trung ở **ven biển**, nơi khí hậu ôn hoà, thuận lợi hơn.\n\n**Châu Nam Cực:** lục địa **lạnh nhất**, **gió mạnh nhất**, **khô nhất** thế giới; hầu như không có dân cư sinh sống thường xuyên (chỉ có các trạm nghiên cứu khoa học của nhiều quốc gia). Có trữ lượng băng khổng lồ — chiếm phần lớn lượng **nước ngọt** trên Trái Đất (ở dạng băng).\n\n### Bối cảnh & vì sao\n- **Vì sao châu Nam Cực gần như không có người sinh sống thường trú?** Do khí hậu vô cùng khắc nghiệt (nhiệt độ có thể xuống dưới –80°C), gió bão dữ dội, không có điều kiện sinh hoạt hay nông nghiệp tự nhiên.\n- **Vì sao Ô-xtrây-li-a có vùng trung tâm hoang mạc khô hạn?** Do nằm trong vành đai áp cao cận chí tuyến, ít mưa, vùng trung tâm lại xa biển nên không được điều hoà độ ẩm.",
  "quiz": [
   {
    "prompt": "Lục địa lớn nhất của châu Đại Dương có tên là:",
    "explain": "Ô-xtrây-li-a là lục địa - quốc gia chính của châu Đại Dương.",
    "options": [
     "Ô-xtrây-li-a",
     "Phi-gi",
     "Niu Di-len",
     "Pa-pua Niu Ghi-nê"
    ],
    "correct": 0
   },
   {
    "prompt": "Khu vực trung tâm của Ô-xtrây-li-a có đặc điểm khí hậu là:",
    "explain": "Trung tâm lục địa Ô-xtrây-li-a chủ yếu là hoang mạc.",
    "options": [
     "Ẩm ướt nhiệt đới",
     "Mưa nhiều quanh năm",
     "Khô hạn, hoang mạc",
     "Lạnh giá quanh năm"
    ],
    "correct": 2
   },
   {
    "prompt": "Dân cư Ô-xtrây-li-a tập trung chủ yếu ở:",
    "explain": "Ven biển có khí hậu thuận lợi hơn để sinh sống.",
    "options": [
     "Trung tâm lục địa",
     "Ven biển",
     "Vùng núi cao",
     "Hoang mạc"
    ],
    "correct": 1
   },
   {
    "prompt": "Châu lục được coi là lạnh nhất, khô nhất, nhiều gió nhất thế giới là:",
    "explain": "Châu Nam Cực có điều kiện tự nhiên khắc nghiệt nhất.",
    "options": [
     "Châu Âu",
     "Châu Đại Dương",
     "Châu Nam Cực",
     "Châu Á"
    ],
    "correct": 2
   },
   {
    "prompt": "Châu Nam Cực hầu như không có dân cư sinh sống thường xuyên vì:",
    "explain": "Nhiệt độ cực thấp khiến việc sinh sống gần như không thể.",
    "options": [
     "Không có tài nguyên gì",
     "Bị cấm con người đặt chân đến",
     "Diện tích quá nhỏ",
     "Khí hậu quá khắc nghiệt"
    ],
    "correct": 3
   },
   {
    "prompt": "Hoạt động của con người chủ yếu diễn ra ở châu Nam Cực là:",
    "explain": "Chỉ có các trạm nghiên cứu khoa học hoạt động ở đây.",
    "options": [
     "Khai thác du lịch đại trà",
     "Nghiên cứu khoa học tại các trạm",
     "Trồng trọt quy mô lớn",
     "Chăn nuôi gia súc"
    ],
    "correct": 1
   },
   {
    "prompt": "Châu Nam Cực có vai trò quan trọng vì lưu giữ phần lớn:",
    "explain": "Băng ở Nam Cực chứa lượng nước ngọt khổng lồ.",
    "options": [
     "Rừng nhiệt đới",
     "Than đá thế giới",
     "Nước ngọt của Trái Đất (dạng băng)",
     "Dầu mỏ thế giới"
    ],
    "correct": 2
   },
   {
    "prompt": "Nguyên nhân khiến vùng trung tâm Ô-xtrây-li-a khô hạn là do:",
    "explain": "Áp cao cận chí tuyến gây khô hạn, ít mưa.",
    "options": [
     "Chịu ảnh hưởng gió mùa mạnh",
     "Có quá nhiều núi cao chắn gió ẩm",
     "Nằm trong vành đai áp cao cận chí tuyến, xa biển",
     "Nằm sát Xích đạo"
    ],
    "correct": 2
   },
   {
    "prompt": "Châu Đại Dương nằm chủ yếu trên đại dương nào?",
    "explain": "Các đảo của châu Đại Dương rải rác trên Thái Bình Dương.",
    "options": [
     "Ấn Độ Dương",
     "Bắc Băng Dương",
     "Thái Bình Dương",
     "Đại Tây Dương"
    ],
    "correct": 2
   },
   {
    "prompt": "Nhiệt độ ở châu Nam Cực có thể xuống thấp tới mức nào?",
    "explain": "Đây là một trong những nơi lạnh nhất Trái Đất.",
    "options": [
     "Khoảng 0°C",
     "Khoảng 10°C",
     "Không bao giờ dưới 0°C",
     "Dưới -80°C"
    ],
    "correct": 3
   }
  ],
  "advanced": [
   {
    "prompt": "Lục địa lớn nhất của châu Đại Dương có tên là gì?",
    "answer": "Ô-xtrây-li-a|Australia",
    "solution": "Ô-xtrây-li-a là lục địa chính của châu Đại Dương."
   },
   {
    "prompt": "Châu lục nào được coi là lạnh nhất, khô nhất và nhiều gió nhất thế giới?",
    "answer": "châu Nam Cực|Nam Cực",
    "solution": "Châu Nam Cực có điều kiện khí hậu khắc nghiệt nhất Trái Đất."
   },
   {
    "prompt": "Dân cư Ô-xtrây-li-a tập trung chủ yếu ở khu vực nào của lục địa?",
    "answer": "ven biển",
    "solution": "Ven biển có khí hậu ôn hòa, thuận lợi hơn trung tâm hoang mạc."
   },
   {
    "prompt": "Châu Nam Cực lưu giữ phần lớn tài nguyên gì của Trái Đất (ở dạng băng)?",
    "answer": "nước ngọt",
    "solution": "Băng ở Nam Cực chứa phần lớn lượng nước ngọt của Trái Đất."
   }
  ]
 }
];

function readBest(id) {
  try { const v = window.localStorage.getItem("sd7-quiz-best-" + id); return v === null ? null : parseInt(v, 10); } catch (e) { return null; }
}

function renderSummary(md) {
  const lines = md.split("\n");
  const blocks = [];
  let listBuf = [];
  let tableBuf = [];
  const bold = (s) => s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  const flushList = () => {
    if (listBuf.length) {
      blocks.push(<ul key={blocks.length}>{listBuf.map((li, i) => <li key={i} dangerouslySetInnerHTML={{ __html: li }} />)}</ul>);
      listBuf = [];
    }
  };
  const flushTable = () => {
    if (tableBuf.length) {
      const rows = tableBuf.filter((r) => !/^\|?\s*-+\s*\|/.test(r));
      const cells = rows.map((r) => r.replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
      const [head, ...body] = cells;
      blocks.push(
        <table key={blocks.length}>
          <thead><tr>{head.map((h, i) => <th key={i} dangerouslySetInnerHTML={{ __html: bold(h) }} />)}</tr></thead>
          <tbody>{body.map((row, ri) => <tr key={ri}>{row.map((c, ci) => <td key={ci} dangerouslySetInnerHTML={{ __html: bold(c) }} />)}</tr>)}</tbody>
        </table>
      );
      tableBuf = [];
    }
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flushList(); flushTable(); continue; }
    if (line.startsWith("|")) { flushList(); tableBuf.push(line); continue; }
    flushTable();
    if (line.startsWith("## ")) { flushList(); blocks.push(<h2 key={blocks.length}>{line.slice(3)}</h2>); }
    else if (line.startsWith("- ")) { listBuf.push(bold(line.slice(2))); }
    else { flushList(); blocks.push(<p key={blocks.length} dangerouslySetInnerHTML={{ __html: bold(line) }} />); }
  }
  flushList();
  flushTable();
  return blocks;
}

function TopBar({ title, sub, onExit }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
      <span style={{ fontSize: 13, color: "#7A6F60" }}>{title}{sub ? " · " + sub : ""}</span>
      <button onClick={onExit} style={{ background: "none", border: "none", color: "#7A6F60", fontSize: 13, cursor: "pointer" }}>← Thoát ra</button>
    </div>
  );
}

function TopicSummary({ topic, accent, onExit, onGoQuiz }) {
  return (
    <div className="lt-page" style={{ minHeight: 420, padding: "32px 28px 40px", borderRadius: 4 }}>
      <div className="lt-margin" />
      <div style={{ maxWidth: 640, margin: "0 auto", position: "relative" }}>
        <TopBar title={topic.title} sub="Tóm tắt kiến thức" onExit={onExit} />
        <div style={{ background: "#fff", border: "1px solid #E4DCC8", borderLeft: `4px solid ${accent}`, borderRadius: 3, padding: "24px 28px", marginBottom: 20 }} className="lt-summary">
          {renderSummary(topic.summary)}
        </div>
        <button onClick={onGoQuiz} style={{ padding: "11px 24px", borderRadius: 3, border: `1.5px solid ${inkColor}`, background: inkColor, color: "#FBF8F2", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
          Làm trắc nghiệm ({topic.quiz.length} câu) →
        </button>
      </div>
    </div>
  );
}

function Quiz({ topic, accent, onExit }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  const total = topic.quiz.length;
  const q = topic.quiz[current];

  useEffect(() => {
    if (!finished) return;
    try {
      const prev = readBest(topic.id);
      if (prev === null || score > prev) window.localStorage.setItem("sd7-quiz-best-" + topic.id, String(score));
    } catch (e) {}
  }, [finished]);

  function pick(idx) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.correct) setScore((s) => s + 1);
  }
  function next() {
    if (current + 1 < total) { setCurrent((c) => c + 1); setSelected(null); setAnswered(false); }
    else setFinished(true);
  }

  if (finished) {
    return (
      <div className="lt-page" style={{ minHeight: 280, padding: "40px 28px", borderRadius: 4, textAlign: "center" }}>
        <div className="lt-margin" />
        <h2 className="lt-serif" style={{ fontSize: 26, marginBottom: 10 }}>Kết quả: {score}/{total}</h2>
        <p style={{ color: "#7A6F60", marginBottom: 24 }}>{topic.title}</p>
        <button onClick={onExit} style={{ padding: "10px 22px", borderRadius: 3, border: `1.5px solid ${accent}`, background: accent, color: "#fff", fontWeight: 600, cursor: "pointer" }}>Quay lại</button>
      </div>
    );
  }

  return (
    <div className="lt-page" style={{ minHeight: 360, padding: "32px 28px 40px", borderRadius: 4 }}>
      <div className="lt-margin" />
      <div style={{ maxWidth: 580, margin: "0 auto", position: "relative" }}>
        <TopBar title={topic.title} sub={`Trắc nghiệm · Câu ${current + 1}/${total}`} onExit={onExit} />
        <div className="lt-serif" style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.5, marginBottom: 20 }}>{q.prompt}</div>
        <div className="flex flex-col gap-3">
          {q.options.map((opt, idx) => {
            let bg = "#fff", border = "#D9CFC0", color = inkColor;
            if (answered) {
              if (idx === q.correct) { bg = "#EAF4EC"; border = correctGreen; color = correctGreen; }
              else if (idx === selected) { bg = "#FBEAE8"; border = marginRed; color = marginRed; }
            }
            return (
              <button key={idx} onClick={() => pick(idx)} style={{ textAlign: "left", padding: "12px 16px", borderRadius: 3, border: `1.5px solid ${border}`, background: bg, color, cursor: answered ? "default" : "pointer", fontSize: 15 }}>
                <b style={{ marginRight: 8 }}>{"ABCD"[idx]}.</b>{opt}
              </button>
            );
          })}
        </div>
        {answered && (
          <div style={{ marginTop: 16, padding: "12px 14px", background: "#FBF8F2", borderLeft: `3px solid ${accent}`, fontSize: 14, color: "#4A4238", lineHeight: 1.6 }}>
            {q.explain}
          </div>
        )}
        {answered && (
          <button onClick={next} style={{ marginTop: 18, padding: "10px 22px", borderRadius: 3, border: `1.5px solid ${accent}`, background: accent, color: "#fff", fontWeight: 600, cursor: "pointer" }}>
            {current + 1 < total ? "Câu tiếp →" : "Xem kết quả"}
          </button>
        )}
      </div>
    </div>
  );
}

function AdvancedPractice({ topic, accent, onExit }) {
  const [unlocked, setUnlocked] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState("");
  const [revealed, setRevealed] = useState({});
  const [drafts, setDrafts] = useState({});
  const [results, setResults] = useState({});

  const items = topic.advanced;
  const storageKey = `sd7-results-${topic.id}`;

  useEffect(() => {
    let saved = {};
    try { const raw = window.localStorage.getItem(storageKey); if (raw) saved = JSON.parse(raw); } catch (err) { saved = {}; }
    setResults(saved);
    const d = {};
    Object.keys(saved).forEach((i) => { d[i] = saved[i].given; });
    setDrafts(d);
    setRevealed({});
  }, [storageKey]);

  function tryUnlock(e) {
    e.preventDefault();
    if (pwInput === SOLUTION_PASSWORD) { setUnlocked(true); setPwError(""); }
    else setPwError("Mật khẩu không đúng, thử lại nhé.");
  }
  function submitAnswer(idx) {
    const given = drafts[idx] || "";
    const correct = checkAnswer(given, items[idx].answer);
    const next = { ...results, [idx]: { given, correct } };
    setResults(next);
    try { window.localStorage.setItem(storageKey, JSON.stringify(next)); } catch (err) {}
  }

  const answeredCount = Object.values(results).filter((r) => r && r.correct !== null).length;
  const correctCount = Object.values(results).filter((r) => r && r.correct === true).length;

  return (
    <div className="lt-page" style={{ minHeight: 420, padding: "32px 24px 40px", borderRadius: 4 }}>
      <div className="lt-margin" />
      <div style={{ maxWidth: 580, margin: "0 auto", position: "relative" }}>
        <TopBar title={topic.title} sub="★ Bài tập nâng cao" onExit={onExit} />
        <p style={{ fontSize: 13, color: "#9C9080", marginBottom: 18 }}>
          Đã làm {answeredCount}/{items.length} câu — đúng {correctCount} câu. Kết quả tự động lưu lại trên máy này.
        </p>
        {!unlocked && (
          <form onSubmit={tryUnlock} style={{ background: "#fff", border: "1px solid #D9CFC0", borderRadius: 3, padding: "16px 18px", marginBottom: 22 }}>
            <p style={{ fontSize: 14, color: "#4A4238", marginBottom: 10 }}>Con tự làm và kiểm tra đáp số ngay bên dưới. Nhập mật khẩu để mở khóa xem lời giải.</p>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="password" value={pwInput} onChange={(e) => { setPwInput(e.target.value); setPwError(""); }} placeholder="Mật khẩu" style={{ flex: 1, padding: "8px 12px", border: `1.5px solid ${pwError ? marginRed : "#D9CFC0"}`, borderRadius: 3, fontSize: 14 }} />
              <button type="submit" style={{ padding: "8px 16px", borderRadius: 3, border: `1.5px solid ${inkColor}`, background: inkColor, color: "#FBF8F2", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Mở khóa</button>
            </div>
            {pwError && <p style={{ color: marginRed, fontSize: 12, marginTop: 6 }}>{pwError}</p>}
          </form>
        )}
        <div className="flex flex-col gap-3">
          {items.map((ex, idx) => {
            const status = results[idx] ? results[idx].correct : null;
            const boxColor = status === true ? correctGreen : status === false ? marginRed : "#D9CFC0";
            const boxBg = status === true ? "#EAF4EC" : status === false ? "#FBEAE8" : "#fff";
            return (
              <div key={idx} style={{ background: "#fff", border: "1px solid #D9CFC0", borderLeft: "3px solid #8B5CF6", borderRadius: 2, padding: "16px 18px" }}>
                <div style={{ fontSize: 13, color: "#9C9080", marginBottom: 6 }}>Bài {idx + 1}</div>
                <div className="lt-serif" style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.5, marginBottom: 10 }}>{ex.prompt}</div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, color: "#9C9080", display: "block", marginBottom: 4 }}>Đáp án của con</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input type="text" value={drafts[idx] ?? ""} onChange={(e) => setDrafts((d) => ({ ...d, [idx]: e.target.value }))} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submitAnswer(idx); } }} placeholder="Nhập đáp án rồi bấm Kiểm tra..." style={{ flex: 1, padding: "10px 12px", border: `1.5px solid ${boxColor}`, background: boxBg, borderRadius: 3, fontSize: 14, color: inkColor, boxSizing: "border-box" }} />
                    <button onClick={() => submitAnswer(idx)} style={{ padding: "8px 16px", borderRadius: 3, border: `1.5px solid ${inkColor}`, background: inkColor, color: "#FBF8F2", fontWeight: 600, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>Kiểm tra</button>
                  </div>
                  {status === true && <p style={{ color: correctGreen, fontSize: 12, marginTop: 6, fontWeight: 600 }}>✓ Chính xác!</p>}
                  {status === false && <p style={{ color: marginRed, fontSize: 12, marginTop: 6, fontWeight: 600 }}>✕ Chưa đúng — thử lại hoặc xem lời giải bên dưới.</p>}
                </div>
                {unlocked ? (
                  <>
                    <button onClick={() => setRevealed((r) => ({ ...r, [idx]: !r[idx] }))} style={{ background: "none", border: "none", color: "#8B5CF6", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0 }}>
                      {revealed[idx] ? "Ẩn lời giải ▲" : "Xem lời giải ▼"}
                    </button>
                    {revealed[idx] && (
                      <div style={{ marginTop: 10, padding: "12px 14px", background: "#FBF8F2", borderLeft: "3px solid #8B5CF6", fontSize: 14, color: "#4A4238", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                        {ex.solution}
                      </div>
                    )}
                  </>
                ) : (
                  <span style={{ fontSize: 12, color: "#B5A98F" }}>Nhập mật khẩu ở trên để xem lời giải</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TopicList({ topics, accent, onPickSummary, onPickQuiz, onPickAdvanced }) {
  return (
    <div className="flex flex-col gap-3" style={{ maxWidth: 600, margin: "0 auto" }}>
      {topics.map((t, i) => {
        const best = readBest(t.id);
        return (
          <div key={t.id} style={{ background: "#fff", border: "1px solid #D9CFC0", borderLeft: `4px solid ${accent}`, borderRadius: 2, padding: "18px 22px" }}>
            <span style={{ fontSize: 12, color: "#9C9080" }}>Chuyên đề {i + 1}{best !== null ? ` · Điểm cao nhất: ${best}/${t.quiz.length}` : ""}</span>
            <div className="lt-serif" style={{ fontSize: 18, fontWeight: 600, color: inkColor, marginTop: 2, marginBottom: 12 }}>{t.title}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={() => onPickSummary(t)} className="lt-tab" style={{ padding: "7px 14px", borderRadius: 3, border: `1.5px solid ${accent}`, background: "transparent", color: accent, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>📖 Tóm tắt kiến thức</button>
              <button onClick={() => onPickQuiz(t)} className="lt-tab" style={{ padding: "7px 14px", borderRadius: 3, border: `1.5px solid ${inkColor}`, background: inkColor, color: "#FBF8F2", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Trắc nghiệm ({t.quiz.length})</button>
              <button onClick={() => onPickAdvanced(t)} className="lt-tab" style={{ padding: "7px 14px", borderRadius: 3, border: "1.5px solid #8B5CF6", background: "transparent", color: "#8B5CF6", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>★ Nâng cao ({t.advanced.length})</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const [category, setCategory] = useState("lich-su");
  const [view, setView] = useState(null);

  const cat = CATEGORIES.find((c) => c.id === category);
  const topics = CHUYEN_DE.filter((t) => t.category === category);
  const totalQuiz = CHUYEN_DE.reduce((s, t) => s + t.quiz.length, 0);
  const totalAdv = CHUYEN_DE.reduce((s, t) => s + t.advanced.length, 0);
  const exit = () => setView(null);

  return (
    <div className="lt-root" style={{ minHeight: "100%", padding: "28px 16px", background: "#F3EEE3" }}>
      {font}
      <div style={{ maxWidth: 660, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 className="lt-serif" style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>Lịch sử & Địa lí 7</h1>
          <p style={{ fontSize: 14, color: "#7A6F60", marginTop: 6 }}>
            Kết nối tri thức với cuộc sống · {CHUYEN_DE.length} chuyên đề · {totalQuiz} câu trắc nghiệm · {totalAdv} bài nâng cao
          </p>
        </div>

        {!view && (
          <>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
              {CATEGORIES.map((c) => (
                <button key={c.id} onClick={() => setCategory(c.id)} className="lt-tab" style={{ padding: "9px 18px", borderRadius: 4, border: `2px solid ${c.color}`, background: category === c.id ? c.color : "transparent", color: category === c.id ? "#fff" : c.color, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                  {c.icon} {c.label} ({CHUYEN_DE.filter((t) => t.category === c.id).length})
                </button>
              ))}
            </div>
            <TopicList topics={topics} accent={cat.color} onPickSummary={(t) => setView({ topic: t, mode: "summary" })} onPickQuiz={(t) => setView({ topic: t, mode: "quiz" })} onPickAdvanced={(t) => setView({ topic: t, mode: "advanced" })} />
          </>
        )}

        {view && view.mode === "summary" && <TopicSummary topic={view.topic} accent={cat.color} onExit={exit} onGoQuiz={() => setView({ topic: view.topic, mode: "quiz" })} />}
        {view && view.mode === "quiz" && <Quiz topic={view.topic} accent={cat.color} onExit={exit} />}
        {view && view.mode === "advanced" && <AdvancedPractice topic={view.topic} accent={cat.color} onExit={exit} />}
      </div>
    </div>
  );
}
