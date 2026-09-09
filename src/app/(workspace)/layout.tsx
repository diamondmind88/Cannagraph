export default function WorkspaceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div data-route-group="workspace">{children}</div>;
}
