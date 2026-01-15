import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // TODO: Implementar autenticación real
    // Stub para testing de la generación de material
    
    const body = await request.json();
    const { material: inputMaterial } = body;

    if (!inputMaterial) {
      return NextResponse.json(
        { error: 'Material input is required' },
        { status: 400 }
      );
    }

    // Stub: genera material de respuesta
    const generatedMaterial = `Generación completada para: ${inputMaterial.substring(0, 50)}...`;

    return NextResponse.json(
      {
        ok: true,
        message: 'Generated',
        material: generatedMaterial,
        creditsRemaining: 199
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
