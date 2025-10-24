import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2 } from "lucide-react";

export default function BacklinksPage() {
  return (
    <section>
        <div className="flex flex-col items-start gap-2">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] font-headline">
            Backlink Viewer
            </h1>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            Analyze the backlink profile of any domain.
            </p>
        </div>
        <Card className="mt-8">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
            <Link2 className="h-6 w-6 text-primary" />
            Coming Soon
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">
            We're working hard to bring you a powerful backlink analysis tool. Stay tuned!
            </p>
        </CardContent>
        </Card>
    </section>
  );
}
