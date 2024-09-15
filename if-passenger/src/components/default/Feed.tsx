import { trip_type } from "@/app/api/types";
import Post from "./Post";

export default function Feed({ trips }: { trips: trip_type[] }) {
  return (
    <main className="flex flex-col items-center justify-center gap-11 mb-5">
      {trips.map((trip) => {
        return <Post post={trip} key={trip.id} />;
      })}
    </main>
  );
}
