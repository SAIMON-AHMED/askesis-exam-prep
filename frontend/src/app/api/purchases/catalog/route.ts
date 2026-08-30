import { NextResponse } from 'next/server';

const CATALOG = [
  { exam_id: 'sat', name: 'Digital SAT Complete Mastery', price: 29.99, currency: 'USD' },
  { exam_id: 'act', name: 'ACT Comprehensive Prep', price: 29.99, currency: 'USD' },
  { exam_id: 'gre', name: 'GRE General Prep & Analytics', price: 39.99, currency: 'USD' },
  { exam_id: 'gmat', name: 'GMAT Focus Edition Mastery', price: 39.99, currency: 'USD' },
  { exam_id: 'shsat', name: 'SHSAT Specialized High School Exam', price: 24.99, currency: 'USD' },
  { exam_id: 'regents', name: 'NYS Regents Exam Pack', price: 19.99, currency: 'USD' },
];

export async function GET() {
  return NextResponse.json(CATALOG);
}
