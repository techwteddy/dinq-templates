export default function AssigneeSelect({
  name = "assignee",
  defaultValue,
  className,
  members,
}: {
  name?: string;
  defaultValue?: string | null;
  className?: string;
  members: string[];
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue ?? ""}
      className={className}
    >
      <option value="">No assignee</option>
      {members.map((member) => (
        <option key={member} value={member}>
          {member}
        </option>
      ))}
    </select>
  );
}
