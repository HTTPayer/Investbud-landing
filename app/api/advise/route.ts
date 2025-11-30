import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 
  'https://r3467d7khd8b94sfguhrr273lo.ingress.akashprovid.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('[Advise API] Request received:', {
      wallet_address: body.wallet_address,
      network: body.network,
      chain_id: body.chain_id,
    });
    
    // Get X-PAYMENT header if present
    const paymentHeader = request.headers.get('x-payment');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Forward X-PAYMENT header to backend
    if (paymentHeader) {
      headers['X-PAYMENT'] = paymentHeader;
    }

    console.log('[Advise API] Calling backend:', `${BACKEND_URL}/advise`);

    const response = await fetch(`${BACKEND_URL}/advise`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    console.log('[Advise API] Backend response:', {
      status: response.status,
      hasData: !!data,
    });

    // Forward the response with the same status code
    return NextResponse.json(data, { 
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-PAYMENT',
      }
    });
  } catch (error) {
    console.error('[Advise API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-PAYMENT',
    },
  });
}
