import Form from "@/src/ui/expenses/create-form";
import { Breadcrumbs } from "@/src/ui/components";
import { fetchCategories } from "@/src/data/categories";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  const userId = session?.user?.id as string;

  const categories = await fetchCategories(userId);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Gastos", href: "/dashboard/invoices" },
          {
            label: "Agregar",
            href: "/dashboard/invoices/create",
            active: true,
          },
        ]}
      />
      <Form categories={categories} />
    </main>
  );
}
