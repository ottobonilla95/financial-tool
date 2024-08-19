import { getDBUser } from "@/src/data/user";
import { auth } from "@/auth";
import { format } from "date-fns";

export const LastUpdated = async () => {
  const session = await auth();
  const user = await getDBUser({
    filters: {
      id: session?.user?.id as string,
    },
  });

  if (!user) return null;

  return (
    <div className="flex">
      <div className="font-bold mr-2">Ultima vez actualizado:</div>
      {format(user.lastUpdated, "EEE dd MMMM yyyy")}
    </div>
  );
};
