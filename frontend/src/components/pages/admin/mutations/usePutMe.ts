import type { Api } from "@/scripts/api";
import api from "@/scripts/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

function usePutMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: Api.UpdateUser) => {
      const res = await api().me.put(user);
      if (!res.ok) {
        toast.error(res.msg);
        console.error(res.msg);
        throw new Error(res.msg);
      }
      return null;
    },
    // When mutate is called:
    onMutate: async (data: Api.UpdateUser) => {
      await queryClient.cancelQueries({ queryKey: ["me"] });

      const previousUser = queryClient.getQueryData<Api.Week[]>(["me"]);

      if (!previousUser) {
        return { previousUser: null, newUser: null };
      }

      try {
        const newUser = { ...previousUser, ...data };
        queryClient.setQueryData(['me'], newUser);
        return { previousUser, newUser };
      } catch {
        return { previousUser, userUser: null };
      }
    },
    // If the mutation fails, use the context we returned above
    onError: (_err, _newCharacter, context) => {
      console.log(_err);
      queryClient.setQueryData(["me"], context?.previousUser);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
}

export default usePutMe;
