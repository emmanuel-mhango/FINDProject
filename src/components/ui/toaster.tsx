import { useToast } from "@/hooks/use-toast"
import MessageDialog from "@/components/MessageDialog"

export function Toaster() {
  const { toasts, dismiss } = useToast()
  const activeToast = toasts[0]

  if (!activeToast) {
    return null
  }

  const title =
    typeof activeToast.title === "string"
      ? activeToast.title
      : "Notification"
  const description =
    typeof activeToast.description === "string"
      ? activeToast.description
      : ""

  return (
    <MessageDialog
      open={activeToast.open ?? true}
      onOpenChange={() => dismiss(activeToast.id)}
      title={title}
      description={description}
      variant={activeToast.variant === "destructive" ? "destructive" : "default"}
    />
  )
}
