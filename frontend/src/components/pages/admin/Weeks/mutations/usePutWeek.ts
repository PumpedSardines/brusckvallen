import type { Api } from "@/scripts/api";
import api from "@/scripts/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

function usePutWeek() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (week: Api.Week) => {
      const res = await api().weeks.put(week);
      if (!res.ok) {
        toast.error(res.msg);
        console.error(res.msg);
        throw new Error(res.msg);
      }
      return null;
    },
    // When mutate is called:
    onMutate: async (week: Api.Week) => {
      await queryClient.cancelQueries({ queryKey: ["weeks"] });

      const previousWeeks = queryClient.getQueryData<Api.Week[]>(["weeks"]);

      if (!previousWeeks) {
        return { previousWeeks: null, newWeeks: null };
      }

      try {
        const newWeeks = JSON.parse(
          JSON.stringify(previousWeeks),
        ) as Api.Week[];
        const cWeek = newWeeks.find(
          (w) => w.week === week.week && w.year === week.year,
        );
        if (!cWeek) {
          newWeeks.push(week);
          newWeeks.sort((a, b) => {
            if (a.year < b.year) {
              return -1;
            } else if (a.year > b.year) {
              return 1;
            } else {
              return a.week - b.week;
            }
          });
        } else {
          cWeek.week = week.week;
          cWeek.year = week.year;
          cWeek.price = week.price;
          cWeek.booked = week.booked;
          cWeek.hidden = week.hidden;
        }

        queryClient.setQueryData(["weeks"], newWeeks);

        return { previousWeeks, newWeeks };
      } catch {
        return { previousWeeks, newWeeks: null };
      }
    },
    // If the mutation fails, use the context we returned above
    onError: (_err, _newCharacter, context) => {
      console.log(_err);
      queryClient.setQueryData(["weeks"], context?.previousWeeks);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["weeks"] });
    },
  });
}

export default usePutWeek;
