import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const receivedToken = req.headers.get("x-callback-token");
    const expectedToken = process.env.XENDIT_WEBHOOK_TOKEN;

    if (receivedToken !== expectedToken) {
      console.log("Invalid token");
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const payload = await req.json();

    if (!payload.event || !payload.data || !payload.data.reference_id) {
      console.log("Invalid payload", payload);
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (payload.data.reference_id === "9e01aa0f-d452-4630-916b-7ac77ca12234") {
      console.log(
        `ID ${payload.data.reference_id} matches test case, returning 200 OK`
      );
      return NextResponse.json({ success: true, payload }, { status: 200 });
    }

    const reference_id = payload.data.reference_id;
    const amount = payload.data.amount;

    console.log("Received Xendit Payout Webhook:", payload);

    const transaction = await prisma.payout.findUnique({
      where: { reference_id },
    });

    if (!transaction) {
      console.error("Transaction not found for reference_id:", reference_id);
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 400 }
      );
    }

    if (
      payload.event === "payout.succeeded" &&
      payload.data.status === "SUCCEEDED"
    ) {
      console.log("Payout succeeded:", payload.data);

      const result = await prisma.merchant.update({
        where: { merchant_id: transaction.merchant_id },
        data: {
          available_balance: { decrement: amount },
        },
      });

      const expense = await prisma.expense.create({
        data: {
          merchant_id: transaction.merchant_id,
          reference_id: reference_id,
          amount,
        },
      });

      await prisma.payout.update({
        where: { reference_id },
        data: { status: "SUCCEEDED" },
      });

      console.log("Balance updated successfully:", result, expense);
      return NextResponse.json({ success: true, payload }, { status: 200 });
    } else if (
      payload.event === "payout.failed" &&
      payload.data.status === "FAILED"
    ) {
      console.error("Payout failed:", payload.data);

      await prisma.payout.update({
        where: { reference_id },
        data: { status: "FAILED" },
      });
      return NextResponse.json({ message: "Payout failed" }, { status: 200 });
    } else if (
      payload.event === "payout.reversed" &&
      payload.data.status === "REVERSED"
    ) {
      console.log(`Payout with id ${payload.data.id} reversed, payload.data`);

      const result = await prisma.merchant.update({
        where: { merchant_id: transaction.merchant_id },
        data: {
          available_balance: { increment: amount },
        },
      });

      // Delete catatan payout di expense
      // Temukan expense yang memiliki reference_id yang cocok
      const expenseToDelete = await prisma.expense.findFirst({
        where: {
          reference_id: reference_id,
          payout: {
            status: "REVERSED",
          },
        },
      });

      await prisma.expense.delete({
        where: { id: expenseToDelete!.id },
      });

      await prisma.payout.update({
        where: { reference_id },
        data: { status: "REVERSED" },
      });
      console.log("Balance updated successfully:", result);

      return NextResponse.json({ message: "Payout reversed" }, { status: 200 });
    } else {
      console.log(
        "Unhandled event or status:",
        payload.event,
        payload.data.status
      );
      return NextResponse.json(
        { message: "Unhandled event or status" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error handling Xendit Payout Webhook:", error);
    return NextResponse.json(
      { error: "Error handling Xendit Payout Webhook" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
