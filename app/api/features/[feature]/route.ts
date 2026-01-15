import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { feature: string } }
) {
  try {
    // TODO: Implementar verificación real en Supabase
    // Por ahora retorna stub para testing
    
    // En producción, aquí se consultaría la tabla user_features
    // con el session user desde el JWT token de la cookie
    
    const feature = params.feature;
    
    // Stub: generador siempre enabled para test
    if (feature === 'generador') {
      return NextResponse.json({ enabled: true }, { status: 200 });
    }
    
    return NextResponse.json({ enabled: false }, { status: 200 });
  } catch (error) {
    console.error('Feature check error:', error);
    return NextResponse.json({ enabled: false }, { status: 500 });
  }
}
