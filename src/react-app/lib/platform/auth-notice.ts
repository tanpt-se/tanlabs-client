export function resolveAuthNoticeByReason<TNotice>(
  reason: string | undefined,
  notices: Record<string, TNotice>,
) {
  if (!reason) {
    return undefined;
  }

  return notices[reason];
}
