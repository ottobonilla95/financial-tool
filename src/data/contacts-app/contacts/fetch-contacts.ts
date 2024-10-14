import { PrismaClient, Prisma } from "@prisma/client";
import { Contact } from "@/src/types";

const prisma = new PrismaClient();

export type Data = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

type FetchContactsProps = {
  filters?: Prisma.contactsWhereInput;
};

export async function fetchContacts({ filters }: FetchContactsProps) {
  try {
    const data = await prisma.contacts.findMany({
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
      },
      where: filters,
    });

    const contacts = data.map((contact) => mapContact(contact));
    return contacts;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest contacts.");
  }
}

export const mapContact = (contact: Data): Contact => {
  return {
    id: contact.id,
    name: contact.name,
    latitude: contact.latitude,
    longitude: contact.longitude,
  };
};
