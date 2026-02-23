import { ChatLayout } from "@/components/chat/chat-layout";

export default function ConversationPage({
  params,
}: {
  params: { conversationId: string };
}) {
  return <ChatLayout conversationId={params.conversationId} />;
}
