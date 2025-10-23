"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle, Search } from 'lucide-react';
import type { TrademarkResult } from '@/lib/types';
import { Badge } from '../ui/badge';

const trademarkSchema = z.object({
  mark: z.string().min(2, "Mark name must be at least 2 characters"),
  class: z.string().optional(),
  country: z.string(),
});

const mockTrademarkResults: TrademarkResult[] = [
    {
      mark: 'Domain Insights',
      status: 'LIVE',
      classes: ['035', '042'],
      owner: 'Big Tech Corp',
      filingDate: '2023-01-10',
      serialNumber: '98765432',
      source: 'USPTO'
    },
    {
      mark: 'Domain Insight',
      status: 'DEAD',
      classes: ['042'],
      owner: 'Startup Inc.',
      filingDate: '2021-05-20',
      serialNumber: '87654321',
      source: 'USPTO'
    },
    {
        mark: 'Insightful Domains',
        status: 'LIVE',
        classes: ['035'],
        owner: 'Another Company LLC',
        filingDate: '2022-11-15',
        serialNumber: '76543210',
        source: 'USPTO'
    }
];


export default function TrademarkChecker() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<TrademarkResult[] | null>(null);

  const form = useForm<z.infer<typeof trademarkSchema>>({
    resolver: zodResolver(trademarkSchema),
    defaultValues: {
      mark: '',
      class: '',
      country: 'US',
    },
  });

  const onSubmit = async (data: z.infer<typeof trademarkSchema>) => {
    setLoading(true);
    setError(null);
    setResults(null);

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (data.mark.toLowerCase().includes('error')) {
        setError('Failed to search for trademarks. Please try again later.');
    } else if (data.mark.toLowerCase().includes('no results')) {
        setResults([]);
    }
    else {
        setResults(mockTrademarkResults.filter(r => r.mark.toLowerCase().includes(data.mark.toLowerCase())));
    }


    setLoading(false);
  };

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField
                    control={form.control}
                    name="mark"
                    render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                        <FormLabel>Mark Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Domain Insights" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                 <FormField
                    control={form.control}
                    name="class"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Class (Optional)</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., 042" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Search
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
        <div className="mt-6 space-y-4">
            <h2 className="text-2xl font-semibold">
                {results.length} result{results.length === 1 ? '' : 's'} found
            </h2>
            {results.length === 0 ? (
                 <Card>
                    <CardContent className='pt-6'>
                        <p>No trademarks found matching your query.</p>
                    </CardContent>
                </Card>
            ) : (
                results.map((result) => (
                    <Card key={result.serialNumber}>
                        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-2">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                {result.mark} 
                                <Badge variant={result.status === 'LIVE' ? 'default' : 'secondary'} className={result.status === 'LIVE' ? 'bg-green-500' : ''}>
                                    {result.status}
                                </Badge>
                            </h3>
                            <p className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">Owner:</span> {result.owner}
                            </p>
                            <p className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">Classes:</span> {result.classes.join(', ')}
                            </p>
                        </div>
                        <div className="space-y-2 text-sm">
                            <p><span className="font-semibold">Filing Date:</span> {result.filingDate}</p>
                            <p>
                            <span className="font-semibold">Serial No:</span> 
                            <a href={`https://tsdr.uspto.gov/#caseNumber=${result.serialNumber}&caseType=SERIAL_NO&searchType=statusSearch`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                                {result.serialNumber}
                            </a>
                            </p>
                            <p><span className="font-semibold">Source:</span> {result.source}</p>
                        </div>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
      )}
    </>
  );
}
