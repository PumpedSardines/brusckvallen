import type { Api } from "@/scripts/api";
import api from "@/scripts/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useDeleteWeek() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { week: number, year: number }) => {
      const res = await api().weeks.delete(data.week, data.year);
      if (!res.ok) {
        // toast.error(res.msg);
        // console.error(res.msg);
        // throw new Error(res.msg);
      }
      return null;
    },
    // When mutate is called:
    onMutate: async (data: { week: number, year: number }) => {
      await queryClient.cancelQueries({ queryKey: ["weeks"] });

      const previousWeeks = queryClient.getQueryData<Api.Week[]>(["weeks"]);

      if (!previousWeeks) {
        return { previousWeeks: null, newWeeks: null };
      }

      try {
        const newWeeks = previousWeeks.filter((w) => w.week !== data.week || w.year !== data.year);

        newWeeks.sort((a, b) => {
          if (a.year < b.year) {
            return -1;
          } else if (a.year > b.year) {
            return 1;
          } else {
            return a.week - b.week;
          }
        });

        queryClient.setQueryData(['weeks'], newWeeks);

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
      queryClient.invalidateQueries({ queryKey: ['weeks'] });
    },
  });
}

export default useDeleteWeek;
