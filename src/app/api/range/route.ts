// Mock HTTP service for exercise 1 (S11).
export function GET() {
  return Response.json({ min: 1, max: 100 });
}
