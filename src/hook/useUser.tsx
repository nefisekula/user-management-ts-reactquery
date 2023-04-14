import { QueryObserver, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUser, deleteUser, editUser, getUsers } from '../api/users';
import { User } from '../types/user';
import { useEffect, useState } from 'react';

const key = 'users'

export const useGetUsers = () => {
    return useQuery([key], getUsers);
}

export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation(createUser, {
        // onSuccess (it's also a func) property is executed when the request is successful.
        // It receives several parameters, and the first one is the data returned by the createUser function
        onSuccess: (user: User) => {

            //key is the cache data we want to reach
            queryClient.setQueriesData([key],
                (prevUsers: User[] | undefined) => prevUsers ? [user, ...prevUsers] : [user]
            )

            // It invalidates the cache and re-request the data from the server. 
            // We're not working on real API so to prevent to lost data, we will work on the cache
            // queryClient.invalidateQueries([key])
        }
    })
}

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation(deleteUser, {
        onSuccess: (id) => {
            queryClient.setQueryData([key],
                (prevUsers: User[] | undefined) => prevUsers ? prevUsers.filter(user => user.id !== id) : prevUsers
            )
        }
    });
}

export const useEditUser = () => {
    const queryClient = useQueryClient();

    return useMutation(editUser, {
        onSuccess: (user_updated: User) => {
            queryClient.setQueryData([key],
                (prevUsers: User[] | undefined) => {
                    if (prevUsers) {
                        prevUsers.map(user => {
                            if (user.id === user_updated.id) {
                                user.name = user_updated.name
                            }
                        })
                    }
                    return prevUsers;
                })
        }
    })
}

export const useGetUsersObserver = () => {

    const get_users = useGetUsers()

    const queryClient = useQueryClient()

    const [users, setUsers] = useState<User[]>(() => {
        // get data from cache
        const data = queryClient.getQueryData<User[]>([key])
        return data ?? []
    })

    useEffect(() => {
        const observer = new QueryObserver<User[]>(queryClient, { queryKey: [key] })

        const unsubscribe = observer.subscribe(result => {
            if (result.data) setUsers(result.data)
        })

        return () => { unsubscribe() }
    }, [])

    return {
        ...get_users,
        data: users,
    }
}