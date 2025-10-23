import KeywordAnalyzer from '@/components/keywords/keyword-analyzer';

export default function KeywordsPage() {
  return (
    <section>
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] font-headline">
          Keyword Analysis
        </h1>
        <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
          Discover search volume, CPC, and competition for your keywords.
        </p>
      </div>
      <div className="mt-8">
        <KeywordAnalyzer />
      </div>
    </section>
  );
}
