import { NextResponse } from 'next/server';
import { errorMessage } from './logic';

export function ok<T extends object>(data: T) {
  return NextResponse.json({ success: true, ...data });
}

export function fail(error: unknown, status = 500) {
  return NextResponse.json({ success: false, error: errorMessage(error) }, { status });
}
