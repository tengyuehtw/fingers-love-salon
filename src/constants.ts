export const MEMBERSHIP_LEVELS = [
  { 
    id: 'bronze', 
    name: '黃銅級', 
    threshold: 0, 
    nextThreshold: 5, 
    color: 'from-[#A1887F] to-[#795548]', 
    icon: 'workspace_premium',
    desc: '初始會員等級。開啟您的專屬美學旅程，累積消費次數解鎖更多權益。',
    discount: 1.0,
    discountDesc: '無折扣'
  },
  { 
    id: 'silver', 
    name: '銀級', 
    threshold: 5, 
    nextThreshold: 11, 
    color: 'from-[#CFD8DC] to-[#90A4AE]', 
    icon: 'stars',
    desc: '消費滿 5 次晉升。享有專屬預約優先權，並獲得入會禮一份。',
    discount: 0.98,
    discountDesc: '98折'
  },
  { 
    id: 'crystal', 
    name: '晶鑽級', 
    threshold: 11, 
    nextThreshold: 21, 
    color: 'from-[#F48FB1] to-[#D81B60]', 
    icon: 'diamond',
    desc: '消費滿 11 次晉升。生日當月享有 9 折優惠，及不定期新品試用。',
    discount: 0.95,
    discountDesc: '95折'
  },
  { 
    id: 'diamond', 
    name: '鑽石級', 
    threshold: 21, 
    nextThreshold: 29, 
    color: 'from-[#CE93D8] via-[#AB47BC] to-[#8E24AA]', 
    icon: 'military_tech',
    desc: '消費滿 21 次晉升。每次消費點數 1.5 倍送，並享有專屬美療師諮詢。',
    discount: 0.90,
    discountDesc: '9折'
  },
  { 
    id: 'gold', 
    name: '黃金級', 
    threshold: 29, 
    nextThreshold: Infinity, 
    color: 'from-[#FFD700] via-[#FBC02D] to-[#F57F17]', 
    icon: 'auto_awesome',
    desc: '最高等級會員。享有全店服務 88 折優惠，每次消費送手部護膚保養。',
    discount: 0.88,
    discountDesc: '88折 + 送手部保養'
  },
];

export const THERAPISTS = [
  { 
    id: 1, 
    name: "安娜 (Anna)", 
    title: "資深美甲美睫師",
    experience: "8年",
    desc: "擅長法式優雅與日系精緻風格，注重細節與溝通，致力於為每位顧客打造專屬的指尖藝術與迷人眼神。",
    skills: ["美甲", "美睫"], 
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZQg0LtXqHSEtumSTUNU6wXsw2oCAnppiBlEMvWUORwdRmLn6QqHuRa4p4A5_mzHcWDgtZE3cDF5SgV8uKZ5ld4_yGZEBtc3cIs-Vn6A4WAk8IQVXw5sN-1g0hl-L4mNd7msBakaO4Y_frB1dJ-x5hL425MgVkL6dXnCqGIhp2PHLerfQkyby13gh8p6eLP844aXgMfvJFbQLtDQ4cBqGz5NbzIgoeQgIgv_flETf8q3btIn6tULOTCxuXIbd8dpwNRLQ9DTKUOvE" 
  },
  { 
    id: 2, 
    name: "克洛伊", 
    title: "專業美睫設計師",
    experience: "5年",
    desc: "專精於山茶花多層次嫁接技術，能根據不同眼型客製化設計，打造自然深邃且輕盈無負擔的完美睫毛。",
    skills: ["美睫"], 
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5CAAOY8sK24agdo62VW88aL7-VWN1MgbhhjjbKZxl2P4JExFVa80A30kPq4-ZmhkmZQFCoCImKYZf7kb2BCaHW8sdY3nV0atO9PSs5MftNiB0cNVX9Kla_-iJ6xb-mHfsrAf5i0y_On3WiBTqEdISdl7OP3HUCw8XiqHAc0E9DkvwA_xNcaT4ZNE1CefwK-XsTOrRrXc06xSCzZHUHAi32uGO84OTYLomaiz7Ghb6ZdtwGtUiF5AOVoh9erJ33J6eb-sjfgfKcSA" 
  },
  { 
    id: 3, 
    name: "米亞", 
    title: "頂級肌膚管理師",
    experience: "10年",
    desc: "擁有豐富的醫美與沙龍護膚經驗，精通各類膚況分析與調理，手法溫柔細膩，讓您的肌膚重拾健康透亮光澤。",
    skills: ["護膚", "除毛"], 
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-DoDeS9ztWplUCOoUrBji1vToctqJ40veeX997NjAqzLYz8nnW4wS8zQLMQIOKkenbVd40suiuTA_1MweexiPa_xEYzVm-63Tjt6Dt7UiN-LWz1K7ZtZhQ5RzQbh_eXUkeb0sK_VD5L1fLHc91IngUmKgn67hW2X8nMOLG1CIU9pTYsPXkYIenEXjgCmdq3O1v4iNGVGDI5Ur37TV4om3B4OulK2dPjxz1iakPxyhFkLyowlBVbZBDjrrhrou44ZrRzZJrzQeuYg" 
  },
  { 
    id: 4, 
    name: "蘇菲亞", 
    title: "全方位美容總監",
    experience: "12年",
    desc: "全能型美容專家，不僅在美甲美睫有深厚造詣，更擅長整體美學評估。致力於提供最高品質的尊榮服務體驗。",
    skills: ["美甲", "美睫", "護膚", "除毛"], 
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB78-TZeDCSU0g1WpfPMvPLTnT3RRUCm-RfpOU4JMZ3PENi_GE_s1a2iTwvZ5ZlWfH2-J-DmvrT88NBZtP8N5Z6f0QLCEkg-4iVBF-p4wJYBD8XhVAiGnqQOEG3zJnHXsyDBfgv3U1N4Rlwg0V9ryj1kIY1cxMJOOhi1xky9RYRe4GB1lN8FXaqcu-C_QsHp6tyQT6cJQPQyu7t0quqVcLyVwKG8VUPnWEhc3lk4RXqNELTgU1OajGGVTEe4UjzAeJZAsE0meDgjVw" 
  }
];

