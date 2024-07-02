import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const tokenHeader = req.headers.get("Authorization");
    const token = tokenHeader?.split(" ")[1];
    if (!token) {
      return new NextResponse(JSON.stringify({ error: "Token not provided" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const body = await req.json();
    const { subject, text } = body;

    if (!subject || !text) {
      return new NextResponse(
        JSON.stringify({
          error: "Please provide all required fields",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const merchants = await prisma.merchant.findMany({
      select: { merchant_email: true, merchant_company: true },
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const emailPromises = merchants.map((merchant) => {
      const mailOptions = {
        from: '"AppointMed" <no-reply@gmail.com>',
        to: merchant.merchant_email,
        subject: subject,
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-align: center; padding: 40px; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
              <div style="background-color: #0275d8; padding: 20px 0;">
                <h1 style="color: #ffffff; margin: 0; padding: 0 20px;">${subject}</h1>
              </div>
              <div style="padding: 20px;">
                <p style="font-size: 16px;">Hai ${merchant.merchant_company}</p>
                <p>${text}</p>
              </div>
              <div style="background-color: #f0f0f0; padding: 20px; font-size: 14px; text-align: left;">
                <p>Salam Hangat,<br/>Tim AppointMed</p>
              </div>
            </div>
          </div>
        `,
      };

      return transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);

    return new NextResponse(
      JSON.stringify({
        message: "Emails sent successfully",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error accessing database or sending email:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error or Invalid Token" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}
