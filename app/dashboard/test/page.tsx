import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const allUsers = await prisma.users.findMany();
  console.log(allUsers);
}

export default async function Page() {
  await main();

  return <div>hola</div>;
}