export const SERVICE_DATA = {
  '美甲': {
    featured: {
      title: "經典凝膠美甲",
      price: "$1,200",
      time: "45 分鐘",
      desc: "包含基礎甘皮修整、甲型修磨及單色/跳色凝膠上色，展現指尖光澤。",
      icon: "spa",
      therapists: ["安娜 (Anna)", "蘇菲亞"]
    },
    others: [
      { 
        title: "法式優雅美甲", 
        price: "$1,500", 
        time: "60 分鐘", 
        desc: "經典不敗的法式線條，打造氣質滿分的精緻雙手。",
        therapists: ["安娜 (Anna)", "蘇菲亞"]
      },
      { 
        title: "造型延甲服務", 
        price: "$2,200", 
        time: "120 分鐘", 
        desc: "適合短甲或想要修長手感的顧客，包含單色凝膠。",
        therapists: ["安娜 (Anna)", "蘇菲亞"]
      }
    ],
    extra: {
      title: "手部深層保養",
      price: "$800",
      time: "40 分鐘",
      desc: "包含去角質、按摩及深層滋潤，讓雙手恢復柔嫩觸感。",
      therapists: ["安娜 (Anna)", "蘇菲亞"]
    }
  },
  '美睫': {
    featured: {
      title: "韓式 3D 自然款",
      price: "$1,600",
      time: "90 分鐘",
      desc: "採用輕盈蠶絲蛋白纖維，打造如真睫毛般的自然捲翹感。",
      icon: "visibility",
      therapists: ["安娜 (Anna)", "克洛伊", "蘇菲亞"]
    },
    others: [
      { 
        title: "極致奢華 6D 款", 
        price: "$2,200", 
        time: "120 分鐘", 
        desc: "濃密豐盈效果，適合追求戲劇化眼神的妳。",
        therapists: ["安娜 (Anna)", "克洛伊", "蘇菲亞"]
      },
      { 
        title: "山茶花層次款", 
        price: "$2,500", 
        time: "150 分鐘", 
        desc: "多層次嫁接技術，展現優雅迷人的深邃電眼。",
        therapists: ["安娜 (Anna)", "克洛伊", "蘇菲亞"]
      }
    ],
    extra: {
      title: "睫毛 SPA 清潔",
      price: "$300",
      time: "15 分鐘",
      desc: "深層清潔睫毛根部油脂與殘妝，延長嫁接持久度。",
      therapists: ["安娜 (Anna)", "克洛伊", "蘇菲亞"]
    }
  },
  '護膚': {
    featured: {
      title: "深層水感保濕護理",
      price: "$2,800",
      time: "90 分鐘",
      desc: "針對乾燥缺水肌膚進行深層導入與補水，重現透亮水光肌。",
      icon: "face",
      therapists: ["米亞", "蘇菲亞"]
    },
    others: [
      { 
        title: "亮采煥膚美白", 
        price: "$3,200", 
        time: "100 分鐘", 
        desc: "改善暗沉不均，提升肌膚明亮度與細緻度。",
        therapists: ["米亞", "蘇菲亞"]
      },
      { 
        title: "緊緻拉提抗老", 
        price: "$3,800", 
        time: "120 分鐘", 
        desc: "結合專業按摩手法與精華，重塑緊緻輪廓線。",
        therapists: ["米亞", "蘇菲亞"]
      }
    ],
    extra: {
      title: "眼部舒壓護理",
      price: "$1,200",
      time: "30 分鐘",
      desc: "緩解眼部疲勞，淡化細紋與黑眼圈。",
      therapists: ["米亞", "蘇菲亞"]
    }
  },
  '除毛': {
    featured: {
      title: "腋下雷射除毛",
      price: "$1,500",
      time: "30 分鐘",
      desc: "專業溫和技術，有效減少毛髮生長，肌膚平滑無暇。",
      icon: "content_cut",
      therapists: ["米亞", "蘇菲亞"]
    },
    others: [
      { 
        title: "小腿美肌除毛", 
        price: "$2,500", 
        time: "60 分鐘", 
        desc: "大面積除毛，讓雙腿在夏天也能自信展現。",
        therapists: ["米亞", "蘇菲亞"]
      },
      { 
        title: "私密處全除", 
        price: "$3,000", 
        time: "90 分鐘", 
        desc: "專業隱私護理，清爽舒適，減少異味與不適感。",
        therapists: ["米亞", "蘇菲亞"]
      }
    ],
    extra: {
      title: "除毛後鎮定修護",
      price: "$500",
      time: "20 分鐘",
      desc: "使用蘆薈鎮定凝膠與冰敷，緩解除毛後的紅腫不適。",
      therapists: ["米亞", "蘇菲亞"]
    }
  }
};

