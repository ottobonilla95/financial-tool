import { getUserData } from "@/src/data/user";
import { auth } from "@/auth";
import { format } from "date-fns";

export const LastUpdated = async () => {
  const session = await auth();
  const user = await getUserData(session?.user?.id as string);

  return (
    <div className="flex">
      <div className="font-bold mr-2">Ultima vez actualizado:</div>
      {format(user.lastUpdated, "EEE dd MMMM yyyy")}
    </div>
  );
};
