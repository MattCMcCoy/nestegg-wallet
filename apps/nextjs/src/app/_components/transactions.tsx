// "use client";

// import {
//     useMutation,
//     useQueryClient,
// } from "@tanstack/react-query";

// import { toast } from "@acme/ui/toast";

// import { useTRPC } from "~/trpc/react";

// export function CreateTransactionForm() {
//     const trpc = useTRPC();

//     const queryClient = useQueryClient();
//     const createTransaction = useMutation(
//         trpc.transactions.create.mutationOptions({
//             onSuccess: async () => {
//                 await queryClient.invalidateQueries(trpc.transactions.pathFilter());
//             },
//             onError: (err) => {
//                 toast.error(
//                     err.data?.code === "UNAUTHORIZED"
//                         ? "You must be logged in to create a transaction"
//                         : "Failed to create transaction",
//                 );
//             },
//         }),
//     );

//     return null;
// }
