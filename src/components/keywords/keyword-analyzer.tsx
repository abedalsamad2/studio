"use client";

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle, Wand2, BrainCircuit } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { KeywordData } from '@/lib/types';
import { locales } from '@/lib/locales';
import { keywordInsightsWithLLM } from '@/ai/flows/keyword-insights-with-llm';
import { useToast } from '@/hooks/use-toast';

const keywordSchema = z.object({
  keyword: z.string().min(2, "Keyword must be at least 2 characters"),
  locale: z.string(),
  useGoogleAds: z.boolean(),
});

const mockTrendsData: KeywordData[] = [
  { term: 'ai domain generator', searchVolume: 80, cpc: 1.5, competition: 0.8, source: 'Google Trends' },
  { term: 'best domain name', searchVolume: 75, cpc: 2.1, competition: 0.9, source: 'Google Trends' },
  { term: 'creative domain ideas', searchVolume: 60, cpc: 1.2, competition: 0.7, source: 'Google Trends' },
  { term: 'short domain names', searchVolume: 90, cpc: 3.5, competition: 0.95, source: 'Google Trends' },
];

const mockAdsData: KeywordData[] = [
    { term: 'ai domain generator', searchVolume: 12000, cpc: 1.75, competition: 0.82, source: 'Google Ads' },
    { term: 'best domain name', searchVolume: 8500, cpc: 2.30, competition: 0.91, source: 'Google Ads' },
    { term: 'creative domain ideas', searchVolume: 5000, cpc: 1.40, competition: 0.75, source: 'Google Ads' },
    { term: 'short domain names', searchVolume: 25000, cpc: 3.80, competition: 0.96, source: 'Google Ads' },
];

export default function KeywordAnalyzer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<KeywordData[] | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof keywordSchema>>({
    resolver: zodResolver(keywordSchema),
    defaultValues: {
      keyword: '',
      locale: 'en-US',
      useGoogleAds: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof keywordSchema>) => {
    setLoading(true);
    setError(null);
    setResults(null);
    setAiInsight(null);

    await new Promise(resolve => setTimeout(resolve, 1500));

    if (data.keyword.includes('error')) {
      setError('Failed to fetch keyword data. Please try again.');
    } else {
      setResults(data.useGoogleAds ? mockAdsData : mockTrendsData);
    }
    setLoading(false);
  };
  
  const handleGetInsights = (keywordData: KeywordData) => {
    setAiInsight(null);
    startTransition(async () => {
      try {
        const insightResult = await keywordInsightsWithLLM({
          keyword: keywordData.term,
          locale: form.getValues('locale'),
          searchVolume: keywordData.searchVolume,
          cpc: keywordData.cpc,
          competition: keywordData.competition,
          source: keywordData.source,
        });
        setAiInsight(insightResult.insights);
      } catch (e) {
        toast({
            variant: "destructive",
            title: "Error generating insights",
            description: "Could not get AI insights. Please try again later."
        });
      }
    });
  };

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="keyword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seed Keyword</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., ai tools" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="locale"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Locale</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a locale" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locales.map(locale => (
                            <SelectItem key={locale.value} value={locale.value}>{locale.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="useGoogleAds"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Use Google Ads</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Analyze Keywords
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {results && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Term</TableHead>
                  <TableHead className="text-right">Search Volume</TableHead>
                  <TableHead className="text-right">CPC</TableHead>
                  <TableHead className="text-right">Competition</TableHead>
                  <TableHead className="text-center">Source</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((row) => (
                  <TableRow key={row.term}>
                    <TableCell className="font-medium">{row.term}</TableCell>
                    <TableCell className="text-right">{row.searchVolume.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${row.cpc.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{(row.competition * 100).toFixed(0)}%</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={row.source === 'Google Ads' ? 'default' : 'secondary'}>
                        {row.source === 'Google Ads' ? 'Accurate' : 'Relative'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleGetInsights(row)} disabled={isPending}>
                            <Wand2 className="h-4 w-4 mr-2" />
                            Get AI Insights
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {(isPending || aiInsight) && (
        <Alert className="mt-6">
            <BrainCircuit className="h-4 w-4" />
            <AlertTitle>AI-Powered Insights</AlertTitle>
            <AlertDescription>
                {isPending && !aiInsight && <div className="flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating insights...</div>}
                {aiInsight}
            </AlertDescription>
        </Alert>
      )}

    </>
  );
}
