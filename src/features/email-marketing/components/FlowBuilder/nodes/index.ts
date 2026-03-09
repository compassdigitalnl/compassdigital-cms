export { TriggerNode } from './TriggerNode'
export { EmailNode } from './EmailNode'
export { WaitNode } from './WaitNode'
export { ConditionNode } from './ConditionNode'
export { ListNode } from './ListNode'
export { TagNode } from './TagNode'
export { WebhookNode } from './WebhookNode'
export { ExitNode } from './ExitNode'

import { TriggerNode } from './TriggerNode'
import { EmailNode } from './EmailNode'
import { WaitNode } from './WaitNode'
import { ConditionNode } from './ConditionNode'
import { ListNode } from './ListNode'
import { TagNode } from './TagNode'
import { WebhookNode } from './WebhookNode'
import { ExitNode } from './ExitNode'

export const nodeTypes = {
  triggerNode: TriggerNode,
  emailNode: EmailNode,
  waitNode: WaitNode,
  conditionNode: ConditionNode,
  listNode: ListNode,
  tagNode: TagNode,
  webhookNode: WebhookNode,
  exitNode: ExitNode,
}
