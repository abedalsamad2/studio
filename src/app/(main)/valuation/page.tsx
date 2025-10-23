import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export default function ValuationPage() {
  return (
    <section>
        <div className="flex flex-col items-start gap-2">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] font-headline">
            Valuation Estimator
            </h1>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            Get an estimated valuation for your domain.
            </p>
        </div>
        <Card className="mt-8">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            Coming Soon
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">
            Our domain valuation estimator is under development. Check back soon for updates!
            </p>
        </CardContent>
        </Card>
    </section>
  );
}
