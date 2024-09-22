import { auth } from "@/auth";
import { getDBUser } from "@/src/data/user";
import { User } from "@/src/types";
import { Button } from "@/src/ui/components";

export default async function AccountPage() {
  const session = await auth();
  const userId = session?.user?.id as string;

  const user = (await getDBUser({
    filters: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      currency: {
        select: {
          name: true,
          symbol: true,
        },
      },
    },
  })) as User;

  return (
    <div className="mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tu cuenta</h1>

      <div className="mb-8">
        <div>
          <p>
            <strong>Nombre:</strong> {user.name}
          </p>
        </div>

        <div>
          <p>
            <strong>Correo electrónico:</strong> {user.email}
          </p>
        </div>
        <div>
          <p>
            <strong>Moneda:</strong> ({user.currency?.symbol})
            {user.currency?.name}
          </p>
        </div>

        <div className="flex justify-between items-center py-1">
          <p>
            <strong>Contraseña:</strong> ********
          </p>
          <div>
            <Button href="/dashboard/account/change-password">
              Cambiar Contraseña
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
