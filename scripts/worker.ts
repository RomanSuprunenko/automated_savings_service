import { prisma } from "../src/server/db";

async function processScheduledTransfers() {
  const now = new Date();
  const transfers = await prisma.transfer.findMany({
    where: {
      status: "scheduled",
      scheduledFor: { lte: now }
    }
  });

  for (const transfer of transfers) {
    await prisma.transfer.update({
      where: { id: transfer.id },
      data: { status: "processing" }
    });

    await new Promise((resolve) => setTimeout(resolve, 250));

    await prisma.transfer.update({
      where: { id: transfer.id },
      data: { status: "completed" }
    });
  }

  return transfers.length;
}

async function run() {
  const processed = await processScheduledTransfers();
  console.log(`[worker] processed ${processed} transfer(s)`);
}

run()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("[worker] error", error);
    process.exit(1);
  });
