import type { Post } from "@/lib/types/post";

const baseDate = "2025-03-15T14:00:00.000Z";

export const MOCK_POSTS: Post[] = [
  {
    id: "mock-1",
    title: "봄맞이 정원 활동",
    slug: "spring-garden-day",
    summary: "아이들과 함께 작은 화분을 꾸미며 봄을 맞았습니다.",
    category: "일상",
    tags: ["활동", "봄"],
    status: "published",
    thumbnail_url:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=800&q=80",
    ],
    content: `## 오늘의 둥지

모두가 손을 더렵히며 **씨앗**과 흙을 만졌습니다.

- 화분 꾸미기
- 물주기 루틴 정하기

> 작은 식물이 자라듯, 아이들의 하루도 천천히 자라납니다.

![활동](https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=800&q=80)
`,
    published_at: "2025-04-02T10:00:00.000Z",
    created_at: baseDate,
    updated_at: baseDate,
  },
  {
    id: "mock-2",
    title: "지역 교회와 함께한 여름 행사",
    slug: "summer-event-with-church",
    summary: "음악과 간식, 그리고 안전 교육 부스가 마련되었습니다.",
    category: "행사",
    tags: ["행사", "협력"],
    status: "published",
    thumbnail_url:
      "https://images.unsplash.com/photo-1511632761676-022748dd248f?w=800&q=80",
    images: null,
    content: `행사 당일 많은 가족이 찾아와 주셨습니다.

### 프로그램

1. 안전한 귀가 약속 체크
2. 간식 나눔
3. 음악 공연

후원으로 준비한 **물병과 간식 키트**가 큰 도움이 되었습니다.`,
    published_at: "2025-03-20T12:00:00.000Z",
    created_at: baseDate,
    updated_at: baseDate,
  },
  {
    id: "mock-3",
    title: "후원자님께 감사드립니다",
    slug: "thank-you-donors-march",
    summary: "식재료와 학용품 후원이 도착했습니다.",
    category: "후원 소식",
    tags: ["후원", "감사"],
    status: "published",
    thumbnail_url:
      "https://images.unsplash.com/photo-1593113598338-cab288b1cf7c?w=800&q=80",
    images: null,
    content: `보내주신 **밀키트와 학용품** 덕분에 한 달 식단과 미술 시간이 풍성해졌습니다.

함께해 주셔서 감사합니다.`,
    published_at: "2025-03-10T09:00:00.000Z",
    created_at: baseDate,
    updated_at: baseDate,
  },
  {
    id: "mock-4",
    title: "4월 기도 제목",
    slug: "april-prayer-requests",
    summary: "아이들의 학교 적응과 코디네이터의 지혜를 위해.",
    category: "기도 제목",
    tags: ["기도"],
    status: "published",
    thumbnail_url:
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80",
    images: null,
    content: `- 아이들이 학교에서 **안전**하고 존중받으며 지내기를
- 봄철 유행 감기 없이 건강하기를
- 봉사자 한 분 한 분의 가정에 평안하기를`,
    published_at: "2025-04-01T08:00:00.000Z",
    created_at: baseDate,
    updated_at: baseDate,
  },
  {
    id: "mock-5",
    title: "엄마의 한마디 — 달라진 저녁 시간",
    slug: "parent-story-evening",
    summary: "귀가 후 숙제 시간이 덜 힘들어졌다는 이야기.",
    category: "변화 이야기",
    tags: ["가정", "교육"],
    status: "published",
    thumbnail_url:
      "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&q=80",
    images: null,
    content: `"예전엔 TV만 보다 잠들었는데, 지금은 **둥지에서 숙제를 끝내고** 와서 대화가 늘었어요." — 보호자 A씨`,
    published_at: "2025-02-28T16:00:00.000Z",
    created_at: baseDate,
    updated_at: baseDate,
  },
  {
    id: "mock-6",
    title: "비 오는 날 실내 놀이",
    slug: "rainy-day-indoor-play",
    summary: "보드게임과 독서 코너로 오후를 보냈습니다.",
    category: "일상",
    tags: ["놀이"],
    status: "published",
    thumbnail_url:
      "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&q=80",
    images: null,
    content: `창밖엔 빗소리, 안에서는 **조용한 집중**과 웃음이 섞였습니다.`,
    published_at: "2025-02-15T11:00:00.000Z",
    created_at: baseDate,
    updated_at: baseDate,
  },
];
