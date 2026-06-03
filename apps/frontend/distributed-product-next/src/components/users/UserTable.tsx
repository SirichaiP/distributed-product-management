import { User } from "@/types/user.type";

interface Props {
  users: User[];
}

export default function UserTable({ users }: Props) {
  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
        </tr>
      </thead> 

      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.fullName}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{user.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}