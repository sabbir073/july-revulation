import { NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma";

export async function POST(req: Request) {
  try {
    const { ip } = await req.json();

    if (!ip) {
      return NextResponse.json(
        { success: false, message: "IP address is required." },
        { status: 400 }
      );
    }

    // Check if the IP already exists in the database
    const existingVisitor = await prisma.visitor.findFirst({
      where: { ip_address: ip },
    });

    if (existingVisitor) {
      // Check if the last visit was recorded within the last 5 minutes
      const lastVisitTime = new Date(existingVisitor.visited_at);
      const currentTime = new Date();
      const timeDifference = currentTime.getTime() - lastVisitTime.getTime();

      // Only increment if the last visit was more than 5 minutes ago
      if (timeDifference > 5 * 60 * 1000) {
        await prisma.visitor.update({
          where: { id: existingVisitor.id },
          data: {
            visit_count: { increment: 1 },
            visited_at: currentTime,
          },
        });

        return NextResponse.json({
          success: true,
          message: "Visitor updated successfully.",
        });
      }

      return NextResponse.json({
        success: true,
        message: "Visitor already recorded recently.",
      });
    } else {
      // Use a geolocation API to get geolocation data for new visitors
      const geoResponse = await fetch(
        `https://ipinfo.io/${ip}/geo?token=886257d1d1ea70`
      );
      const geoData = await geoResponse.json();

      // Extract required geolocation details
      const country = geoData?.country || "Unknown";
      const region = geoData?.region || "Unknown";
      const city = geoData?.city || "Unknown";

      // Add a new visitor record if the IP is new
      await prisma.visitor.create({
        data: {
          ip_address: ip,
          country,
          region,
          city,
          visit_count: 1,
          visited_at: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Visitor added successfully.",
      });
    }
  } catch (error) {
    console.error("Error tracking visitor:", error);
    return NextResponse.json(
      { success: false, message: "Error tracking visitor.", error },
      { status: 500 }
    );
  }
}
