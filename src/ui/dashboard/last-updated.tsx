import { getDBUser } from "@/src/data/user";
import { auth } from "@/auth";
import { format } from "date-fns";
import { AppDictionary } from "@/src/translations";

export type LastUpdatedProps = {
  dict: AppDictionary;
};
export const LastUpdated = async ({ dict }: LastUpdatedProps) => {
  const session = await auth();
  const user = await getDBUser({
    filters: {
      id: session?.user?.id as string,
    },
  });

  if (!user) return null;

  return (
    <div className="flex">
      <div className="font-bold mr-2">{`${dict.dashboard.lastUpdated}:`}</div>
      {format(user.lastUpdated, "EEE dd MMMM yyyy")}
    </div>
  );
};
