import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function GeneratorPage() {
  return (
    <section>
        <div className="flex flex-col items-start gap-2">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] font-headline">
            Domain Generator
            </h1>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            Generate creative domain name ideas.
            </p>
        </div>
        <Card className="mt-8">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Coming Soon
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">
            Our AI-powered domain name generator is being built. Get ready for creative ideas!
            </p>
        </CardContent>
        </Card>
    </section>
  );
}
