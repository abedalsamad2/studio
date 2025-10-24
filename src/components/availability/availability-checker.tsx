"use client";

import { useState, useEffect, useRef } from 'react';
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
import { useToast } from '@/hooks/use-toast';

const availabilitySchema = z.object({
  domain: z.string().min(3, "Domain must be at least 3 characters").refine(val => val.includes('.'), "Please enter a valid domain name."),
});

async function fetchJSON<JSON = any>(
    input: RequestInfo,
    init?: RequestInit
  ): Promise<JSON> {
    const response = await fetch(input, init);
  
    if (!response.ok) {
        let errorBody;
        try {
            errorBody = await response.json();
        } catch (e) {
            // ignore
        }
      throw new Error(errorBody?.error || response.statusText);
    }
  
    return response.json();
}

export default function AvailabilityChecker() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DomainAvailability | null>(null);
  const { toast } = useToast();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<z.infer<typeof availabilitySchema>>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      domain: '',
    },
    mode: 'onChange',
  });

  const domainValue = form.watch('domain');

  const triggerSearch = async (domain: string) => {
    setLoading(true);
    setResult(null);

    try {
        const availabilityResult = await fetchJSON<DomainAvailability>(`/api/availability?domain=${domain}`);
        setResult(availabilityResult);
    } catch (e: any) {
        toast({
            variant: "destructive",
            title: "Error checking availability",
            description: e.message || "Could not check domain availability. Please try again later."
        });
    }

    setLoading(false);
  };
  
  useEffect(() => {
    if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
    }

    const isDomainValid = availabilitySchema.shape.domain.safeParse(domainValue).success;

    if (domainValue && isDomainValid) {
        debounceTimeout.current = setTimeout(() => {
            triggerSearch(domainValue);
        }, 500); // 500ms debounce delay
    } else {
        setResult(null); // Clear results if input is invalid or empty
    }

    return () => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
    };
  }, [domainValue]);



  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row items-start gap-4">
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="sr-only">Domain Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="example.com" {...field} className="text-base pr-10" />
                        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
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

      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Availability Result for <span className='font-bold'>{result.domain}</span></span>
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
            
            {result.status === 'taken' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                {result.registrar && <div>
                  <h4 className="font-semibold text-sm">Registrar</h4>
                  <p className="text-muted-foreground">{result.registrar}</p>
                </div>}
                {result.createdDate && <div>
                  <h4 className="font-semibold text-sm">Created Date</h4>
                  <p className="text-muted-foreground">{new Date(result.createdDate).toLocaleDateString()}</p>
                </div>}
                {result.expiryDate && <div>
                  <h4 className="font-semibold text-sm">Expiry Date</h4>
                  <p className="text-muted-foreground">{new Date(result.expiryDate).toLocaleDateString()}</p>
                </div>}
                {result.nameServers && result.nameServers.length > 0 && <div>
                  <h4 className="font-semibold text-sm">Name Servers</h4>
                  <ul className="text-muted-foreground list-disc pl-5">
                    {result.nameServers?.map(ns => <li key={ns}>{ns}</li>)}
                  </ul>
                </div>}
              </div>
            )}
             {result.notes && <p className="text-muted-foreground">{result.notes}</p>}
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
