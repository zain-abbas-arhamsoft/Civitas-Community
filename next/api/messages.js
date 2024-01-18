import { BASE_URL } from '../config'

// Fetches conversations for a user
const getConversations = async user => {
  try {
    const res = await fetch(BASE_URL + 'api/messages', {
      headers: {
        'x-access-token': user.token
      }
    })
    return await res.json()
  } catch (err) {}
}

// Fetches messages for a specific conversation
const getMessages = async (user, conversationId) => {
  try {
    const res = await fetch(BASE_URL + 'api/messages/' + conversationId, {
      headers: {
        'x-access-token': user.token
      }
    })
    return await res.json()
  } catch (err) {}
}

// Sends a message to a recipient
const sendMessage = async (user, message, recipientId) => {
  try {
    const res = await fetch(BASE_URL + 'api/messages/' + recipientId, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': user.token
      },
      body: JSON.stringify(message)
    })
    return await res.json()
  } catch (err) {}
}

export { getConversations, getMessages, sendMessage }