export const INITIAL_WORKS = [
  { 
    id: 1, 
    title: "玫瑰石紋", 
    category: "法式美甲", 
    therapist: "安娜 (Anna)",
    aspect: "aspect-[3/4]", 
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8l828jRjj35YFUWMMGlT9XAeGpaYKNWa9WbW9LnE4Fb8ZGbXxYU_cU9Ek-lexJiGpGRujvdB0blwRg3lN2pRpDcrZxFcfhsFgMrtJgRxLZkDh9XT-sgHutaExCc6-NmL0Lo3JkxwfQNwvrwTk_ehzF9tBbsTz8xQEtPQmihKw7Tg0uBfXw_nBt7fkai7_VvTOZ2IJDwqwmN02hoG7EWnWE1oF4LlNgaZmQJPRtt3SAMbEsLEXB5izeQqUmIe8Ehabh28GZRw4gOk", 
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD8l828jRjj35YFUWMMGlT9XAeGpaYKNWa9WbW9LnE4Fb8ZGbXxYU_cU9Ek-lexJiGpGRujvdB0blwRg3lN2pRpDcrZxFcfhsFgMrtJgRxLZkDh9XT-sgHutaExCc6-NmL0Lo3JkxwfQNwvrwTk_ehzF9tBbsTz8xQEtPQmihKw7Tg0uBfXw_nBt7fkai7_VvTOZ2IJDwqwmN02hoG7EWnWE1oF4LlNgaZmQJPRtt3SAMbEsLEXB5izeQqUmIe8Ehabh28GZRw4gOk",
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=800"
    ],
    liked: false, 
    desc: "細膩的粉色大理石紋理，展現溫柔優雅的氣質。適合各種場合，是本季最受歡迎的款式之一。" 
  },
  { 
    id: 2, 
    title: "水光肌護理", 
    category: "肌膚管理", 
    therapist: "米亞",
    aspect: "aspect-[3/5]", 
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBrljK2Ec28hlVXa7OJ6I3jLOJ6JBTs9XpJjfosDkWwesp98uBMfBl3N0nzW7xvkbQ6Lb2NJkXGGExAQjAO4wlbvV914sBqsWyvCeQ6dFcl-S3NyCPutzFXg4sajUTdfRylb0tKGKBxTeUigL4gwNQWigIDzUl8BHta0Oke09v3wKSQ366-8kTpmc2pGV1OU5TdU0ScvYuyP1ReWOX23u9-weA9qojlIW_XlUgTrb-2GELwctlHR8mUDwXSBJzaeeXtHe19uIUxGNM", 
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBrljK2Ec28hlVXa7OJ6I3jLOJ6JBTs9XpJjfosDkWwesp98uBMfBl3N0nzW7xvkbQ6Lb2NJkXGGExAQjAO4wlbvV914sBqsWyvCeQ6dFcl-S3NyCPutzFXg4sajUTdfRylb0tKGKBxTeUigL4gwNQWigIDzUl8BHta0Oke09v3wKSQ366-8kTpmc2pGV1OU5TdU0ScvYuyP1ReWOX23u9-weA9qojlIW_XlUgTrb-2GELwctlHR8mUDwXSBJzaeeXtHe19uIUxGNM",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800"
    ],
    liked: false, 
    desc: "深層補水，打造透亮水光肌感。結合專業技術與頂級保養品，讓肌膚煥發自然光澤。" 
  },
  { 
    id: 3, 
    title: "深邃大眼款", 
    category: "山茶花美睫", 
    therapist: "克洛伊",
    aspect: "aspect-[4/5]", 
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXnD0H4Br0r-GNzOmuync0xGF3wxAwfhGc5e_Js74l9VoJ4K5W17YGIR9D0f5MQDSI3iVakCX52_KiGxXIxOYXRCYkEGW6UTtZryKeWIAiBgGetaco1rvlCRT8nSEROjs4QR01MexPN5rCADZI2hfwrSohAd-n7PpZolhUtoKe2D8gPDdgYhPhdVr_1ecuFEs0YZettf-KN-Yma21mMUJ3HUQUiKNDIPPQZL4aMg4kGadz0RRb0FzACDgnmh5WGUdeoeQ1EpOaWXM", 
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCXnD0H4Br0r-GNzOmuync0xGF3wxAwfhGc5e_Js74l9VoJ4K5W17YGIR9D0f5MQDSI3iVakCX52_KiGxXIxOYXRCYkEGW6UTtZryKeWIAiBgGetaco1rvlCRT8nSEROjs4QR01MexPN5rCADZI2hfwrSohAd-n7PpZolhUtoKe2D8gPDdgYhPhdVr_1ecuFEs0YZettf-KN-Yma21mMUJ3HUQUiKNDIPPQZL4aMg4kGadz0RRb0FzACDgnmh5WGUdeoeQ1EpOaWXM",
      "https://images.unsplash.com/photo-1583243543214-6a562f1f31f9?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=800"
    ],
    liked: false, 
    desc: "山茶花多層次嫁接，打造自然深邃眼神。輕盈無負擔，讓您的雙眼更有神采。" 
  },
  { 
    id: 4, 
    title: "金箔抽象設計", 
    category: "藝術美甲", 
    therapist: "蘇菲亞",
    aspect: "aspect-[4/3]", 
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgqI4jXe0pYZMn66rKhTqzjgsb6sXiZvff83VB5rjeAsE4103XJdxuKCZoRQyuABPohmN66uLF-KKt0FK7vvieoTREfbEYqm81T_Dftncvql3ddYJDMZJkHrdUJGewR0GYXEW9BTD-nOYX59TfduAAtqdhCghX8Y_5nCJ_5nusGzxiu19VUUJPnGd7-fiap33WAqRKzSn6T_w_cF7CCfbGobiFJdmMufAIXXpgCP2kTGPkHdYQG4VMQYueLZtVw_TfNgS57eTHYQU", 
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCgqI4jXe0pYZMn66rKhTqzjgsb6sXiZvff83VB5rjeAsE4103XJdxuKCZoRQyuABPohmN66uLF-KKt0FK7vvieoTREfbEYqm81T_Dftncvql3ddYJDMZJkHrdUJGewR0GYXEW9BTD-nOYX59TfduAAtqdhCghX8Y_5nCJ_5nusGzxiu19VUUJPnGd7-fiap33WAqRKzSn6T_w_cF7CCfbGobiFJdmMufAIXXpgCP2kTGPkHdYQG4VMQYueLZtVw_TfNgS57eTHYQU",
      "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&q=80&w=800"
    ],
    liked: false, 
    desc: "金箔點綴抽象線條，充滿藝術感的獨特設計。展現您的個人風格與獨特品味。" 
  },
  { 
    id: 5, 
    title: "極簡法式", 
    category: "法式美甲", 
    therapist: "安娜 (Anna)",
    aspect: "aspect-square", 
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1kVgfTUhjBYXFrMyFDpGNdf_d5Iq1KSbJyDIRbvmMV2yJXiTV2d2fBPJSHDydma8SFuhpmnmyeHSq0OyQhY09C_qaiAXdagPI6yLofEKL2CJdXZylmehisyhC0NVDkqiZr7YAsg4ssPv9y22r8Fqz5iC8o9i8nyWjcHj2B8bbo-k01o62mGJjVOLToQTn3dzlibucG8zw2SEEezFUaSl_BhUzXeMcHXjeDMdH_xOdBGfmE_i00avUUJkdvXltDVMQtqok09WFLNc", 
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA1kVgfTUhjBYXFrMyFDpGNdf_d5Iq1KSbJyDIRbvmMV2yJXiTV2d2fBPJSHDydma8SFuhpmnmyeHSq0OyQhY09C_qaiAXdagPI6yLofEKL2CJdXZylmehisyhC0NVDkqiZr7YAsg4ssPv9y22r8Fqz5iC8o9i8nyWjcHj2B8bbo-k01o62mGJjVOLToQTn3dzlibucG8zw2SEEezFUaSl_BhUzXeMcHXjeDMdH_xOdBGfmE_i00avUUJkdvXltDVMQtqok09WFLNc",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516715667182-c8e195527765?auto=format&fit=crop&q=80&w=800"
    ],
    liked: false, 
    desc: "最經典的法式美甲，簡約而不失格調。無論是日常穿搭還是正式場合都非常合適。" 
  },
  { 
    id: 6, 
    title: "自然空氣感", 
    category: "山茶花美睫", 
    therapist: "蘇菲亞",
    aspect: "aspect-square", 
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkNM884xRuRoTblaNU9-H2XMHuJefkocyP7dxqfUqLeymdCMYSPIJce5Y0eIgJaPdflt50r1wmUNeey1JgAc_Lh-b6oCGwME-M7p8XEdGHJBR0ngTEJr1BH2AbAGPCSSfJk8LfasRJB-7pXKEr7BRb7zrtVVG4pJE6L029z9khq0fMtAjQdbAoVzm7R98JUB1qLxPY3CRWFYGIzUX0KhovG8TYvEs29hNwoa4HNwJ3f69V3MlhIzQfGidnJWgqK4LZ9FKNsw7KHfY", 
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBkNM884xRuRoTblaNU9-H2XMHuJefkocyP7dxqfUqLeymdCMYSPIJce5Y0eIgJaPdflt50r1wmUNeey1JgAc_Lh-b6oCGwME-M7p8XEdGHJBR0ngTEJr1BH2AbAGPCSSfJk8LfasRJB-7pXKEr7BRb7zrtVVG4pJE6L029z9khq0fMtAjQdbAoVzm7R98JUB1qLxPY3CRWFYGIzUX0KhovG8TYvEs29hNwoa4HNwJ3f69V3MlhIzQfGidnJWgqK4LZ9FKNsw7KHfY",
      "https://images.unsplash.com/photo-1589703900794-9878a963db34?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1512496011981-d2b0c5a5cebb?auto=format&fit=crop&q=80&w=800"
    ],
    liked: false, 
    desc: "輕盈無負擔的嫁接技術，宛如天生長睫毛。讓您隨時隨地都能保持完美妝容。" 
  }
];
