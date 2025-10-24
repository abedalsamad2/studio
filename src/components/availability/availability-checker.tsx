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
import { AnimatePresence, motion } from 'framer-motion';

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

type AvailabilityCheckerProps = {
    domain?: string;
    showInput?: boolean;
};

export default function AvailabilityChecker({ domain, showInput = true }: AvailabilityCheckerProps) {
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

  const triggerSearch = async (searchDomain: string) => {
    if (!searchDomain || !availabilitySchema.shape.domain.safeParse(searchDomain).success) {
      setResult(null);
      return;
    }
    
    setLoading(true);
    setResult(null);

    try {
        const availabilityResult = await fetchJSON<DomainAvailability>(`/api/availability?domain=${searchDomain}`);
        setResult(availabilityResult);
    } catch (e: any) {
        toast({
            variant: "destructive",
            title: "Error checking availability",
            description: e.message || "Could not check domain availability. Please try again later."
        });
        setResult({ domain: searchDomain, status: 'unknown', notes: `Lookup failed: ${e.message}` });
    }

    setLoading(false);
  };
  
  useEffect(() => {
    if (domain) {
      form.setValue('domain', domain, { shouldValidate: true });
    }
  }, [domain, form]);
  
  useEffect(() => {
    if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
    }

    if (showInput) { // only run auto-search if the input is visible on the page
        const isDomainValid = availabilitySchema.shape.domain.safeParse(domainValue).success;

        if (domainValue && isDomainValid) {
            debounceTimeout.current = setTimeout(() => {
                triggerSearch(domainValue);
            }, 500); // 500ms debounce
        } else {
           setResult(null);
        }
    }


    return () => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
    };
  }, [domainValue, showInput]);


  return (
    <>
      {showInput && (
        <Card>
            <CardHeader>
                <CardTitle>Domain Availability</CardTitle>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={(e) => { e.preventDefault(); if (availabilitySchema.shape.domain.safeParse(form.getValues('domain')).success) triggerSearch(form.getValues('domain'))}} className="flex flex-col sm:flex-row items-start gap-4">
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
      )}

      <AnimatePresence>
      {(loading || result) && (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
        >
        <Card className={showInput ? "mt-6" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Availability</span>
              {loading ? (
                <Badge variant="secondary">Checking...</Badge>
              ) : result?.status === 'available' ? (
                <Badge variant="default" className="bg-green-500 hover:bg-green-600">Available</Badge>
              ) : result?.status === 'taken' ? (
                <Badge variant="destructive">Taken</Badge>
              ) : <Badge variant="secondary">Unknown</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading && (
                <div className="flex items-center gap-2 text-lg font-semibold">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <span>Checking {form.getValues('domain') || domain}...</span>
                </div>
            )}
            {result && !loading && (
              <>
                <div className="flex items-center gap-2 text-lg font-semibold">
                  {result.status === 'available' && <CheckCircle className="h-6 w-6 text-green-500" />}
                  {result.status === 'taken' && <XCircle className="h-6 w-6 text-destructive" />}
                  {result.status === 'unknown' && <AlertTriangle className="h-6 w-6 text-yellow-500" />}
                  <span>{result.domain}</span>
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
                      <h4-semibold text-sm>Name Servers</h4-semibold>
                      <ul className="text-muted-foreground list-disc pl-5">
                        {result.nameServers?.map(ns => <li key={ns}>{ns}</li>)}
                      </ul>
                    </div>}
                  </div>
                )}
                 {result.notes && <p className="text-sm text-muted-foreground">{result.notes}</p>}
              </>
            )}
          </CardContent>
          {result?.status === 'available' && !loading && (
            <CardFooter>
              <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <a href={`https://www.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=${result.domain}`} target="_blank" rel="noopener noreferrer">Register Now</a>
              </Button>
            </CardFooter>
          )}
        </Card>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}
