import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-heading text-2xl font-semibold text-foreground">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        주소가 바뀌었거나 잘못된 링크일 수 있습니다.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
