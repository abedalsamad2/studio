"use client";

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Link2, DollarSign, Sparkles, Copyright } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import AvailabilityChecker from '@/components/availability/availability-checker';
import KeywordAnalyzer from '@/components/keywords/keyword-analyzer';
import TrademarkChecker from '@/components/trademarks/trademark-checker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const searchSchema = z.object({
  domain: z.string().min(1, "Please enter a domain or keyword"),
});

export default function HomePage() {
    const [submittedTerm, setSubmittedTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const form = useForm<z.infer<typeof searchSchema>>({
        resolver: zodResolver(searchSchema),
        defaultValues: {
          domain: '',
        },
        mode: 'onChange',
    });

    const domainValue = form.watch('domain');

    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        const isDomainValid = searchSchema.shape.domain.safeParse(domainValue).success;

        if (domainValue && isDomainValid) {
            setLoading(true);
            debounceTimeout.current = setTimeout(() => {
                setSubmittedTerm(domainValue);
                setLoading(false);
            }, 800); // 800ms debounce delay
        } else {
            setSubmittedTerm(''); // Clear results if input is invalid or empty
            setLoading(false);
        }

        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [domainValue]);


    return (
        <section className="space-y-8">
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] font-headline">
                Unified Domain & Keyword Insights
                </h1>
                <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
                Enter a domain or keyword to get instant analysis across availability, SEO, and trademarks.
                </p>
            </div>

            <Card className="max-w-3xl mx-auto">
                <CardContent className="pt-6">
                <Form {...form}>
                    <form onSubmit={(e) => e.preventDefault()} className="flex items-start gap-4">
                    <FormField
                        control={form.control}
                        name="domain"
                        render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel className="sr-only">Domain or Keyword</FormLabel>
                            <FormControl>
                            <div className="relative">
                                <Input placeholder="example.com or 'ai tools'" {...field} className="text-lg py-6" />
                                {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />}
                            </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </form>
                </Form>
                </CardContent>
            </Card>
            
            <AnimatePresence>
                {submittedTerm && (
                    <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-6">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="keywords">Keywords</TabsTrigger>
                        <TabsTrigger value="trademarks">Trademarks</TabsTrigger>
                        <TabsTrigger value="backlinks">Backlinks</TabsTrigger>
                        <TabsTrigger value="valuation">Valuation</TabsTrigger>
                        <TabsTrigger value="generator">Generator</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview">
                        <div className="grid gap-8">
                            <AvailabilityChecker domain={submittedTerm} showInput={false} />
                        </div>
                    </TabsContent>

                    <TabsContent value="keywords">
                        <KeywordAnalyzer keyword={submittedTerm.split('.')[0]} showInput={false} />
                    </TabsContent>
                    
                    <TabsContent value="trademarks">
                        <TrademarkChecker mark={submittedTerm.split('.')[0]} showInput={false} />
                    </TabsContent>

                    <TabsContent value="backlinks">
                        <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Link2 className="h-6 w-6 text-primary" />
                                Backlink Viewer
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                We're working hard to bring you a powerful backlink analysis tool. Stay tuned!
                            </p>
                        </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="valuation">
                        <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-6 w-6 text-primary" />
                                Valuation Estimator
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Our domain valuation estimator is under development. Check back soon for updates!
                            </p>
                        </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="generator">
                        <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-6 w-6 text-primary" />
                            Domain Generator
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Our AI-powered domain name generator is being built. Get ready for creative ideas!
                            </p>
                        </CardContent>
                        </Card>
                    </TabsContent>

                    </Tabs>
                </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
