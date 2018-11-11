function createjob(state, payload, blockInfo, context) {
  const job = {
    _id: {
      timestamp: payload.data.timestamp,
      employee: payload.data.author
    },
    author: payload.data.author,
    title: payload.data.title,
    content: payload.data.content,
    tag: payload.data.tag
  }
  context.socket.emit("createjob", post)
}

export default createJob
