import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(request: NextRequest) {
  try {
    // Obtener token desde Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    supabase.auth.setSession({ access_token: token, refresh_token: '' });

    // Obtener user actual
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Invalid token or user not found' },
        { status: 401 }
      );
    }

    // Verificar acceso al feature generador
    const { data: features, error: featureError } = await supabase
      .from('user_features')
      .select('enabled')
      .eq('user_id', user.id)
      .eq('feature_name', 'generador')
      .single();

    if (featureError || !features?.enabled) {
      return NextResponse.json(
        { error: 'Feature not available' },
        { status: 403 }
      );
    }

    // Verificar créditos
    const { data: credits, error: creditsError } = await supabase
      .from('user_credits')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    if (creditsError || !credits || credits.balance < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits', balance: credits?.balance || 0 },
        { status: 402 }
      );
    }

    // Obtener parámetros del request
    const body = await request.json();
    const { nivel = '', asignatura = '', tipo = '', caracteristicas = [] } = body;

    // Generar material (stub por ahora)
    const material = `Material educativo generado\n\nNivel: ${nivel}\nAsignatura: ${asignatura}\nTipo: ${tipo}\nCaracterísticas: ${caracteristicas.join(', ') || 'ninguna'}\n\nContenido de ejemplo para ${asignatura} de ${nivel}.`;

    // Descontar 1 crédito (usar service role para update)
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey);
    const { error: updateError } = await supabaseService
      .from('user_credits')
      .update({
        balance: credits.balance - 1,
        used_this_month: (credits.used_this_month || 0) + 1
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating credits:', updateError);
      return NextResponse.json(
        { error: 'Failed to process credits' },
        { status: 500 }
      );
    }

    // Respuesta exitosa
    return NextResponse.json(
      {
        material,
        creditosUsados: 1,
        saldoRestante: credits.balance - 1,
        tipo,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: true, message: 'Generate API endpoint', method: 'POST' },
    { status: 200 }
  );
}
