import { PrismaClient } from "@prisma/client";
import axios from "axios";

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
      } catch (erorr) {
        console.error("terdapat kesalahan", erorr);
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

      console.log("Merchant balance updated successfully");
    }

    return updatedTransaction;
  } catch (error) {
    console.error(
      "Terjadi kesalahan dalam memperbarui status pembayaran:",
      error || error
    );
    throw new Error("Terjadi kesalahan dalam memperbarui status pembayaran");
  } finally {
    await prisma.$disconnect();
  }
}
