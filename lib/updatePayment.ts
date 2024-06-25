import { PrismaClient } from "@prisma/client";
import axios from "axios";
import moment from "moment";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

const createMerchant = async (invoiceData: any) => {
  try {
    const { pending_id, plan } = invoiceData;

    const existingPaymentPending =
      await prisma.merchantPendingPayment.findUnique({
        where: { pending_id },
      });

    if (!existingPaymentPending) {
      throw new Error(`Order with id ${pending_id} not found`);
    }

    const { merchant_email, password } = existingPaymentPending;
    const startDate = new Date();
    const generateApiKey = () => crypto.randomBytes(32).toString("hex");

    const packageInfo = await prisma.package.findUnique({
      where: { package_id: plan },
    });

    if (!packageInfo) {
      return NextResponse.json({ error: "Invalid plan ID" });
    }

    const endDate = moment(startDate)
      .add(packageInfo.duration, "months")
      .toDate();

    const existingMerchant = await prisma.merchant.findUnique({
      where: { merchant_email },
    });

    let newMerchant;
    if (existingMerchant) {
      const newMerchantPayment = await prisma.merchantPayment.create({
        data: {
          pending_id,
          invoice_id: existingPaymentPending.invoice_id,
          status: existingPaymentPending.status,
        },
      });

      newMerchant = await prisma.merchant.update({
        where: { merchant_email },
        data: {
          start_date: startDate,
          end_date: endDate,
          api_key: generateApiKey(),
          package_id: plan,
          pending_id: pending_id,
          merchant_payment_id: newMerchantPayment.merchant_payment_id,
          status_subscriber: "Aktif",
        },
      });

      console.log(`Merchant with email ${merchant_email} updated successfully`);
    } else {
      const newMerchantPayment = await prisma.merchantPayment.create({
        data: {
          pending_id,
          invoice_id: existingPaymentPending.invoice_id,
          status: existingPaymentPending.status,
        },
      });

      newMerchant = await prisma.merchant.create({
        data: {
          start_date: startDate,
          end_date: endDate,
          api_key: generateApiKey(),
          package_id: plan,
          pending_id,
          merchant_payment_id: newMerchantPayment.merchant_payment_id,
          merchant_email,
          status_subscriber: "Aktif",
          password,
          available_balance: 0,
          merchant_company: existingPaymentPending.klinik_name,
          merchant_name: existingPaymentPending.merchant_name,
        },
      });

      console.log("Merchant berhasil dibuat:", newMerchant);
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: '"RentalinAja" <no-reply@gmail.com>',
      to: merchant_email,
      subject: "Aktivasi Akun Anda",
      text: "Halo! Terima kasih telah mendaftar. Silakan klik link berikut untuk mengaktifkan akun Anda: http://localhost:3000/dashboard/login",
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-align: center; padding: 40px; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #0275d8; padding: 20px 0;">
              <h1 style="color: #ffffff; margin: 0; padding: 0 20px;">Selamat Datang di RentalinAja!</h1>
            </div>
            <div style="padding: 20px;">
              <p style="font-size: 16px;">Hai,</p>
              <p style="font-size: 16px;">Terima kasih telah mendaftar di RentalinAja. Kami senang Anda bergabung dengan kami. Untuk menyelesaikan proses pendaftaran dan mengaktifkan akun Anda, silakan klik tombol di bawah ini:</p>
              <a href="http://localhost:3000/dashboard/login"
                style="display: inline-block; background-color: #0275d8; color: #ffffff; padding: 12px 24px; font-size: 18px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
                Aktifkan Akun Anda
              </a>
              <p style="font-size: 16px;">Jika tombol di atas tidak bekerja, salin dan tempel tautan berikut ke browser Anda:</p>
              <p style="font-size: 16px;"><a href="http://localhost:3000/dashboard/login" style="color: #0275d8;">http://localhost:3000/dashboard/login</a></p>
              <p style="font-size: 16px;">Jika Anda memiliki pertanyaan atau butuh bantuan lebih lanjut, jangan ragu untuk membalas email ini atau menghubungi support kami.</p>
            </div>
            <div style="background-color: #f0f0f0; padding: 20px; font-size: 14px; text-align: left;">
              <p>Salam Hangat,<br/>Tim RentalinAja</p>
            </div>
          </div>
        </div>
      `,
    });

    return newMerchant;
  } catch (error) {
    console.error(
      "Terjadi kesalahan dalam membuat atau memperbarui merchant:",
      error
    );
    throw new Error(
      "Terjadi kesalahan dalam membuat atau memperbarui merchant"
    );
  } finally {
    await prisma.$disconnect();
  }
};

export async function updatePaymentStatus(
  externalId: string,
  newStatus: string
) {
  try {
    const transaction = await prisma.merchantPendingPayment.findUnique({
      where: { invoice_id: externalId },
    });

    if (!transaction) {
      console.log(`Transaction with id ${externalId} not found`);
      return;
    }

    const updatedTransaction = await prisma.merchantPendingPayment.update({
      where: { invoice_id: externalId },
      data: { status: newStatus },
    });

    console.log("Status pembayaran berhasil diperbarui:", updatedTransaction);

    if (newStatus === "PAID") {
      await createMerchant({
        pending_id: transaction.pending_id,
        plan: transaction.package_id,
      });
    }

    return updatedTransaction;
  } catch (error) {
    console.error(
      "Terjadi kesalahan dalam memperbarui status pembayaran:",
      error
    );
    throw new Error("Terjadi kesalahan dalam memperbarui status pembayaran");
  } finally {
    await prisma.$disconnect();
  }
}

export async function updateExpiredStatus(
  externalId: string,
  newStatus: string
) {
  try {
    const transaction = await prisma.merchantPayment.findUnique({
      where: { invoice_id: externalId },
    });

    if (!transaction) {
      console.log(`Transaction with id ${externalId} not found`);
      return;
    }

    const updatedTransaction = await prisma.merchantPayment.update({
      where: { invoice_id: externalId },
      data: { status: newStatus },
    });

    console.log(
      "Status pembayaran berhasil diperbarui menjadi EXPIRED:",
      updatedTransaction
    );

    return updatedTransaction;
  } catch (error) {
    console.error(
      "Terjadi kesalahan dalam memperbarui status menjadi EXPIRED:",
      error
    );
    throw new Error(
      "Terjadi kesalahan dalam memperbarui status menjadi EXPIRED"
    );
  } finally {
    await prisma.$disconnect();
  }
}
