interface AdminPageLayoutProps {
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
}

export function AdminPageLayout({ title, description, action, children }: AdminPageLayoutProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  )
}