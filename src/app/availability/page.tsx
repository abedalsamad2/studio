import AvailabilityChecker from '@/components/availability/availability-checker';

export default function AvailabilityPage() {
  return (
    <section>
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] font-headline">
          Domain Availability
        </h1>
        <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
          Check if your desired domain name is available for registration.
        </p>
      </div>
      <div className="mt-8">
        <AvailabilityChecker />
      </div>
    </section>
  );
}
