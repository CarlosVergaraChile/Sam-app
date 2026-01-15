import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Get the user from cookies (JWT from Supabase)
    const token = request.cookies.get('sb-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the authenticated user
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = userData.user.id;

    // Check if user has generador feature enabled
    const { data: featureData, error: featureError } = await supabase
      .from('user_features')
      .select('enabled')
      .eq('user_id', userId)
      .eq('feature_name', 'generador')
      .single();

    if (featureError || !featureData?.enabled) {
      return NextResponse.json(
        { error: 'FEATURE_NOT_ENABLED', message: 'Generador feature not available' },
        { status: 403 }
      );
    }

    // Generate stub material
    const material = 'Prueba de material generado para el usuario.';

    // Consume 1 credit atomically - RPC function will handle this
    const { data: creditResult, error: creditError } = await supabase
      .rpc('consume_credit', {
        p_user_id: userId,
        p_amount: 1,
      });

    if (creditError || !creditResult) {
      return NextResponse.json(
        { error: 'INSUFFICIENT_CREDITS', message: 'No tienes créditos suficientes' },
        { status: 402 }
      );
    }

    // Get remaining credits
    const { data: creditData } = await supabase
      .from('user_credits')
      .select('balance')
      .eq('user_id', userId)
      .single();

    return NextResponse.json(
      {
        ok: true,
        material,
        creditsRemaining: creditData?.balance || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
