"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Server, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import type { DomainAvailability } from '@/lib/types';
import { Badge } from '../ui/badge';

const availabilitySchema = z.object({
  domain: z.string().min(3, "Domain must be at least 3 characters").refine(val => val.includes('.'), "Please enter a valid domain name."),
});

export default function AvailabilityChecker() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DomainAvailability | null>(null);

  const form = useForm<z.infer<typeof availabilitySchema>>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      domain: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof availabilitySchema>) => {
    setLoading(true);
    setError(null);
    setResult(null);

    await new Promise(resolve => setTimeout(resolve, 1500));

    if (data.domain.includes('error')) {
      setError('Failed to check domain availability. Please try again later.');
    } else if (data.domain.includes('taken')) {
      setResult({
        status: 'taken',
        registrar: 'GoDaddy',
        createdDate: '2020-01-15',
        expiryDate: '2025-01-15',
        nameServers: ['ns1.godaddy.com', 'ns2.godaddy.com'],
        notes: 'This domain is currently registered and not available.'
      });
    } else if (data.domain.includes('unknown')) {
      setResult({
        status: 'unknown',
        notes: 'Could not determine availability for this TLD. The registry might be down or not supported.'
      });
    } else {
      setResult({
        status: 'available',
        notes: 'Congratulations! This domain appears to be available for registration.'
      });
    }

    setLoading(false);
  };

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row items-start gap-4">
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="sr-only">Domain Name</FormLabel>
                    <FormControl>
                      <Input placeholder="example.com" {...field} className="text-base" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full sm:w-auto flex-shrink-0">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Check Availability
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

      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Availability Result</span>
              {result.status === 'available' && <Badge variant="default" className="bg-green-500 hover:bg-green-600">Available</Badge>}
              {result.status === 'taken' && <Badge variant="destructive">Taken</Badge>}
              {result.status === 'unknown' && <Badge variant="secondary">Unknown</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              {result.status === 'available' && <CheckCircle className="h-6 w-6 text-green-500" />}
              {result.status === 'taken' && <XCircle className="h-6 w-6 text-destructive" />}
              {result.status === 'unknown' && <AlertTriangle className="h-6 w-6 text-yellow-500" />}
              <span>{form.getValues('domain')}</span>
            </div>
            {result.notes && <p className="text-muted-foreground">{result.notes}</p>}
            
            {result.status === 'taken' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <h4 className="font-semibold text-sm">Registrar</h4>
                  <p className="text-muted-foreground">{result.registrar}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Created Date</h4>
                  <p className="text-muted-foreground">{result.createdDate}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Expiry Date</h4>
                  <p className="text-muted-foreground">{result.expiryDate}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Name Servers</h4>
                  <ul className="text-muted-foreground list-disc pl-5">
                    {result.nameServers?.map(ns => <li key={ns}>{ns}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
          {result.status === 'available' && (
            <CardFooter>
              <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <a href={`https://www.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=${form.getValues('domain')}`} target="_blank" rel="noopener noreferrer">Register Now</a>
              </Button>
            </CardFooter>
          )}
        </Card>
      )}
    </>
  );
}
