import TrademarkChecker from '@/components/trademarks/trademark-checker';

export default function TrademarksPage() {
  return (
    <section>
        <div className="flex flex-col items-start gap-2">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] font-headline">
            Trademark Check
            </h1>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            Check for potential trademark conflicts.
            </p>
        </div>
        <div className="mt-8">
            <TrademarkChecker />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Disclaimer: Not legal advice. Search is limited to the selected jurisdiction.
        </p>
    </section>
  );
}
