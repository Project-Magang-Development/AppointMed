import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import nodemailer from "nodemailer";

dayjs.extend(utc);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      schedules_id,
      apiKey,
      date_time,
      patient_name,
      patient_phone,
      patient_gender,
      patient_email,
      no_reservation,
      patient_address,
    } = body;

    if (
      !schedules_id ||
      !apiKey ||
      !date_time ||
      !patient_name ||
      !patient_phone ||
      !patient_gender ||
      !patient_email ||
      !no_reservation ||
      !patient_address
    ) {
      return new NextResponse(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const merchant = await prisma.merchant.findUnique({
      where: { api_key: apiKey },
    });

    if (!merchant) {
      return new NextResponse(
        JSON.stringify({ error: "Merchant not found or inactive" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const schedule = await prisma.schedule.findUnique({
      where: { schedules_id },
      include: { doctor: true },
    });

    if (!schedule) {
      return new NextResponse(JSON.stringify({ error: "Schedule not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const dateTime = dayjs.utc(date_time, "YYYY-MM-DD HH:mm").toISOString();
    const time = dayjs.utc(date_time, "HH:mm").toISOString();

    const existingReservation = await prisma.reservation.findFirst({
      where: {
        schedules_id,
        date_time: dateTime,
      },
    });

    if (existingReservation) {
      return new NextResponse(
        JSON.stringify({ error: "A reservation already exists at this time" }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const createdReservation = await prisma.reservation.create({
      data: {
        schedules_id,
        no_reservation,
        date_time: dateTime,
        patient_name,
        patient_email,
        patient_gender,
        patient_address,
        patient_phone,
        merchant_id: merchant?.merchant_id,
        patient_address,
      },
      include: {
        Schedule: {
          include: {
            doctor: true,
          },
        },
      },
    });


    await prisma.merchant.update({
      where: { merchant_id: merchant!.merchant_id },
      data: { used_storage_order: { increment: 1 } },
    });

    const doctorEmail = schedule.doctor.email;

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            margin: 0;
            padding: 0;
        }
        .container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 50px auto;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #00a69c;
            color: white;
            text-align: center;
            padding: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 3em;
        }
        .header h2 {
            margin: 0;
            font-size: 1.2em;
            font-weight: normal;
        }
        .content {
            padding: 20px;
        }
        .form-group {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
        }
        .form-group label {
            flex: 1;
            font-weight: bold;
        }
        .form-group .value {
            flex: 2;
            text-align: right;
        }
        .warning {
            color: red;
            font-size: 0.9em;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Nomor Antrian</h2>
            <h1>${createdReservation.no_reservation}</h1>
        </div>
        <div class="content">
            <div class="form-group">
                <label>Nama Pasien:</label>
                <div class="value">${patient_name}</div>
            </div>
            <div class="form-group">
                <label>Nama Dokter:</label>
                <div class="value">${schedule.doctor.name}</div>
            </div>
            <div class="form-group">
                <label>Spesialis:</label>
                <div class="value">${schedule.doctor.specialist}</div>
            </div>
            <div class="form-group">
                <label>Hari dan Tanggal:</label>
                <div class="value">${dayjs
                  .utc(dateTime)
                  .format("dddd, YYYY-MM-DD HH:mm")}</div>
            </div>
            <div class="warning">
                <p>⚠ Silahkan datang paling lambat 15 menit sebelum janji temu dengan dokter dimulai.</p>
                <p>⚠ Konfirmasi kehadiran kepada admin resepsionis dengan melihatkan pesan email ini.</p>
            </div>
        </div>
    </div>
</body>
</html>
`;

    await transporter.sendMail({
      from: '"AppointMed" <no-reply@gmail.com>',
      to: patient_email,
      subject: "Reservasi Pasien",
      html: emailHtml,
    });

    await transporter.sendMail({
      from: '"AppointMed" <no-reply@gmail.com>',
      to: doctorEmail,
      subject: "Detail Reservasi Pasien",
      text: `Detail Reservasi Pasien\n\nNo Reservasi: ${createdReservation.no_reservation}\nNama Pasien: ${patient_name}\nNomor Telepon: ${patient_phone}\nJenis Kelamin: ${patient_gender}`,
      html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-align: center; padding: 40px; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #0275d8; padding: 20px 0;">
            <h1 style="color: #ffffff; margin: 0; padding: 0 20px;">Detail Reservasi Pasien</h1>
          </div>
          <div style="padding: 20px;">
            <p style="font-size: 16px;">Hai Dokter ${schedule.doctor.name},</p>
            <p style="font-size: 16px;">Berikut adalah detail reservasi pasien:</p>
            <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
              <tr>
                <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">No Reservasi</th>
                <td style="text-align: left; padding: 8px; border: 1px solid #ddd;">${createdReservation.no_reservation}</td>
              </tr>
              <tr>
                <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Nama Pasien</th>
                <td style="text-align: left; padding: 8px; border: 1px solid #ddd;">${patient_name}</td>
              </tr>
              <tr>
                <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Nomor Telepon</th>
                <td style="text-align: left; padding: 8px; border: 1px solid #ddd;">${patient_phone}</td>
              </tr>
              <tr>
                <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Jenis Kelamin</th>
                <td style="text-align: left; padding: 8px; border: 1px solid #ddd;">${patient_gender}</td>
              </tr>
            </table>
            <p style="font-size: 16px;">Jika Anda memiliki pertanyaan lebih lanjut, silakan hubungi kami.</p>
          </div>
          <div style="background-color: #f0f0f0; padding: 20px; font-size: 14px; text-align: left;">
            <p>Salam Hangat,<br/>Tim AppointMeda</p>
          </div>
        </div>
      </div>
      `,
    });

    return new NextResponse(
      JSON.stringify({
        message: "Schedule created successfully",
        data: createdReservation,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error accessing database or verifying token:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// async function generateReservationNo(
//   schedules_id: string,
//   dateTime: string
// ): Promise<string> {
//   try {
//     const dateTimeISO = dayjs.utc(dateTime).toISOString();

//     const reservations = await prisma.reservation.findMany({
//       where: {
//         schedules_id,
//         date_time: {
//           gte: dayjs.utc(dateTime).startOf("day").toISOString(),
//           lte: dayjs.utc(dateTime).endOf("day").toISOString(),
//         },
//       },
//       orderBy: { date_time: "asc" },
//     });

//     const currentPosition = reservations.findIndex(
//       (reservation) => reservation.date_time.toISOString() === dateTimeISO
//     );

//     const reservationNumber =
//       currentPosition !== -1 ? currentPosition + 1 : reservations.length + 1;
//     return `A${reservationNumber.toString().padStart(3, "0")}`;
//   } catch (error) {
//     console.error("Error generating reservation number:", error);
//     throw new Error("Failed to generate reservation number");
//   }
// }
