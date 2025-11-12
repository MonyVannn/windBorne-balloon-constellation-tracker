import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hours = searchParams.get("hours") || "00";

  const paddedHours = hours.padStart(2, "0");
  const url = `https://a.windbornesystems.com/treasure/${paddedHours}.json`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error(`Error fetching ${paddedHours}.json:`, error);
    return NextResponse.json(
      { error: "Failed to fetch balloon data" },
      { status: 500 }
    );
  }
}
