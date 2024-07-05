import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import dayjs from "dayjs";

const prisma = new PrismaClient();

// Function to post payment data
const postPayment = async (invoiceData: any) => {
  try {
    const { reservation_id, merchant_id, amount, external_id } = invoiceData;

    // Ambil data order dari tabel order berdasarkan order_id
    const existingOrder = await prisma.reservation.findUnique({
      where: { reservation_id },
    });

    if (!existingOrder) {
      throw new Error(`Order with order_id ${reservation_id} not found`);
    }

    // Ambil nilai status dari data order
    const { status } = existingOrder;

    // Gunakan nilai status untuk membuat entri baru dalam tabel payment
    const payment_method = "Undefined"; // Sesuaikan dengan metode pembayaran yang Anda gunakan
    const payment_date = new Date().toISOString(); // Gunakan tanggal eksekusi saat ini

    // Buat entri baru dalam tabel payment menggunakan nilai status dari order
    const newPayment = await prisma.payment.create({
      data: {
        reservation_id,
        merchant_id,
        amount,
        payment_method,
        status,
        payment_date,
        external_id,
      },
    });

    console.log("New payment created:", newPayment);

    const newBooking = await prisma.queue.create({
      data: {
        reservation_id,
        merchant_id,
        payment_id: newPayment.payment_id,
        has_arrived: null,
      },
    });

    console.log("New booking created:", newBooking);

    return newPayment;
  } catch (error) {
    console.error("Error posting payment:", error);
    throw error;
  }
};

export async function updateOrderFinish(
  externalId: string,
  newStatus: string,
  paymentMethod: string
) {
  try {
    // Check if the record exists
    const transaction = await prisma.reservation.findUnique({
      where: { external_id: externalId },
      include: {
        Schedule: {
          include: {
            doctor: true,
          },
        },
        Merchant: true,
      },
    });

    if (!transaction) {
      throw new Error(`Transaction with external_id ${externalId} not found`);
    }

    // Update the status if the record exists
    const updatedTransaction = await prisma.reservation.update({
      where: { external_id: externalId },
      data: { status: newStatus },
    });

    console.log("Status pembayaran berhasil diperbarui:", updatedTransaction);

    // Post payment data after updating the status
    if (newStatus === "PAID") {
      await postPayment({
        reservation_id: transaction.reservation_id,
        merchant_id: transaction.merchant_id,
        amount: transaction.total_amount,
        external_id: transaction.external_id,
      });

      // Update available_balance for the merchant
      await prisma.merchant.update({
        where: { merchant_id: transaction.merchant_id },
        data: {
          available_balance: {
            increment: transaction.total_amount,
          },
        },
      });

      try {
        await prisma.payment.update({
          where: { external_id: transaction.external_id },
          data: {
            payment_method: paymentMethod,
          },
        });
        console.log("payment method berhasil diperbarui: ", paymentMethod);
      } catch (error) {
        console.error("terdapat kesalahan", error);
      }

      // Record the income for the merchant
      try {
        const income = await prisma.income.create({
          data: {
            merchant_id: transaction.merchant_id,
            amount: transaction.total_amount,
          },
        });

        console.log("Income recorded successfully:", income);
      } catch (incomeError) {
        console.error("Failed to record income:", incomeError);
        throw new Error("Failed to record income");
      }

      // Send email notifications to patient and doctor
      const doctorEmail = transaction.Schedule.doctor.email;
      const patientEmail = transaction.patient_email;

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const patientEmailHtml = `
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
                  <h1>${transaction.no_reservation}</h1>
              </div>
              <div class="content">
                  <div class="form-group">
                      <label>Nama Pasien:</label>
                      <div class="value">${transaction.patient_name}</div>
                  </div>
                  <div class="form-group">
                      <label>Nama Dokter:</label>
                      <div class="value">${
                        transaction.Schedule.doctor.name
                      }</div>
                  </div>
                  <div class="form-group">
                      <label>Spesialis:</label>
                      <div class="value">${
                        transaction.Schedule.doctor.specialist
                      }</div>
                  </div>
                  <div class="form-group">
                      <label>Hari dan Tanggal:</label>
                      <div class="value">${dayjs(transaction.date_time).format(
                        "HH:mm DD MMMM YYYY"
                      )}</div>
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
        to: patientEmail,
        subject: "Reservasi Pasien",
        html: patientEmailHtml,
      });

      await transporter.sendMail({
        from: '"AppointMed" <no-reply@gmail.com>',
        to: doctorEmail,
        subject: "Detail Reservasi Pasien",
        text: `Detail Reservasi Pasien\n\nNo Reservasi: ${transaction.no_reservation}\nNama Pasien: ${transaction.patient_name}\nNomor Telepon: ${transaction.patient_phone}\nJenis Kelamin: ${transaction.patient_gender}\nJam: ${transaction.date_time}`,
        html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-align: center; padding: 40px; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #0275d8; padding: 20px 0;">
            <h2 style="color: white; margin: 0;">Detail Reservasi Pasien</h2>
          </div>
          <div style="padding: 20px;">
            <h3 style="text-align: left;">No Reservasi: ${transaction.no_reservation}</h3>
            <p style="text-align: left;">Nama Pasien: ${transaction.patient_name}</p>
            <p style="text-align: left;">Nomor Telepon: ${transaction.patient_phone}</p>
            <p style="text-align: left;">Jenis Kelamin: ${transaction.patient_gender}</p>
            <p style="text-align: left;">Jam: ${transaction.date_time}</p>
          </div>
        </div>
      </div>`,
      });
    }

    return updatedTransaction;
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
}
