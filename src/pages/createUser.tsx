import { useCreateUser } from "../hook/useUser";

export const CreateUser = () => {    
    const create_user = useCreateUser();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const data = Object.fromEntries(new FormData(form));

        await create_user.mutateAsync({ name: data.user as string })
        form.reset();
    }

    return (
        <div>
            <h1>Create User</h1>
            <form onSubmit={handleSubmit} className="mt">
                <input name='user' type="text" placeholder="Add new user" />

                <button>Add user</button>

            </form>
        </div>
    )
}