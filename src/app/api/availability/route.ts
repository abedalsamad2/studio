import { type NextRequest, NextResponse } from 'next/server';
import whois from 'whois-json';
import axios from 'axios';

const rdapEndpoints = [
    'https://rdap.verisign.com/com/v1/domain/',
    'https://rdap.verisign.com/net/v1/domain/',
    'https://rdap.publicinterestregistry.net/rdap/org/domain/',
];

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    if (!domain) {
        return NextResponse.json({ error: 'domain required' }, { status: 400 });
    }

    try {
        const tld = domain.split('.').pop()?.toLowerCase();
        const rdapBase = rdapEndpoints.find(e => e.includes(`/${tld}/`)) || null;

        let data;

        if (rdapBase) {
            try {
                const response = await axios.get(`${rdapBase}${domain}`, { timeout: 8000 });
                const rdapData = response.data;
                const status = Array.isArray(rdapData.status) ? rdapData.status.join(',') : (rdapData.status || 'unknown');
                data = {
                    domain,
                    status: /inactive|available|not found/i.test(status) ? 'available' : 'taken',
                    registrar: rdapData['registrar']?.name || null,
                    createdDate: rdapData['events']?.find((e: any) => e.eventAction === 'registration')?.eventDate || null,
                    expiryDate: rdapData['events']?.find((e: any) => e.eventAction === 'expiration')?.eventDate || null,
                    nameServers: (rdapData['nameservers'] || []).map((ns: any) => ns.ldhName),
                    source: 'RDAP'
                };
            } catch (rdapError) {
                // If RDAP fails (e.g., for a non-existent domain), it might throw. Fallback to WHOIS.
                // A 404 from RDAP often means the domain is available.
                if (axios.isAxiosError(rdapError) && rdapError.response?.status === 404) {
                     data = { domain, status: 'available', source: 'RDAP' };
                     return NextResponse.json(data);
                }
                // For other RDAP errors, fall through to WHOIS
            }
        }
        
        // Fallback to WHOIS if RDAP is not available or fails
        if (!data) {
            const whoisData = await whois(domain);
            const statusText = `${whoisData.status || whoisData.DomainStatus || ''}`;
            const isAvailable = /no match for|not found|available/i.test(JSON.stringify(whoisData)) || /no match/i.test(statusText);

            data = {
                domain,
                status: isAvailable ? 'available' : 'taken',
                registrar: whoisData.registrar || whoisData.Registrar || null,
                createdDate: whoisData.creationDate || whoisData['Creation Date'] || null,
                expiryDate: whoisData.registryExpiryDate || whoisData['Registry Expiry Date'] || null,
                nameServers: Object.values(whoisData).filter(v => typeof v === 'string' && v.toLowerCase().includes('ns.')).slice(0, 5),
                source: 'WHOIS'
            };
        }

        return NextResponse.json(data);

    } catch (err: any) {
        // Broad catch for unexpected errors, including WHOIS failures
        if (err.message && (err.message.includes('No match for') || err.message.includes('NOT FOUND'))) {
            return NextResponse.json({ domain, status: 'available', source: 'WHOIS' });
        }
        console.error('Availability lookup failed:', err);
        return NextResponse.json({ error: 'availability_lookup_failed', message: err.message }, { status: 500 });
    }
}
