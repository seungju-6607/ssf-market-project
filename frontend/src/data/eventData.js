// src/data/eventData.js

export const EVENT_DATA = [
  // ============ 진행 중 이벤트 ============
  {
    id: 301,
    title: "SSF 겨울 출석 체크 이벤트",
    category: "ATTEND", // ATTEND | MISSION | DRAW | COMMENT | COUPON
    channel: "APP/WEB", // APP | WEB | OFFLINE | APP/WEB
    status: "ING", // ING | END
    period: "2025.11.20 ~ 2025.12.20",
    banner: "https://picsum.photos/seed/ev01/1200/500",
    badge: "매일 출석",
    shortDescription:
      "매일매일 출석만 해도 최대 5,000P 적립! 7일/14일/21일 구간별 보너스 포인트까지.",
    rewardSummary: "최대 5,000P + 추가 보너스 포인트",
    howToJoin: [
      "SSF 회원 로그인 후 이벤트 페이지 접속",
      "하루에 한 번 ‘출석하기’ 버튼 클릭",
      "7/14/21일 연속 출석 시 구간별 보너스 포인트 자동 적립"
    ],
    rewards: [
      "1일 출석 : 100P",
      "7일 연속 출석 : 500P",
      "14일 연속 출석 : 1,500P",
      "21일 연속 출석 : 2,900P (총 5,000P)"
    ],
    notices: [
      "출석 포인트는 출석한 다음날 일괄 적립됩니다.",
      "연속 출석은 ‘연속 로그인 기준’이 아닌 ‘출석하기 버튼 클릭 기준’입니다.",
      "기간 내 중복 참여 가능하나, 구간별 보너스는 기간 내 1회만 지급됩니다."
    ],
    tags: ["출석체크", "포인트", "멤버십"]
  },
  {
    id: 302,
    title: "BEAKER 겨울룩 공유하기 이벤트",
    category: "COMMENT",
    channel: "APP/WEB",
    status: "ING",
    period: "2025.11.10 ~ 2025.12.05",
    banner: "https://picsum.photos/seed/ev02/1200/500",
    badge: "포토리뷰",
    shortDescription:
      "나만의 BEAKER 겨울 코디를 인증하면, 추첨을 통해 기프트 카드 증정!",
    rewardSummary: "추첨 50명, BEAKER 기프트 카드 30,000원",
    howToJoin: [
      "BEAKER 카테고리 상품 구매 후 포토리뷰 등록",
      "이벤트 페이지 댓글에 ‘내가 고른 BEAKER 겨울룩’ 해시태그와 함께 후기 작성",
      "추후 당첨자 발표 페이지를 통해 결과 확인"
    ],
    rewards: [
      "추첨 50명 : BEAKER 기프트 카드 30,000원",
      "우수 후기 5명 : 추가 20,000P 적립"
    ],
    notices: [
      "비방, 욕설, 도배성 글은 사전 고지 없이 삭제될 수 있습니다.",
      "타인의 사진 또는 무단 도용 이미지 사용 시 당첨이 취소될 수 있습니다.",
      "기프트 카드는 SSFSHOP 내 BEAKER 상품에만 사용 가능합니다."
    ],
    tags: ["비이커", "포토리뷰", "코디공유"]
  },
  {
    id: 303,
    title: "8SECONDS 겨울 룰렛 이벤트",
    category: "MISSION",
    channel: "APP",
    status: "ING",
    period: "2025.11.22 ~ 2025.12.10",
    banner: "https://picsum.photos/seed/ev03/1200/500",
    badge: "APP 전용",
    shortDescription:
      "하루 한 번 돌리는 행운의 룰렛! 에잇세컨즈 전용 쿠폰 & 포인트를 즉석에서 받으세요.",
    rewardSummary: "최대 20% 쿠폰 + 1,000P",
    howToJoin: [
      "SSF APP 로그인 후 이벤트 배너를 통해 접속",
      "하루 한 번 ‘룰렛 돌리기’ 버튼 클릭",
      "즉시 지급되는 쿠폰/포인트는 마이페이지에서 확인"
    ],
    rewards: [
      "20% 할인 쿠폰 (일부 상품 제외)",
      "10% 할인 쿠폰",
      "배송비 무료 쿠폰",
      "SSF 포인트 500P / 1,000P"
    ],
    notices: [
      "룰렛 참여는 APP에서만 가능하며, ID당 1일 1회 참여할 수 있습니다.",
      "발급된 쿠폰은 마이쿠폰함에서 확인 가능하며, 유효 기간 내에만 사용 가능합니다.",
      "일부 기획전 상품 및 특정 브랜드는 쿠폰 적용이 제한될 수 있습니다."
    ],
    tags: ["에잇세컨즈", "룰렛", "앱이벤트"]
  },
  {
    id: 304,
    title: "LEMAIRE 신상품 런칭 알림 신청 이벤트",
    category: "DRAW",
    channel: "WEB",
    status: "ING",
    period: "2025.11.18 ~ 2025.11.30",
    banner: "https://picsum.photos/seed/ev04/1200/500",
    badge: "사전 알림",
    shortDescription:
      "르메르 FW 신상품 입고 알림 신청하고, 추첨을 통해 적립금을 받아보세요.",
    rewardSummary: "추첨 30명, 20,000P 적립",
    howToJoin: [
      "LEMAIRE 브랜드 페이지 접속",
      "관심 상품에 ‘재입고 알림’ 또는 ‘런칭 알림’ 신청",
      "이벤트 페이지에서 참여 동의 후 응모 완료"
    ],
    rewards: [
      "추첨 30명 : SSF 포인트 20,000P",
      "응모자 전원 : 르메르 전용 5% 할인 쿠폰"
    ],
    notices: [
      "포인트는 당첨자 발표 후 7일 이내 일괄 적립됩니다.",
      "알림 신청을 취소할 경우 이벤트 응모도 자동 취소됩니다.",
      "중복 ID, 부정 참여로 확인될 경우 당첨이 취소될 수 있습니다."
    ],
    tags: ["르메르", "런칭알림", "응모이벤트"]
  },
  {
    id: 401,
    title: "SSF 추석 감사 댓글 이벤트",
    category: "COMMENT",
    channel: "APP/WEB",
    status: "END",
    period: "2025.09.10 ~ 2025.09.22",
    banner: "https://picsum.photos/seed/ev05/1200/500",
    badge: "종료",
    shortDescription:
      "추석 연휴 동안 함께한 SSF와의 추억을 댓글로 남겨주세요. 추첨을 통해 선물을 드립니다.",
    rewardSummary: "종료된 이벤트입니다.",
    howToJoin: [],
    rewards: [],
    notices: [
      "본 이벤트는 종료되었으며, 당첨자에게는 개별 연락을 완료했습니다.",
      "당첨자 안내는 ‘공지사항 > 이벤트 당첨자 발표’ 게시판을 확인해 주세요."
    ],
    tags: ["추석", "댓글이벤트"]
  }
];
