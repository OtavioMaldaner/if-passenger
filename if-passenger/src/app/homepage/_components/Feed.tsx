import { trip_type } from "@/app/api/types";
import Post from "./Post";

export default function Feed({ trips }: { trips: trip_type[] }) {
  return (
    <main>
      {trips.map((trip) => {
        return <Post post={trip} key={trip.id} />;
      })}
    </main>
  );
}
