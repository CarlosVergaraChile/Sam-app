import { NextRequest, NextResponse } from 'next/server';
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

    // Obtener usuario actual
    const token = authHeader.slice(7);
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Invalid token or user not found' },
        { status: 401 }
      );
    }

    // Verificar acceso al feature generador
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey);
    const { data: features, error: featureError } = await supabaseService
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

    // Verificar créditos disponibles
    const { data: credits, error: creditsError } = await supabaseService
      .from('user_credits')
      .select('credits')
      .eq('user_id', user.id)
      .single();

    if (creditsError || !credits || credits.credits < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits', balance: credits?.credits || 0 },
        { status: 402 }
      );
    }

    // Obtener parámetros del request
    const body = await request.json();
    const { nivel } = body;

    // Generar material (stub por ahora)
    const material = `Material educativo generado\n\nNivel: ${nivel || 'general'}\nUsuario: ${user.email}\nTipo: Contenido de apoyo`;

    // Descontar 1 crédito (usuario service role para update)
    const { error: updateError } = await supabaseService
      .from('user_credits')
      .update({
        credits: credits.credits - 1,
        used_this_month: (credits.used_this_month || 0) + 1
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating credits:', updateError);
      return NextResponse.json(
        { error: 'Failed to process generation' },
        { status: 500 }
      );
    }

    // Respuesta exitosa
    return NextResponse.json(
      {
        ok: true,
        message: 'Generated',
        material: material,
        creditsRemaining: credits.credits - 1
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
