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
    <div className="flex bg-white px-6 md:px-12 py-8 shadow-sm">
      <div className="font-bold mr-2 text-gray-600">{`${dict.dashboard.lastUpdated}:`}</div>
      <span className="text-gray-500">
        {format(user.lastUpdated, "EEE dd MMMM yyyy")}
      </span>
    </div>
  );
};
