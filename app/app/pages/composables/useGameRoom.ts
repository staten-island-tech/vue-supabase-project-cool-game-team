export function useGameRoom(roomId: string) {
  const supabase = useSupabaseClient()

  const channel = supabase.channel(`room-${roomId}`)

  channel.subscribe()

  const sendBoardUpdate = (payload: any) => {
    channel.send({
      type: 'broadcast',
      event: 'board_update',
      payload
    })
  }

  const onBoardUpdate = (callback: (payload: any) => void) => {
    channel.on(
      'broadcast',
      { event: 'board_update' },
      ({ payload }) => callback(payload)
    )
  }

  const cleanup = async () => {
    await channel.unsubscribe()
  }

  return {
    sendBoardUpdate,
    onBoardUpdate,
    cleanup
  }
}